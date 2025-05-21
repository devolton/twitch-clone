import {Field, Int, ObjectType} from "@nestjs/graphql";
import {type User} from "../../../../../prisma/generated";
import {SocialLinkModel} from "../../profile/models/social-link-model";
import {StreamModel} from "../../../stream/models/stream.model";
import {FollowModel} from "../../../follow/models/follow.model";
import {NotificationSettingsModel} from "../../../notification/models/notificaton-settings.model";
import {NotificationModel} from "../../../notification/models/notification.model";

@ObjectType()
export class UserModel implements User {
    @Field(() => Number)
    id: number;

    @Field(() => String)
    email: string;
    @Field(() => String)
    password: string;
    @Field(() => String)
    username: string;
    @Field(() => String)
    displayName: string;
    @Field(() => String, {nullable: true})
    avatar: string
    @Field(() => String, {nullable: true})
    bio: string
    @Field(() => String, {nullable: true})
    telegramId: string;
    @Field(() => Boolean)
    isVerified: boolean;
    @Field(() => Boolean)
    isTotpEnabled: boolean;
    @Field(() => String, {nullable: true})
    totpSecret: string;
    @Field(() => Boolean)
    isEmailVerified: boolean;

    @Field(() => Boolean)
    isDeactivated: boolean;
    @Field(() => Date, {nullable: true})
    deactivatedAt: Date;

    @Field(() => [SocialLinkModel])
    socialLinks: SocialLinkModel[];

    @Field(() => StreamModel)
    stream: StreamModel;

    @Field(() => [FollowModel])
    followers: FollowModel[];

    @Field(() => [FollowModel])
    followings: FollowModel[];

    @Field(() => NotificationSettingsModel)
    notificationSettings: NotificationSettingsModel

    @Field(() => [NotificationModel])
    notifications: NotificationModel[];

    @Field(() => Date)
    createdAt: Date;
    @Field(() => Date)
    updatedAt: Date;

}