import {ConflictException, Injectable} from '@nestjs/common';
import {PrismaService} from "../../../core/prisma/prisma.service";
import {StorageService} from "../../libs/storage/storage.service";
import {User} from "../../../../prisma/generated";
import * as sharp from 'sharp'
import Upload from 'graphql-upload/Upload.mjs'
import {ChangeProfileInfoInput} from "./inputs/change-profile-info.input";
import {SocialLinkInput} from "./inputs/social-link.input";
import {SocialLinkOrderInput} from "./inputs/social-link-order.input";
import {getBufferFromFile} from "../../../shared/utils/get-buffer-from-file";

@Injectable()
export class ProfileService {
    constructor(private readonly prisma: PrismaService,
                private readonly storageService: StorageService,) {
    }

    async findSocialLinks(user: User) {
        const socialLinks = await this.prisma.socialLink.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                position: 'asc'
            }
        });
        return socialLinks;
    }

    async changeAvatar(user: User, file: Upload) {
        if (user.avatar) {
            await this.storageService.remove(user.avatar);
        }
        const buffer = await getBufferFromFile(file);
        const fileName = `/channels/${user.username}.webp`;
        if (file.filename && file.filename.endsWith('.gif')) {
            const processedBuffer = await sharp(buffer, {animated: true})
                .resize(512, 512)
                .webp()
                .toBuffer();
            await this.storageService.upload(processedBuffer, fileName, 'image/webp');
        } else {
            const processedBuffer = await sharp(buffer)
                .resize(512, 512)
                .webp()
                .toBuffer();
            await this.storageService.upload(processedBuffer, fileName, 'image/webp');
        }
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                avatar: fileName
            }
        })
        return true;
    }

    async removeAvatar(user: User) {
        if (!user.avatar) {
            return;
        }
        await this.storageService.remove(user.avatar);
        await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                avatar: null
            }
        });
        return true;
    }

    async changeInfo(user: User, input: ChangeProfileInfoInput) {
        const {username, displayName, bio} = input;
        const usernameExist = await this.prisma.user.findUnique({
            where: {
                username
            }
        });
        if (usernameExist && username !== user.username) {
            throw new ConflictException("Username already exist");
        }
        await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                username,
                displayName,
                bio
            }
        })
        return true;
    }

    async createSocialLink(user: User, input: SocialLinkInput) {
        const {title, url} = input;
        const lastSocialLink = await this.prisma.socialLink.findFirst({
            where: {
                userId: user.id
            },
            orderBy:
                {position: 'desc'}

        });
        const newPosition: number = lastSocialLink ? lastSocialLink.position + 1 : 1;
        await this.prisma.socialLink.create({
            data: {
                title,
                url,
                position: newPosition,
                user: {
                    connect: {
                        id: user.id
                    }
                }
            }
        });
        return true;

    }

    async reorderSocialLink(list: SocialLinkOrderInput[]) {
        if (!list.length) {
            return;
        }
        const updatePromise = list.map(socialLink => this.prisma.socialLink.update({
            where: {
                id: socialLink.id
            },
            data: {
                position: socialLink.position
            }
        }));
        await Promise.all(updatePromise);
        return true;
    }

    async updateSocialLink(id: number, input: SocialLinkInput) {
        const {title, url} = input;

        await this.prisma.socialLink.update({
            where: {
                id
            },
            data: {
                title,
                url
            }
        });
        return true;

    }

    async removeSocialLink(id: number) {
        await this.prisma.socialLink.delete({
            where: {
                id
            }
        })
        return true;
    }
}

