import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../../core/prisma/prisma.service";
import {LivekitService} from "../libs/livekit/livekit.service";
import {WebhookEvent} from "livekit-server-sdk";
import {NotificationService} from "../notification/notification.service";
import {TelegramService} from "../libs/telegram/telegram.service";
import Stripe from "stripe";
import {TransactionStatus} from "../../../prisma/generated";
import {StripeService} from "../libs/stripe/stripe.service";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class WebhookService {
    constructor(private readonly prisma: PrismaService,
                private readonly livekit: LivekitService,
                private readonly notificationService: NotificationService,
                private readonly stripeService: StripeService,
                private readonly configService: ConfigService,
                private readonly telegramService: TelegramService,) {
    }

    async receiveWebhookLivekit(body: string, authorization: string) {
        const event: WebhookEvent = this.livekit.reciever.receive(body, authorization); //todo if don't work add true in third param
        if (event.event === 'ingress_started') {
            console.log("STREAM IS STARTED!", event.ingressInfo?.url)
            const stream = await this.prisma.stream.update({
                where: {
                    ingressId: event.ingressInfo?.ingressId
                },
                data: {
                    isLive: true
                },
                include: {
                    user: true
                }
            });
            const followers = await this.prisma.follow.findMany({
                where: {
                    followingId: stream.user?.id,
                    follower: {
                        isDeactivated: false
                    }
                },
                include: {
                    follower: {
                        include: {
                            notificationSettings: true
                        }
                    }
                }
            });
            for (const follow of followers) {
                const follower = follow.follower;
                if (follower.notificationSettings?.siteNotifications) {
                    await this.notificationService.createStreamStart(follower.id, stream.user!); //todo if remove ! will be error(check this costil)
                }
                if (follower.notificationSettings?.telegramNotifications && follower.telegramId) {
                    await this.telegramService.sendStreamStartMessage(follower.telegramId, follower);
                }
            }

        } else if (event.event === 'ingress_ended') {
            console.log("STREAM IS ENDED!")
            const stream = await this.prisma.stream.update({
                where: {
                    ingressId: event.ingressInfo?.ingressId
                },
                data: {
                    isLive: false
                }
            });
            await this.prisma.chatMessage.deleteMany({
                where: {
                    streamId: stream.id
                }
            })
        }
        //todo edd delete stream messages from database functionality
    }

    async receiveWebhookStripe(event: Stripe.Event) {
        const session = event.data.object as Stripe.Checkout.Session;

        if (event.type === 'checkout.session.completed') {
            const planId = Number(session.metadata?.planId)
            const userId = Number(session.metadata?.userId)
            const channelId = Number(session.metadata?.channelId)
            if (!planId || !userId || !channelId) {
                throw new BadRequestException("Something went wrong");
            }

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDay() + 30);
            const sponsorshipSubscription = await this.prisma.sponsorshipSubscription.create({
                data: {
                    expiresAt,
                    planId,
                    userId,
                    channelId
                },
                include: {
                    plan: true,
                    user: true,
                    channel: {
                        include: {
                            notificationSettings: true
                        }
                    }
                }
            });
            await this.prisma.transaction.updateMany({
                where: {
                    stripeSubscriptionId: session.id,
                    status: TransactionStatus.PENDING
                },
                data: {
                    status: TransactionStatus.SUCCESS
                }
            })
            if (sponsorshipSubscription.channel?.notificationSettings?.siteNotifications) {
                await this.notificationService.createNewSponsorship(
                    sponsorshipSubscription.channel.id,
                    sponsorshipSubscription.plan!,
                    sponsorshipSubscription.user!
                );
            }
            if (sponsorshipSubscription.channel?.notificationSettings?.telegramNotifications && sponsorshipSubscription.channel.telegramId) {
                await this.telegramService.sendNewSponsorship(
                    sponsorshipSubscription.channel.telegramId,
                    sponsorshipSubscription.plan!,
                    sponsorshipSubscription.user!
                );
            }
        } else if (event.type === 'checkout.session.expired') {
            await this.prisma.transaction.updateMany({
                where: {
                    stripeSubscriptionId: session.id
                },
                data: {
                    status: TransactionStatus.EXPIRED
                }
            })
        } else if (event.type == 'checkout.session.async_payment_failed') {
            await this.prisma.transaction.updateMany({
                where: {
                    stripeSubscriptionId: session.id
                },
                data: {
                    status: TransactionStatus.FAILED
                }
            })
        }
    }

    constructTypeEvent(payload: any, signature: any) {
        return this.stripeService.webhooks.constructEvent(
            payload,
            signature,
            this.configService.getOrThrow("STRIPE_WEBHOOK_SECRET")
        )
    }
}
