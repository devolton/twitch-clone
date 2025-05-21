import {Global, Module} from '@nestjs/common';
import {TelegramService} from './telegram.service';
import {TelegrafModule} from "nestjs-telegraf";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {getTelegrafConfig} from "../../../core/config/telegraf.config";

@Global() //todo remove provides this module in other modules
@Module({
    imports: [
        TelegrafModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getTelegrafConfig
        }),
    ],
    providers: [TelegramService],
    exports:[TelegramService]
})
export class TelegramModule {
}
