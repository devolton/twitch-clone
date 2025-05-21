import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../../../core/prisma/prisma.service";
import {MailService} from "../../libs/mail/mail.service";
import type {ResetPasswordInput} from "./inputs/reset-password.input";
import type {Request} from "express";
import {generateToken} from "../../../shared/utils/generate-token.util";
import {$Enums} from "../../../../prisma/generated";
import TokenType = $Enums.TokenType;
import {getSessionMetadata} from "../../../shared/utils/session-metadata.util";
import type {SessionMetadata} from "../../../shared/types/session-metadata.types";
import {NewPasswordInput} from "./inputs/new-password.input";
import {hash} from "argon2";
import {TelegramService} from "../../libs/telegram/telegram.service";

@Injectable()
export class PasswordRecoveryService {
    constructor(private readonly prisma: PrismaService,
                private readonly mailService: MailService,
                private readonly telegramService: TelegramService) {
    }

    async resetPassword(req: Request, input: ResetPasswordInput, userAgent: string) {
        const {email} = input;
        const user = await this.prisma.user.findUnique({
            where: {
                email
            },
            include: {
                notificationSettings: true
            }
        });
        if (!user) {
            throw new NotFoundException("User not found!");
        }
        const resetToken = await generateToken(
            this.prisma,
            user,
            TokenType.PASSWORD_RESET, true);

        const metadata: SessionMetadata = getSessionMetadata(req, userAgent);

        await this.mailService.sendPasswordResetToken(user.email, resetToken.token, metadata);
        if (resetToken.user?.notificationSettings?.telegramNotifications && resetToken.user?.telegramId) {
            await this.telegramService.sendPasswordResetToken(resetToken.user?.telegramId, resetToken.token, metadata);
        }
        return true;
    }

    async newPassword(input: NewPasswordInput) {
        const {password, token} = input;
        const existingToken = await this.prisma.token.findUnique({
            where: {
                token,
                type: TokenType.PASSWORD_RESET,
            }
        });
        if (!existingToken) {
            throw new NotFoundException("Token is not found!");
        }
        const hasExpired: boolean = new Date(existingToken.expiresIn) < new Date();
        if (hasExpired) {
            throw new BadRequestException("Token has expired!");
        }
        await this.prisma.user.update({
            where: {
                id: existingToken.userId!
            },
            data: {
                password: await hash(password)
            }
        });
        await this.prisma.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.PASSWORD_RESET
            }
        });
        return true;
    }
}
