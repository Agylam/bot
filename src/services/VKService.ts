import { VK } from 'vk-io';
import {BasicPlatformService} from "./BasicPlatformService.js";
import {Platforms} from "../types/Platforms.js";
import {message} from "telegraf/filters";
import type {UnityMethods} from "../types/UnityMethods";

export class VKService extends BasicPlatformService{
    private bot: VK;
    override platform = Platforms.VKONTAKTE;
    override prefix = "/";

    constructor() {
        super()
    }

    override async startService() {
        try {
            if (process.env['VKONTAKTE_TOKEN'] === undefined){
                console.error("Ошибка: VKONTAKTE_TOKEN не задан. Дальнейшая работа невозможна");
                return false;
            }
            this.bot = new VK({
                token: process.env['VKONTAKTE_TOKEN']
            });

            this.bot.updates.use((ctx, next)=>{
                ctx.state['unityMethods'] as UnityMethods = {
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
                if (splitMsg !== false){

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
