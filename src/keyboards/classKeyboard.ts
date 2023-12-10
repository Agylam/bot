import {Markup} from "telegraf";

export const classKeyboard = () => {
    return Markup.inlineKeyboard([
        Markup.button.callback("🤓 1-4", "verify_class_0"),
        Markup.button.callback("😎 5-8", "verify_class_1"),
        Markup.button.callback("🥸 9-11", "verify_class_2"),
    ])
}
