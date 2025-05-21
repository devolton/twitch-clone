import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../../core/prisma/prisma.service";
import {SendMessageInput} from "./inputs/send-message.input";
import {ChangeChatSettingsInput} from "./inputs/change-chat-settings.input";
import {User} from "../../../prisma/generated";

@Injectable()
export class ChatService {
    constructor(private readonly prisma: PrismaService) {
    }

    async findMessagesByStream(streamId: number) {
        const messages = await this.prisma.chatMessage.findMany({
            where: {
                streamId
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: true
            }
        })
        return messages;
    }

    async sendMessage(userId: number, input: SendMessageInput) {
        const {text, streamId} = input;
        const stream = await this.prisma.stream.findUnique({
            where: {
                id: streamId,
            }
        });
        if (!stream) {
            throw new NotFoundException("Not Found");
        }
        if (!stream.isLive) {
            throw new BadRequestException("Stream is not Live");
        }
        const message = await this.prisma.chatMessage.create({
            data: {
                text,
                user: {
                    connect: {
                        id: userId
                    }
                },
                stream: {
                    connect: {
                        id: streamId,
                    }
                }
            }
        })
        return message;
    }

    async changeSettings(user: User, input: ChangeChatSettingsInput) {
        const {
            isChatEnabled,
            isChatPremiumFollowersOnly,
            isChatFollowersOnly
        } = input;
        await this.prisma.stream.update({
            where: {
                userId: user.id
            },
            data: {
                isChatEnabled,
                isChatFollowersOnly,
                isChatPremiumFollowersOnly
            }
        })
        return true;
    }
}
