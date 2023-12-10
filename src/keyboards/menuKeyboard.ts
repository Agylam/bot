import {Markup} from "telegraf";

export const menuKeyboard = (isFamiliar: boolean) => {
    return Markup.inlineKeyboard([
        Markup.button.callback("🧐 Статус актировки", "aktirovka_status"),
        Markup.button.callback("🔔 Настроить уведомления", "notify_settings"),
        Markup.button.callback(isFamiliar? "🦄 Обновить данные" : "Познакомиться", "update_setting"),
    ], {
        wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2,
    })
}
