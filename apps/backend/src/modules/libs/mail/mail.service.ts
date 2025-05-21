import {Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {render} from "@react-email/components";
import {VerificationTemplate} from "./templates/verification.template";
import {Resend} from "resend";
import {PasswordRecoveryTemplate} from "./templates/password-recovery.template";
import type {SessionMetadata} from "../../../shared/types/session-metadata.types";
import {DeactivateTemplate} from "./templates/deactivate.template";
import {AccountDeletionTemplate} from "./templates/account-deletion.template";
import {EnableTwoFactorTemplate} from "./templates/enable-two-factor.template";
import {VerifyChannelTemplate} from "./templates/verify-channel.template";

@Injectable()
export class MailService {
    private resend: Resend;

    constructor(private readonly configService: ConfigService,) {
        this.resend = new Resend(configService.getOrThrow("RESEND_API_KEY"));
    }

    async sendVerificationToken(email: string, token: string) {
        const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGIN");
        const html = await render(VerificationTemplate({domain, token}));
        return await this.sendMail(email, 'Account verification', html);
    }

    async sendPasswordResetToken(email: string, token: string,metadata:SessionMetadata) {
        const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGIN");
        const html = await render(PasswordRecoveryTemplate({domain, token,metadata}));
        return await this.sendMail(email, 'Password reset', html);
    }
    async sendDeactivateToken(email: string, token: string,metadata:SessionMetadata) {
        const html = await render(DeactivateTemplate({token,metadata}));
        return await this.sendMail(email, 'Account deactivation', html);
    }
    async sendAccountDeletion(email:string){
        const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGIN");
        const html = await render(AccountDeletionTemplate({domain}));
        return await this.sendMail(email, 'Account deleted', html);
    }

    async sendEnableTwoFactor(email:string){
        const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGIN");
        const html = await render(EnableTwoFactorTemplate({domain}));
        return await this.sendMail(email, 'Account security', html);
    }

    async sendVerifyChannel(email:string){
        const html = await render(VerifyChannelTemplate());
        return await this.sendMail(email, 'Your account verified!', html);
    }

    private async sendMail(email: string, subject: string, html: string) {
        const {data,error}= await this.resend.emails.send({
            from: "onboarding@resend.dev",
            to: 'voloshko.03@gmail.com', //todo change to email from user data
            subject,
            html
        });
        if(error){
            console.error(error);
        }
        return data;
    }
}
