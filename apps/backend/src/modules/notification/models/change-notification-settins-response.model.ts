 import {ObjectType,Field} from "@nestjs/graphql";
 import {NotificationSettingsModel} from "./notificaton-settings.model";

 @ObjectType()
export class ChangeNotificationsSettingsResponse {
    @Field(() => NotificationSettingsModel)
    public notificationSettings: NotificationSettingsModel

    @Field(() => String, { nullable: true })
    public telegramAuthToken?: string
}