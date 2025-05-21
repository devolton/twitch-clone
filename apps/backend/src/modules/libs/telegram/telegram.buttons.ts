import {Markup} from "telegraf";
import {InlineKeyboardMarkup} from "telegraf/typings/core/types/typegram";

type ButtonsMap = {
    authSuccess: Markup.Markup<InlineKeyboardMarkup>,
    profile: Markup.Markup<InlineKeyboardMarkup>
}


export const BUTTONS: ButtonsMap = {
    authSuccess: Markup.inlineKeyboard([
        [
            Markup.button.callback('📜 Мои подписки', 'follows'),
            Markup.button.callback('👤 Просмотреть профиль', 'me')
        ],
        [Markup.button.url('🌐 На сайт', 'https://teastream.ru')]
    ]),
    profile: Markup.inlineKeyboard([
        Markup.button.url(
            '⚙️ Настройки аккаунта',
            'https://teastream.ru/dashboard/settings'
        )
    ])
}

