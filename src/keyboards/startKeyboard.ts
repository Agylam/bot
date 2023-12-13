import {Markup} from "telegraf";

export const startKeyboard = () => {
    return Markup.inlineKeyboard([
        Markup.button.callback("🫰 Конечно!", "update_setting"),
    ])
}
