import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../../core/prisma/prisma.service";
import {FilterInput} from "./inputs/filter.input";
import {Prisma, User} from "../../../prisma/generated";
import {ChangeInfoStreamInput} from "./inputs/change-info-stream.input";
import Upload from 'graphql-upload/Upload.mjs'
import * as sharp from 'sharp'
import {StorageService} from "../libs/storage/storage.service";
import {getBufferFromFile} from "../../shared/utils/get-buffer-from-file";
import {GenerateStreamTokenInput} from "./inputs/generate-stream-token.input";
import {ConfigService} from "@nestjs/config";
import {AccessToken} from "livekit-server-sdk";
import {GenerateTokenModel} from "./models/generate-token.model";

@Injectable()
export class StreamService {
    constructor(private readonly prisma: PrismaService,
                private readonly configService: ConfigService,
                private readonly storageService: StorageService,) {
    }

    async findAll(input: FilterInput = {}) {
        const {take, skip, searchTerm} = input;
        const where = searchTerm ? this.findBySearchTermInput(searchTerm) : undefined;
        const streams = await this.prisma.stream.findMany({
            take: take ?? 12,
            skip: skip ?? 0,
            where: {
                user: {
                    isDeactivated: false
                },
                ...where
            },
            include: {
                user: true,
                category:true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return streams;
    }

    async changeInfo(user: User, input: ChangeInfoStreamInput) {
        const {title, categoryId} = input;

        await this.prisma.stream.update({
            where: {
                userId: user.id
            },
            data: {
                title,
                category: {
                    connect: {
                        id: categoryId
                    }
                }
            }
        })
        return true;
    }

    async findRandomStreams() {
        const total: number = await this.prisma.stream.count({
            where: {
                user: {
                    isDeactivated: false
                }
            }
        });
        let randomIndexes = new Set<number>();
        while (randomIndexes.size < 4) {
            const randomIndex = Math.floor(Math.random() * total);
            randomIndexes.add(randomIndex);
        }
        const streams = await this.prisma.stream.findMany({
            where: {
                user: {
                    isDeactivated: false
                },
            },
            include: {
                user: true,
                category: true
            },
            take: total,
            skip: 0
        });

        return Array.from(randomIndexes).map(index => streams[index]);


    }

    async changeThumbnail(user: User, file: Upload) {
        const stream = await this.findStreamByUserId(user);
        if (stream && stream.thumbnailUrl) {
            await this.storageService.remove(stream.thumbnailUrl);
        }
        const buffer = await getBufferFromFile(file);
        const fileName = `/streams/${user.username}.webp`;
        if (file.filename && file.filename.endsWith('.gif')) {
            const processedBuffer = await sharp(buffer, {animated: true})
                .resize(1280, 720)
                .webp()
                .toBuffer();
            await this.storageService.upload(processedBuffer, fileName, 'image/webp');
        } else {
            const processedBuffer = await sharp(buffer)
                .resize(1280, 720)
                .webp()
                .toBuffer();
            await this.storageService.upload(processedBuffer, fileName, 'image/webp');
        }
        await this.prisma.stream.update({
            where: {
                userId: user.id,
            },
            data: {
                thumbnailUrl: fileName
            }
        })
        return true;
    }

    async removeThumbnail(user: User) {
        const stream = await this.findStreamByUserId(user);
        if (!stream || !stream.thumbnailUrl) {
            return;
        }
        await this.storageService.remove(stream.thumbnailUrl);
        await this.prisma.stream.update({
            where: {
                userId: user.id
            },
            data: {
                thumbnailUrl: null
            }
        });
        return true;
    }

    private async findStreamByUserId(user: User) {
        const stream = await this.prisma.stream.findUnique({
            where: {
                userId: user.id
            }
        })

        return stream;
    }


    private findBySearchTermInput(searchTerm: string): Prisma.StreamWhereInput {
        return {
            OR: [
                {
                    title: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                },
                {
                    user: {
                        username: {
                            contains: searchTerm,
                            mode: "insensitive"
                        }
                    }
                }
            ]
        }

    }

    async generateToken(input: GenerateStreamTokenInput): Promise<GenerateTokenModel> {
        const {userId, channelId} = input;
        let self: Pick<User, 'id' | 'username'>;
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            }
        });
        if (user) {
            self = {id: user.id, username: user.username}
        } else {
            self = {id: userId, username: `Viewer ${Math.random() * 100000}`};
        }

        const channel = await this.prisma.stream.findUnique({
            where: {
                id: channelId,
            }
        });
        if (!channel) {
            throw new NotFoundException(`Channel with id ${channelId} not found`);
        }
        const isHost = self.id === channel.id;

        const token = new AccessToken(
            this.configService.getOrThrow<string>("LIVEKIT_API_KEY"),
            this.configService.getOrThrow<string>("LIVEKIT_API_SECRET"), {
                identity: isHost ? `Host-${self.id}` : self.id.toString(),
                name: self.username
            }
        );
        token.addGrant({
            room: channel.id.toString(),
            roomJoin: true,
            canPublish: false
        })
        return {token: token.toJwt()}


    }

}
