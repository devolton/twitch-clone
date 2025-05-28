import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../../../core/prisma/prisma.service";
import {ConfigService} from "@nestjs/config";
import {MailService} from "../../libs/mail/mail.service";
import type {Request} from "express";
import {getSessionMetadata} from "../../../shared/utils/session-metadata.util";
import {destroySession} from "../../../shared/utils/session.util";
import {$Enums, type User} from "../../../../prisma/generated";
import {generateToken} from "../../../shared/utils/generate-token.util";
import TokenType = $Enums.TokenType;
import {DeactivateAccountInput} from "./inputs/deactivate-account.input";
import {verify} from "argon2";
import {TelegramService} from "../../libs/telegram/telegram.service";
import type {SessionMetadata} from "../../../shared/types/session-metadata.types";
import {RedisService} from "../../../core/redis/redis.service";

@Injectable()
export class DeactivateService {
    constructor(private readonly prisma: PrismaService,
                private readonly redis: RedisService,
                private readonly configService: ConfigService,
                private readonly mailService: MailService,
                private readonly telegramService: TelegramService,) {
    }

    private async validateDeactivateToken(req: Request, token: string) {
        const existingToken = await this.prisma.token.findUnique({
            where: {
                token,
                type: TokenType.DEACTIVATE_ACCOUNT,
            }
        });
        if (!existingToken) {
            throw new NotFoundException("Token is not found!");
        }
        const hasExpired: boolean = new Date(existingToken.expiresIn) < new Date();
        if (hasExpired) {
            throw new BadRequestException("Token has expired!");
        }
        const user = await this.prisma.user.update({
            where: {
                id: existingToken.userId!
            },
            data: {
                isDeactivated: true,
                deactivatedAt: new Date(),
            }
        });
        await this.prisma.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.DEACTIVATE_ACCOUNT
            }
        });
        await this.clearSessions(user.id);
        return await destroySession(req, this.configService);
    }

    private async sendDeactivateToken(req: Request, user: User, userAgent: string) {
        const deactivateToken = await generateToken(
            this.prisma,
            user,
            TokenType.DEACTIVATE_ACCOUNT,
            false);
        const metadata: SessionMetadata = getSessionMetadata(req, userAgent);
        await this.mailService.sendDeactivateToken(user.email, deactivateToken.token, metadata);
        if (deactivateToken.user?.notificationSettings?.telegramNotifications && deactivateToken.user?.telegramId) {
            await this.telegramService.sendDeactivateToken(deactivateToken.user.telegramId, deactivateToken.token, metadata);
        }
        return true;
    }

    private async clearSessions(userId: number) {
        const keys = await this.redis.keys('*');
        for (const key of keys) {
            const sessionData = await this.redis.get(key);
            if (sessionData) {
                const session = JSON.parse(sessionData);
                if (session.userId === userId) {
                    await this.redis.del(key);
                }
            }
        }


    }

    async deactivate(req: Request,
                     input: DeactivateAccountInput,
                     user: User,
                     userAgent: string) {
        const {email, password, pin} = input;
        if (user.email !== email) {
            throw new BadRequestException("Invalid email address!");
        }
        const isValidPassword = await verify(user.password, password);
        if (!isValidPassword) {
            throw new BadRequestException("Invalid password!");
        }
        if (!pin) {
            await this.sendDeactivateToken(req, user, userAgent);
            return {message: "Confirmation code is required!"};
        }
        await this.validateDeactivateToken(req, pin);

        return {user};
    }

}
