import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../../../core/prisma/prisma.service";
import {MailService} from "../../libs/mail/mail.service";
import {type Request} from 'express'
import {VerificationInput} from "./inputs/verification.input";
import {$Enums, User} from "../../../../prisma/generated";
import {getSessionMetadata} from "../../../shared/utils/session-metadata.util";
import {saveSession} from "../../../shared/utils/session.util";
import TokenType = $Enums.TokenType;
import {generateToken} from "../../../shared/utils/generate-token.util";

@Injectable()
export class VerificationService {

    constructor(private readonly prisma: PrismaService,
                private readonly mailService: MailService) {
    }

    async verify(
        req: Request,
        input: VerificationInput,
        userAgent: string
    ) {
        const {token} = input;
        const existingToken = await this.prisma.token.findUnique({
            where: {
                token,
                type: TokenType.EMAIL_VERIFY,
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
                isEmailVerified: true
            }
        });
        await this.prisma.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.EMAIL_VERIFY
            }
        });
        const metadata = getSessionMetadata(req, userAgent);
        return saveSession(req, user as User, metadata);
    }

    async sendVerificationToken(user: User) {
        const verificationToken = await generateToken(
            this.prisma,
            user,
            TokenType.EMAIL_VERIFY,
            true);
        await this.mailService.sendVerificationToken(user.email, verificationToken.token);

        return user;
    }

}
