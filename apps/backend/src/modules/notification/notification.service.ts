import {Injectable} from '@nestjs/common';
import {PrismaService} from "../../core/prisma/prisma.service";
import {$Enums, NotificationType,type SponsorshipPlan, type Token,type  User} from "../../../prisma/generated";
import {ChangeNotificationSettingsInput} from "./inputs/change-notification-settings.input";
import {generateToken} from "../../shared/utils/generate-token.util";
import TokenType = $Enums.TokenType;

@Injectable()
export class NotificationService {
    constructor(private readonly prisma: PrismaService) {
    }

    async findUnreadCount(user: User) {
        return this.prisma.notification.count({
            where: {
                userId: user.id,
                isRead: false
            }
        })
    }

    async findByUser(user: User) {
        await this.prisma.notification.updateMany({
            where: {
                isRead: false,
                userId: user.id
            },
            data: {
                isRead: true,
            }
        })
        const notifications = await this.prisma.notification.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return notifications;
    }

    async changeSettings(user: User, input: ChangeNotificationSettingsInput) {
        const {telegramNotifications, siteNotifications} = input;
        const notificationSettings = await this.prisma.notificationSetting.upsert({
            where: {
                userId: user.id
            },
            create: {
                telegramNotifications,
                siteNotifications,
                user: {
                    connect: {
                        id: user.id
                    }
                }
            },
            update: {
                telegramNotifications,
                siteNotifications
            },
            include: {
                user: true
            }
        });
        if (notificationSettings.telegramNotifications && !notificationSettings.user?.telegramId) {
            const telegramAuthToken: Token = await generateToken(this.prisma, user, TokenType.TELEGRAM_AUTH);
            return {
                notificationSettings,
                telegramAuthToken: telegramAuthToken.token
            };
        }
        if (!notificationSettings.telegramNotifications && notificationSettings.user?.telegramId) {
            await this.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    telegramId: null
                }
            })
            return {notificationSettings};
        }
        return {notificationSettings}

    }

    async createStreamStart(userId:number, channel:User){
        return this.prisma.notification.create({
            data:{
                message:`<b className='font-medium'>Don't miss it!</b>
				<p>Join the stream on the channel <a href='/${channel.username}' className='font-semibold'>${channel.displayName}</a>.</p>`,
                type:NotificationType.STREAM_START,
                user:{
                    connect:{
                        id:userId
                    }
                }
            }
        })
    }
    async createNewFollowing(userId:number,follower:User){
        return this.prisma.notification.create({
            data:{
                message:`<b className='font-medium'>You have a new subscriber!</b>
				<p>This subscriber is <a href='/${follower.username}' className='font-semibold'>${follower.displayName}</a>.</p>`,
                type:NotificationType.NEW_FOLLOWER,
                user:{
                    connect:{
                        id:userId
                    }
                }
            }
        })
    }

    async createNewSponsorship(userId:number,plan:SponsorshipPlan,sponsor:User){
        this.prisma.notification.create({
            data:{
                message:`<b className='font-medium'>You have a new sponsor!</b>
				<p>This sponsor is <a href='/${sponsor.username}' className='font-semibold'>${sponsor.displayName}</a> with ${plan.title} plan! </p>`,
                type:NotificationType.NEW_SPONSORSHIP,
                user:{
                    connect:{
                        id:userId
                    }
                }
            }
        })
    }

    public async createEnableTwoFactor(userId: number) {
        const notification = await this.prisma.notification.create({
            data: {
                message: `<b className='font-medium'>Обеспечьте свою безопасность!</b>
				<p>Включите двухфакторную аутентификацию в настройках вашего аккаунта, чтобы повысить уровень защиты.</p>`,
                type: NotificationType.ENABLE_TWO_FACTOR,
                userId
            }
        })

        return notification
    }

    public async createVerifyChannel(userId: number) {
        const notification = await this.prisma.notification.create({
            data: {
                message: `<b className='font-medium'>Поздравляем!</b>
			  <p>Ваш канал верифицирован, и теперь рядом с вашим каналом будет галочка.</p>`,
                type: NotificationType.VERIFIED_CHANNEL,
                userId
            }
        })

        return notification
    }


}
