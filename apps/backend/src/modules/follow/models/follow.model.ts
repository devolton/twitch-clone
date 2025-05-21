import {ObjectType, Field} from "@nestjs/graphql";
import {Follow, User} from "../../../../prisma/generated";
import {UserModel} from "../../auth/account/models/user.model";

@ObjectType()
export class FollowModel implements Follow {
    @Field(() => Number)
    id: number;

    @Field(() => Number)
    followerId: number;

    @Field(() => UserModel)
    follower: UserModel;

    @Field(() => Number)
    followingId: number;

    @Field(() => UserModel)
    following: UserModel;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;


}