import {Mutation, Query, Resolver, Args} from '@nestjs/graphql';
import {NotificationService} from './notification.service';
import {User} from "../../../prisma/generated";
import {Authorized} from "../../shared/decorators/authorized.decorator";
import {NotificationModel} from "./models/notification.model";
import {Authorization} from "../../shared/decorators/auth.decorator";
import {ChangeNotificationsSettingsResponse} from "./models/change-notification-settins-response.model";
import {ChangeNotificationSettingsInput} from "./inputs/change-notification-settings.input";


@Resolver('Notification')
export class NotificationResolver {
    constructor(private readonly notificationService: NotificationService) {
    }

    @Authorization()
    @Query(() => Number, {name: 'findNotificationsUnreadCount'})
    async findUnreadCount(@Authorized() user: User) {
        return this.notificationService.findUnreadCount(user);
    }

    @Authorization()
    @Query(() => [NotificationModel], {name: 'findNotificationsByUser'})
    async findByUser(@Authorized() user: User) {
        return this.notificationService.findByUser(user);
    }

    @Authorization()
    @Mutation(() => ChangeNotificationsSettingsResponse, {name: "changeNotificationSettings"})
    async changeSettings(@Authorized() user: User,
                         @Args('data', {type: () => ChangeNotificationSettingsInput}) input: ChangeNotificationSettingsInput) {
        return this.notificationService.changeSettings(user, input);
    }


}
