import {Markup} from "telegraf";

export const notifyKeyboard = (isEnabled: boolean) => {
    return Markup.inlineKeyboard([
        Markup.button.callback(isEnabled? "🔕Выключить":"🔔 Включить", isEnabled? "notify_off":"notify_on"),
        Markup.button.callback("➡️ Меню", "menu"),
    ])
}
