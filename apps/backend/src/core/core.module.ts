import {Module} from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver} from "@nestjs/apollo";
import {PrismaModule} from './prisma/prisma.module';
import {IS_DEV_ENV} from "../shared/utils/is.dev.util";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {RedisModule} from './redis/redis.module';
import {AccountModule} from "../modules/auth/account/account.module";
import * as process from "node:process";
import {join} from 'path'
import {SessionModule} from "../modules/session/session.module";
import {VerificationModule} from "../modules/auth/verification/verification.module";
import {PasswordRecoveryModule} from "../modules/auth/password-recovery/password-recovery.module";
import {TotpModule} from "../modules/auth/totp/totp/totp.module";
import {DeactivateModule} from "../modules/auth/deactivate/deactivate.module";
import {CronModule} from "../modules/cron/cron.module";
import {StorageModule} from "../modules/libs/storage/storage.module";
import {ProfileModule} from "../modules/auth/profile/profile.module";
import {StreamModule} from "../modules/stream/stream.module";
import {LivekitModule} from "../modules/libs/livekit/livekit.module";
import {getLiveKitConfig} from "./config/livekit.config";
import {IngressModule} from "../modules/stream/ingress/ingress.module";
import {WebhookModule} from "../modules/webhook/webhook.module";
import {CategoryModule} from "../modules/category/category.module";
import {ChatModule} from "../modules/chat/chat.module";
import {FollowModule} from "../modules/follow/follow.module";
import {ChannelModule} from "../modules/channel/channel.module";
import {NotificationModule} from "../modules/notification/notification.module";
import {TelegramModule} from "../modules/libs/telegram/telegram.module";
import {StripeModule} from "../modules/libs/stripe/stripe.module";
import {getStripeConfig} from "./config/stripe.config";
import {PlanModule} from "../modules/sponsorship/plan/plan.module";
import {SubscriptionModule} from "../modules/sponsorship/subscription/subscription.module";
import {TransactionModule} from "../modules/sponsorship/transaction/transaction.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            ignoreEnvFile: !IS_DEV_ENV,
            isGlobal: true
        }),
        GraphQLModule.forRoot({
            driver: ApolloDriver,
            imports: [ConfigModule],
            playground: true,
            path: process.env.GRAPHQL_PREFIX,
            autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
            sortSchema: true,
            context: ({req, res}) => ({req, res}),
            installSubscriptionHandlers: true,
            inject: [ConfigService]
        }),
        LivekitModule.registerAsync({
            imports: [ConfigModule],
            useFactory: getLiveKitConfig,
            inject: [ConfigService]
        }),
        StripeModule.registerAsync({
            imports: [ConfigModule],
            useFactory: getStripeConfig,
            inject: [ConfigService],
        }),
        PrismaModule,
        RedisModule,
        AccountModule,
        SessionModule,
        VerificationModule,
        PasswordRecoveryModule,
        TotpModule,
        DeactivateModule,
        CronModule,
        StorageModule,
        ProfileModule,
        StreamModule,
        LivekitModule,
        IngressModule,
        WebhookModule,
        CategoryModule,
        ChatModule,
        FollowModule,
        ChannelModule,
        NotificationModule,
        TelegramModule,
        PlanModule,
        SubscriptionModule,
        TransactionModule


    ]
})
export class CoreModule {
}
