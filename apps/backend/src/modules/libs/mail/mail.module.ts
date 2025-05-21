import {Global, Module} from '@nestjs/common';
import {MailService} from './mail.service';
import {MailerModule} from "@nestjs-modules/mailer";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {getMailerConfig} from "../../../core/config/mailer.config";

@Global()
@Module({
    exports: [MailService],
    providers: [MailService],
})
export class MailModule {
}
