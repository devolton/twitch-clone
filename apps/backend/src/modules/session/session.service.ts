import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import {PrismaService} from "../../core/prisma/prisma.service";
import {LoginInput} from "./inputs/login.input";
import {type Request} from "express";
import {verify} from "argon2";
import {ConfigService} from "@nestjs/config";
import {getSessionMetadata} from "../../shared/utils/session-metadata.util";
import {RedisService} from "../../core/redis/redis.service";
import {SessionData} from "express-session";
import {destroySession, saveSession} from "../../shared/utils/session.util";
import {User} from "../../../prisma/generated";
import {SessionMetadata} from "../../shared/types/session-metadata.types";
import {VerificationService} from "../auth/verification/verification.service";
import {TOTP} from "otpauth";

@Injectable()
export class SessionService {
    constructor(private readonly prisma: PrismaService,
                private readonly redis: RedisService,
                private readonly configService: ConfigService,
                private readonly verificationService: VerificationService,) {
    }

    async findByUser(req: Request) {
        const userId = req.session.userId;
        if (!userId) {
            throw new NotFoundException("User is not found in session");
        }
        const keys = await this.redis.keys('*');
        const userSessions: Array<SessionData> = [];
        if (keys) {
            for (const key of keys) {
                const sessionData = await this.redis.get(key);
                if (sessionData) {
                    const session = JSON.parse(sessionData);
                    if (session.userId === userId) {
                        userSessions.push({
                            ...session,
                            id: key.split(':')[1]
                        });
                    }
                }
            }

            // @ts-ignore
            userSessions.sort((first: SessionData, second: SessionData) => second!.createdAt! - first!.createdAt!)
            return userSessions.filter(session => session.userId !== userId)
        }

    }

    async findCurrentSession(req: Request) {
        const sessionId = req.session.id;
        const sessionData = await this.redis.get(`${this.configService.getOrThrow("SESSION_FOLDER")}${sessionId}`);
        if (!sessionData) {
            throw new NotFoundException("Session not found");

        }
        const session = JSON.parse(sessionData);
        console.log(session);
        return {
            ...session,
            id: sessionId
        }
    }

    async clearSession(req: Request) {
        req.res?.clearCookie(this.configService.getOrThrow<string>("SESSION_NAME"));
        return true;
    }

    async removeSession(req: Request, id: string) {
        if (req.session.id === id) {
            throw new ConflictException("Removing current session is invalid operation!");
        }
        await this.redis.del(`${this.configService.getOrThrow("SESSION_FOLDER")}:${id}`);
        return true;

    }


    async login(req: Request, input: LoginInput, userAgent: string) {
        const {login, password,pin} = input;
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    {username: {equals: login}},
                    {email: {equals: login}}
                ]
            }
        });
        if (!user || user.isDeactivated) {
            throw new NotFoundException("User not found");
        }
        const isValidPassword = await verify(user.password, password);
        if (!isValidPassword) {
            throw new UnauthorizedException("Invalid password");
        }
        if (!user.isEmailVerified) {
            await this.verificationService.sendVerificationToken(user);
            throw new BadRequestException("Account isn't verified. Please, check your email address for confirmation");
        }
        if(user.isTotpEnabled){
            if(!pin){
                return{
                    message:"Please, input authorization code"
                }
            }
            const totp = new TOTP({
                issuer: "DevoltonLabs",
                label: `${user.email}`,
                algorithm: "SHA1",
                digits: 6,
                secret:user.totpSecret!
            });
            const delta = totp.validate({token: pin});
            if (!delta) {
                throw new BadRequestException("Invalid code");
            }
        }
        const metadata: SessionMetadata = getSessionMetadata(req, userAgent);
        return saveSession(req, user as User, metadata);

    }

    async logout(req: Request) {
        return destroySession(req, this.configService);
    }
}
