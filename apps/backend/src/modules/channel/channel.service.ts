import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../../core/prisma/prisma.service";

@Injectable()
export class ChannelService {
    constructor(private readonly prisma: PrismaService) {
    }


    async findRecommendedChannels() {
        return this.prisma.user.findMany({
            where: {
                isDeactivated: false
            },
            orderBy: {
                followings: {
                    _count: 'desc'
                }
            },
            include: {
                stream: true
            },
            take: 7
        });
    }

    async findByUsername(username: string) {
        const channel = await this.prisma.user.findUnique({
            where: {
                username,
                isDeactivated: false
            },
            include: {
                socialLinks: {
                    orderBy: {
                        position: 'asc'
                    }
                },
                stream: {
                    include: {
                        category: true
                    }
                },
                followings: true
            }
        });
        if (!channel) {
            throw new NotFoundException("Channel not found");
        }
        return channel;
    }

    async findFollowersCountByChannel(channelId: number) {
        const followersCount: number = await this.prisma.follow.count({
            where: {
                following: {
                    id: channelId
                }
            }
        })
        return followersCount;
    }

    async findSponsorsByChannel(channelId: number) {
        const channel = await this.prisma.user.findUnique({
            where: {
                id: channelId
            }
        });
        if (!channel) {
            throw new NotFoundException("Channel not found");
        }
        return this.prisma.sponsorshipSubscription.findMany({
            where: {
                channelId
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                plan: true,
                user: true
            }
        })
    }


}
