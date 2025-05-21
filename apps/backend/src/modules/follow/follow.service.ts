import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../../core/prisma/prisma.service";
import {User} from "../../../prisma/generated";
import {NotificationService} from "../notification/notification.service";
import {TelegramService} from "../libs/telegram/telegram.service";

@Injectable()
export class FollowService {

    constructor(private readonly prisma: PrismaService,
                private readonly notificationService: NotificationService,
                private readonly telegramService: TelegramService,) {
    }

    async findMyFollows(user: User) {
        const follows = await this.prisma.follow.findMany({
            where: {
                followingId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                follower: true
            }
        });
        return follows;
    }

    async findMyFollowings(user: User) {
        const followings = await this.prisma.follow.findMany({
            where: {
                followerId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                following: true
            }
        });
        return followings;
    }

    async follow(user: User, channelId: number) {
        const channel = await this.prisma.follow.findUnique({
            where: {
                id: channelId
            }
        });
        if (!channel) {
            throw new NotFoundException('Channel not found.');
        }
        if (channel.id === user.id) {
            throw new ConflictException("You can't subscribe to yourself!");
        }
        const existingFollow = await this.prisma.follow.findFirst({
            where: {
                followerId: user.id,
                followingId: channelId
            }
        });
        if (existingFollow) {
            throw new ConflictException("You already subscribed to this channel");
        }
        const follow = await this.prisma.follow.create({
            data: {
                followerId: user.id,
                followingId: channelId,
            },
            include: {
                follower: true,
                following: {
                    include: {
                        notificationSettings: true
                    }
                }
            }

        });
        if (follow.following.notificationSettings?.siteNotifications) {
            await this.notificationService.createNewFollowing(follow.followingId, follow.follower);
        }
        if (follow.following.notificationSettings?.telegramNotifications && follow.follower.telegramId) {
            await this.telegramService.sendNewFollowing(follow.follower.telegramId, follow.follower);
        }

        return true;
    }

    async unfollow(user: User, channelId: number) {
        const channel = await this.prisma.follow.findUnique({
            where: {
                id: channelId
            }
        });
        if (!channel) {
            throw new NotFoundException('Channel not found.');
        }
        if (channel.id === user.id) {
            throw new ConflictException("You can't unsubscribe to yourself!");
        }
        const existingFollow = await this.prisma.follow.findFirst({
            where: {
                followerId: user.id,
                followingId: channelId
            }
        });
        if (!existingFollow) {
            throw new ConflictException("You don't subscribed to this channel");
        }
        await this.prisma.follow.delete({
            where: {
                id: existingFollow.id,
                followingId: channelId,
                followerId: user.id
            }

        });
        return true;
    }

}
