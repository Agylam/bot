import { Telegraf } from 'telegraf'

if (process.env.TELEGRAM_TOKEN === undefined){
    console.error("Ошибка: TELEGRAM_TOKEN не задан. Дальнейшая работа невозможна");
    while(true);
}

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

export const startTelegramListener = async () => {
    if (process.env.TELEGRAM_TOKEN === undefined) return;
    await bot.launch()

    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
}
