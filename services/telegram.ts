import {IUnity} from "../interfaces/IUnity";
import { Telegraf } from 'telegraf'

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

export const startTelegramListener = async (unity: IUnity) => {
    await bot.launch()

    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
}
