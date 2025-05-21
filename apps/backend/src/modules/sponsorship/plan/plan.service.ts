import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../../../core/prisma/prisma.service";
import {StripeService} from "../../libs/stripe/stripe.service";
import type {User} from "../../../../prisma/generated";
import type {CreatePlanInput} from "./inputs/create-plan.input";

@Injectable()
export class PlanService {
    constructor(private readonly prisma: PrismaService,
                private readonly stripeService: StripeService) {
    }

    async findMyPlan(user: User) {
        return this.prisma.sponsorshipPlan.findMany({
            where: {
                channelId: user.id
            }
        });

    }

    async createPlan(user: User, input: CreatePlanInput) {
        const {title, description, price} = input;
        const channel: User | null = await this.prisma.user.findUnique({
            where: {
                id: user.id
            }
        });
        if (!channel) {
            throw new NotFoundException("Channel not found!");
        }
        if (!channel.isVerified) {
            throw new ForbiddenException("You can create plan only if your channel is verified!");
        }
        const stripePlan = await this.stripeService.plans.create({
            amount: Math.round(price * 100),
            currency: "UAH", //todo maybe change to other currency
            interval: "month",
            product: title
        })
        await this.prisma.sponsorshipPlan.create({
            data: {
                title,
                description,
                price,
                stripeProductId: stripePlan.product!.toString(), //todo maybe dont work
                stripePlanId: stripePlan.id,
                channel: {
                    connect: {
                        id: user.id
                    }
                }
            }
        })
        return true;
    }

    async removePlan(planId: number) {
        const plan = await this.prisma.sponsorshipPlan.findUnique({
            where: {
                id: planId
            }
        });
        if (!plan) {
            throw new NotFoundException("Stripe plan not found!");
        }
        await this.stripeService.plans.del(plan.stripePlanId);
        await this.stripeService.products.del(plan.stripeProductId);
        await this.prisma.sponsorshipPlan.delete({
            where: {
                id: plan.id
            }
        })
        return true;
    }

}
