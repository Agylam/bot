import {Markup} from "telegraf";

export const notifyKeyboard = (isEnabled: boolean) => {
    return Markup.inlineKeyboard([
        Markup.button.callback(isEnabled? "🔕Отключить":"🔔 Включить", isEnabled? "notify_off":"notify_on"),
    ])
}
