import {Markup} from "telegraf";

export const toMenuKeyboard = () => {
    return Markup.inlineKeyboard([
        Markup.button.callback("➡️ Меню", "menu"),
    ])
}
