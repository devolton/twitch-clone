import {Field, ObjectType} from "@nestjs/graphql";
import {Stream} from "../../../../prisma/generated";
import {UserModel} from "../../auth/account/models/user.model";
import {CategoryModel} from "../../category/models/category.model";
import {ChatMessageModel} from "../../chat/model/chat-message.model";

@ObjectType()
export class StreamModel implements Stream {
    @Field(() => Number)
    id: number;
    @Field(() => UserModel)
    user: UserModel;
    @Field(() => Number)
    userId: number;

    @Field(() => String)
    title: string;

    @Field(() => String)
    thumbnailUrl: string;

    @Field(() => String)
    ingressId: string;

    @Field(() => String)
    serverUrl: string;

    @Field(() => String)
    streamKey: string;

    @Field(() => Boolean)
    isLive: boolean;

    @Field(() => Boolean)
    isChatEnabled: boolean;

    @Field(() => Boolean)
    isChatFollowersOnly: boolean;

    @Field(() => Boolean)
    isChatPremiumFollowersOnly: boolean;

    @Field(() => Number)
    categoryId: number;

    @Field(() => CategoryModel)
    category: CategoryModel;

    @Field(() => [ChatMessageModel])
    chatMessages: ChatMessageModel[];

    @Field(() => Date)
    createdAt: Date;
    @Field(() => Date)
    updatedAt: Date;
}