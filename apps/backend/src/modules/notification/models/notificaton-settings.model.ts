import {UserModel} from "../../auth/account/models/user.model";
import {ObjectType,Field} from "@nestjs/graphql";
import {NotificationSetting} from "../../../../prisma/generated";

@ObjectType()
export class NotificationSettingsModel implements NotificationSetting {

    @Field(() => Number)
    public id: number

    @Field(() => Boolean)
    public siteNotifications: boolean

    @Field(() => Boolean)
    public telegramNotifications: boolean

    @Field(() => UserModel)
    public user: UserModel

    @Field(() => Number)
    public userId: number

    @Field(() => Date)
    public createdAt: Date

    @Field(() => Date)
    public updatedAt: Date

}