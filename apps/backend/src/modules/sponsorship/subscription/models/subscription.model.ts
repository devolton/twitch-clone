import {SponsorshipSubscription} from "../../../../../prisma/generated";
import {ObjectType, Field, ID} from "@nestjs/graphql";
import {UserModel} from "../../../auth/account/models/user.model";
import {PlanModel} from "../../plan/models/plan.model";

@ObjectType()
export class SubscriptionModel implements SponsorshipSubscription {
    @Field(() => Number)
    id: number;
    @Field(() => Date)
    expiresAt: Date;
    @Field(() => Number)
    channelId: number;
    @Field(() => Number, {nullable: true})
    userId: number;
    @Field(() => UserModel)
    user: UserModel;
    @Field(() => Number, {nullable: true})
    planId: number;
    @Field(() => PlanModel)
    plan: PlanModel;
    @Field(() => Date)
    createdAt: Date;
    @Field(() => Date)
    updatedAt: Date;

}