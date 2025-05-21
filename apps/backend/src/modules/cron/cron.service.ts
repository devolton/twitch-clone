import {Injectable} from '@nestjs/common';
import {MailService} from "../libs/mail/mail.service";
import {PrismaService} from "../../core/prisma/prisma.service";
import {Cron, CronExpression} from "@nestjs/schedule";
import {StorageService} from "../libs/storage/storage.service";
import {TelegramService} from "../libs/telegram/telegram.service";
import {NotificationService} from "../notification/notification.service";

@Injectable()
export class CronService {
    constructor(private readonly prisma: PrismaService,
                private readonly mailService: MailService,
                private readonly notificationService: NotificationService,
                private readonly storageService: StorageService,
                private readonly telegramService: TelegramService) {
    }

    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async deleteDeactivationAccounts() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDay() - 7);

        const deactivatedAccount = await this.prisma.user.findMany({
            where: {
                isDeactivated: true,
                deactivatedAt: {
                    lte: sevenDaysAgo,
                },
            },
            include: {
                notificationSettings: true,
                stream: true
            }
        });
        for (const user of deactivatedAccount) {
            await this.mailService.sendAccountDeletion(user.email);
            if (user.notificationSettings?.telegramNotifications && user.telegramId) {
                await this.telegramService.sendAccountDeletion(user.telegramId);
            }
            if (user.avatar) {
                await this.storageService.remove(user.avatar);
            }
            if (user.stream?.thumbnailUrl) {
                await this.storageService.remove(user.stream.thumbnailUrl);
            }
        }
        await this.prisma.user.deleteMany({
            where: {
                isDeactivated: true,
                deactivatedAt: {
                    lte: sevenDaysAgo,
                }
            }
        })
    }

    @Cron('0 0 */4 * *')
    async notifyUserEnableTwoFactory() {
        const users = await this.prisma.user.findMany({
            where: {
                isDeactivated: false
            },
            include: {
                notificationSettings: true,
            }
        })
        for (const user of users) {
            await this.mailService.sendEnableTwoFactor(user.email);
            if (user.notificationSettings?.siteNotifications) {
                await this.notificationService.createEnableTwoFactor(user.id);
            }
            if (user.notificationSettings?.telegramNotifications) {
                await this.telegramService.sendEnableTwoFactor(user.telegramId!);
            }
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async verifyChannels() {
        const users = await this.prisma.user.findMany({
            include: {
                notificationSettings: true,
            }
        })
        for (const user of users) {
            const followersCount = await this.prisma.follow.count({
                where: {
                    followingId: user.id
                }
            });
            if (followersCount >= 10 && !user.isVerified) {
                await this.prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        isVerified: true
                    }
                });

                await this.mailService.sendVerifyChannel(user.email);
                if (user.notificationSettings?.siteNotifications) {
                    await this.notificationService.createVerifyChannel(user.id);
                }
                if (user.notificationSettings?.telegramNotifications) {
                    await this.telegramService.sendVerifyChannel(user.telegramId!);
                }

            }
        }

    }

    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async deleteOldNotifications() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        await this.prisma.notification.deleteMany({
            where: {
                createdAt: {
                    lte: sevenDaysAgo,
                }
            }
        })
    }

}
