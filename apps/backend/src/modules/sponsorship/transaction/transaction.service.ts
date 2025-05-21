import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../../../core/prisma/prisma.service";
import {ConfigService} from "@nestjs/config";
import {User} from "../../../../prisma/generated";
import {StripeService} from "../../libs/stripe/stripe.service";

@Injectable()
export class TransactionService {
    constructor(private readonly prisma: PrismaService,
                private readonly configService: ConfigService,
                private readonly stripeService: StripeService) {
    }

    async findMyTransactions(user: User) {
        return this.prisma.transaction.findMany({
            where: {
                userId: user.id
            }
        });
    }

    async makePayment(user: User, planId: number) {
        const plan = await this.prisma.sponsorshipPlan.findUnique({
            where: {
                id: planId
            },
            include: {
                channel: true
            }
        });
        if (!plan) {
            throw new NotFoundException("Plan not found.");
        }
        if (user.id === plan.channel?.id) {
            throw new ConflictException("You can't apply sponsorship on yourself!")
        }
        const existingSubscription = await this.prisma.sponsorshipSubscription.findFirst({
            where: {
                userId: user.id,
                channelId: plan.channel?.id
            }
        });
        if (existingSubscription) {
            throw new ConflictException("You have already signed up for sponsorship for this channel")
        }
        const customer = await this.stripeService.customers.create({
            name: user.username,
            email: user.email,
        });
        const session = await this.stripeService.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: "uah",
                        product_data: {
                            name: plan.title,
                            description: plan.description ?? ''
                        },
                        unit_amount: Math.round(plan.price * 100),
                        recurring: {
                            interval: 'month'
                        }
                    }
                }
            ],
            mode: 'subscription',
            success_url: `${this.configService.getOrThrow("ALLOWED_ORIGIN")}/success?price=${plan.price}&username=${plan.channel?.username}`,
            cancel_url: this.configService.getOrThrow("ALLOWED_ORIGIN"),
            customer: customer.id,
            metadata: {
                planId: plan.id,
                userId: user.id,
                channelId: plan.channel!.id //todo use !
            }
        })
        await this.prisma.transaction.create({
            data: {
                amount: plan.price,
                currency: session.currency ?? 'uah',
                stripeSubscriptionId: session.id,
                user: {
                    connect: {
                        id: user.id
                    }
                }
            }
        });
        return {url: session.url};
    }


}
