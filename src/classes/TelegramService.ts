import {Context, Telegraf} from 'telegraf'
import {BasicPlatformService} from "./BasicPlatformService.js";
import {Platforms} from "../types/Platforms.js";
import {message} from "telegraf/filters";
import type {UnityMethods} from "../types/UnityMethods.js";

interface AdditionContext extends Context {
    unityMethods: UnityMethods
}

export class TelegramService extends BasicPlatformService{
    private bot: Telegraf<AdditionContext>;
    override platform = Platforms.TELEGRAM;
    override prefix = "/";

    constructor() {
        super()
    }

    override async startService() {
        try {
            if (process.env['TELEGRAM_TOKEN'] === undefined){
                console.error("Ошибка: TELEGRAM_TOKEN не задан. Дальнейшая работа невозможна");
                return false;
            }
            this.bot = new Telegraf<AdditionContext>(process.env['TELEGRAM_TOKEN']);

            this.bot.use((ctx, next)=>{
                ctx.unityMethods = {
                    replyWithText: text => ctx.reply(text),
                    getAuthor: ()=>{
                        if(ctx.from !== undefined){
                            return {
                                id: ctx.from.id+"",
                                firstName: ctx.from.first_name,
                                lastName: ctx.from.last_name,
                                fullName: ctx.from.first_name + ctx.from.last_name,
                                username: ctx.from.username
                            }
                        }else{
                            return undefined;
                        }
                    }
                }
                return next();
            })

            this.bot.start(ctx => this.callStartMessageHandler(ctx.unityMethods))
            this.bot.on(message('text'),ctx => {
                const splitMsg = this.splitCmd(ctx.message.text);
                if (splitMsg === false){
                    this.callNewMessageHandler(ctx.message.text, ctx.unityMethods);
                }
            })

            this.bot.launch().then()

            process.once('SIGINT', () => this.bot.stop('SIGINT'))
            process.once('SIGTERM', () => this.bot.stop('SIGTERM'))
        }catch (e) {
            console.error("Ошибка (TelegramService): ", e);
            return false;
        }

        return true;
    }

    override sendMessage(authorID: string, text: string) {
        this.bot.telegram.sendMessage(authorID, text);
    }
}
