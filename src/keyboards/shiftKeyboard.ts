import {Markup} from "telegraf";

export const shiftKeyboard = () => {
    return Markup.inlineKeyboard([
        Markup.button.callback("1️⃣ Первая", "verify_shift_1"),
        Markup.button.callback("2️⃣ Вторая", "verify_shift_2"),
    ])
}
