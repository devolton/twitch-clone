import {SponsorshipPlan} from "../../../../../prisma/generated";
import {ObjectType, Field} from "@nestjs/graphql";
import {UserModel} from "../../../auth/account/models/user.model";


@ObjectType()
export class PlanModel implements SponsorshipPlan {
    @Field(() => Number)
    id: number;
    @Field(() => String)
    title: string;

    @Field(() => String, {nullable: true})
    description: string;

    @Field(() => Number)
    price: number;

    @Field(() => String)
    stripeProductId: string;

    @Field(() => Number)
    stripePlanId: string;

    @Field(() => Date)
    createdAt: Date;
    @Field(() => Date)
    updatedAt: Date;

    @Field(() => UserModel)
    channel: UserModel
    @Field(() => Number)
    channelId: number;

}