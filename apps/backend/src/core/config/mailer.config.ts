import {ConfigService} from "@nestjs/config";
import {type MailerOptions} from "@nestjs-modules/mailer";

export function getMailerConfig(configService: ConfigService): MailerOptions {
    return {
        transport: {
            host: configService.getOrThrow<string>("MAIL_HOST"),
            port: Number(configService.getOrThrow<string>("MAIL_PORT")),
            secure: false,
            auth: {
                user: configService.getOrThrow<string>("MAIL_LOGIN"),
                pass: configService.getOrThrow<string>("MAIL_PASSWORD"),
            }
        },
        defaults:{
            from:`"Devolton" ${configService.getOrThrow<string>("MAIL_LOGIN")}`
        }
    }
}