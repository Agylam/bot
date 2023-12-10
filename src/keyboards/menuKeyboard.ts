import {Markup} from "telegraf";

export const menuKeyboard = (isFamiliar: boolean) => {
    return Markup.inlineKeyboard([
        Markup.button.callback(isFamiliar? "Обновить данные" : "Познакомиться", "update_setting"),
        Markup.button.callback("Настроить уведомления", "notify_settings"),
    ])
}
