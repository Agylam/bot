import {Context, Telegraf} from 'telegraf'
import {BasicPlatformService} from "./BasicPlatformService.js";
import {Platforms} from "../types/Platforms.js";

export class TelegramService extends BasicPlatformService{
    private bot: Telegraf;
    readonly platformName = Platforms.TELEGRAM;
    readonly prefix = "/";

    constructor() {
        super()
    }
    async startService() {
        if (process.env.TELEGRAM_TOKEN === undefined){
            console.error("Ошибка: TELEGRAM_TOKEN не задан. Дальнейшая работа невозможна");
            return;
        }
        this.bot = new Telegraf(process.env.TELEGRAM_TOKEN);

        this.bot.start(ctx => this.callStartMessageHandler(ctx.from.id+""))
        this.bot.message(ctx => {
            const splitMsg = this.splitCmd(ctx.message.);
        })

        await this.bot.launch()
        process.once('SIGINT', () => this.bot.stop('SIGINT'))
        process.once('SIGTERM', () => this.bot.stop('SIGTERM'))
    }

    sendMessage(userID: string, text: string) {
    }
}
