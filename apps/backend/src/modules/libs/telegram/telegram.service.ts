import {BadRequestException, Injectable} from '@nestjs/common';
import {Update, Ctx, Start, Command, Action} from "nestjs-telegraf";
import {Context, Telegraf} from "telegraf";
import {PrismaService} from "../../../core/prisma/prisma.service";
import {ConfigService} from "@nestjs/config";
import {$Enums, type SponsorshipPlan, type User} from "../../../../prisma/generated";
import TokenType = $Enums.TokenType;
import {MESSAGES} from "./telegram.messeges";
import {BUTTONS} from "./telegram.buttons";

import {Markup} from "telegraf";
import {InlineKeyboardMarkup} from "telegraf/typings/core/types/typegram";
import type {SessionMetadata} from "../../../shared/types/session-metadata.types";

@Update()
@Injectable()
export class TelegramService extends Telegraf {
    private readonly _token: string;

    constructor(private readonly prisma: PrismaService,
                private readonly configService: ConfigService) {
        super(configService.getOrThrow<string>("TELEGRAM_BOT_TOKEN"));
        this._token = this.configService.getOrThrow<string>("TELEGRAM_BOT_TOKEN");
    }

    @Start()
    async onStart(@Ctx() ctx: any) {
        const chatId = ctx.chat?.id.toString() || "guest";
        const token = ctx.message.text.split(" ")[1];
        if (token) {
            const authToken = await this.prisma.token.findUnique({
                where: {
                    token,
                    type: TokenType.TELEGRAM_AUTH
                }
            });
            if (!authToken) {
                return ctx.reply(MESSAGES.invalidToken);

            }
            const hasExpired: boolean = new Date(authToken.expiresIn) < new Date();
            if (hasExpired) {
                return ctx.reply(MESSAGES.invalidToken);
            }
            await this.connectTelegram(authToken.userId!, chatId);
            await this.prisma.token.delete({
                where: {
                    id: authToken.id
                }
            });
            await ctx.replyWithHTML(MESSAGES.authSuccess, BUTTONS.authSuccess);

        }
        const user = await this.findUserByChatId(chatId);
        if (user) {
            return await this.onMe(ctx);
        } else {
            await ctx.replyWithHTML(MESSAGES.welcome, BUTTONS.profile);
        }

    }

    @Command('me')
    @Action('me')
    async onMe(@Ctx() ctx: Context) {

        const chatId = ctx.chat?.id.toString() || "guest";
        const user = await this.findUserByChatId(chatId);
        if (!user) {
            return await ctx.replyWithHTML("User not found");
        }
        const followersCount = await this.prisma.follow.count({
            where: {
                followingId: user.id
            }
        })
        return await ctx.reply(MESSAGES.profile(user, followersCount), BUTTONS.profile);

    }

    @Command('follows')
    @Action('follows')
    async onFollows(ctx: Context) {
        const chatId = ctx.chat?.id.toString() || "guest";
        const user = await this.findUserByChatId(chatId);
        const follows = await this.prisma.follow.findMany({
            where: {
                followerId: user?.id
            },
            include: {
                following: true
            }
        });
        if (user && follows.length) {
            const followsList = follows.map(follow => MESSAGES.follows(follow.following)).join("\n");
            const message = "<b>Channels you are subscribed to:</b>\n\n" + followsList;
            await ctx.replyWithHTML(message)
        } else {
            await ctx.replyWithHTML("<b>❗We don't have subscribers❗</b>");
        }

    }


    async sendPasswordResetToken(chatId: string, token: string, metadata: SessionMetadata) {
        await this.telegram.sendMessage(
            chatId,
            MESSAGES.deactivate(token, metadata),
            {
                parse_mode: 'HTML'
            }
        );
    }

    async sendAccountDeletion(chatId: string) {
        await this.telegram.sendMessage(
            chatId,
            MESSAGES.accountDeleted,
            {
                parse_mode: 'HTML'
            }
        )
    };

    async sendDeactivateToken(chatId: string, token: string, metadata: SessionMetadata) {
        await this.telegram.sendMessage(
            chatId,
            MESSAGES.resetPassword(token, metadata),
            {
                parse_mode: 'HTML'
            }
        );
    }

    async sendStreamStartMessage(chatId: string, channel: User) {
        await this.telegram.sendMessage(
            chatId,
            MESSAGES.streamStart(channel),
            {
                parse_mode: 'HTML'
            }
        )
    }

    async sendNewFollowing(chatId: string, follower: User) {
        const user = await this.findUserByChatId(chatId);
        let followingCount: number = 0;
        if (user) {
            followingCount = user.followings.length;
        }
        await this.telegram.sendMessage(
            chatId,
            MESSAGES.newFollowing(follower, followingCount),
            {
                parse_mode: 'HTML'
            }
        )
    }

    async sendNewSponsorship(chatId: string, plan: SponsorshipPlan, sponsor: User) {
        await this.telegram.sendMessage(
            chatId,
            MESSAGES.newSponsorship(plan, sponsor),
            {
                parse_mode: "HTML"
            }
        )

    }

    async sendEnableTwoFactor(chatId: string) {
        await this.telegram.sendMessage(
            chatId,
            MESSAGES.enableTwoFactor,
            {
                parse_mode: 'HTML'
            }
        );
    }

    async sendVerifyChannel(chatId: string) {
        await this.telegram.sendMessage(
            chatId,
            MESSAGES.verifyChannel,
            {
                parse_mode: 'HTML'
            }
        );
    }

    private async connectTelegram(userId: number, chatId: string) {
        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                telegramId: chatId
            }
        });
    }

    private async findUserByChatId(chatId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                telegramId: chatId
            },
            include: {
                followers: true,
                followings: true
            }
        });
        return user;
    }
}


