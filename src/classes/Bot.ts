import type {PlatformEvent, PlatformEventCut} from "../types/PlatformEvent.js";
import type {HandlerTrigger} from "../types/HandlerTrigger.js";
import {Context, Telegraf} from "telegraf";
import {message} from "telegraf/filters.js";
import {AppDataSource} from "../data-source.js";
import {User} from "../entities/User.js";
import {PlatformEventList} from "../types/PlatformEventList.js";

export interface AdditionContext extends Context {
    user: User;
}


export class Bot {
    private triggers: HandlerTrigger[];
    private bot: Telegraf<AdditionContext>;
    readonly prefix = "/";

    constructor(handlers: HandlerTrigger[]) {
        this.triggers = handlers;
        this.startService().then(status => {
            if (status) {
                console.log("Успешный запуск всех сервисов")
            } else {
                console.error("Ошибка запуска")
            }
        }, (error) => console.error("Ошибка запуска:", error));
    }

    async startService() {
        try {
            if (process.env['TELEGRAM_TOKEN'] === undefined) {
                console.error("Ошибка: TELEGRAM_TOKEN не задан. Дальнейшая работа невозможна");
                return false;
            }
            this.bot = new Telegraf<AdditionContext>(process.env['TELEGRAM_TOKEN']);

            this.bot.use(async (ctx, next) => {
                if (ctx.from !== undefined) {
                    const user = await AppDataSource.getRepository(User).findOne({
                        where: {
                            id: ctx.from.id,
                        }
                    });
                    if (user === null) {
                        ctx.user = new User();
                        ctx.user.id = ctx.from.id;
                        await ctx.user.save();
                    } else {
                        ctx.user = user;
                    }
                }
                return next();
            })

            this.bot.start(ctx => {
                this.eventCallback({
                    type: PlatformEventList.START_MESSAGE,
                }, ctx)
            })

            this.bot.on(message('text'), ctx => {
                if (!ctx.message.text.startsWith(this.prefix)) {
                    this.eventCallback({
                        type: PlatformEventList.NEW_MESSAGE,
                        text: ctx.message.text,
                    }, ctx)
                } else {
                    const args = msg.trim().split(/ +/g);
                    const cmd = args[0]?.slice(this.prefix.length).toLowerCase();
                }
            })

            this.bot.launch().then()

            process.once('SIGINT', () => this.bot.stop('SIGINT'))
            process.once('SIGTERM', () => this.bot.stop('SIGTERM'))
        } catch (e) {
            console.error("Ошибка (TelegramService): ", e);
            return false;
        }

        return true;
    }

    eventCallback(event: PlatformEventCut, ctx: Context & AdditionContext) {
        const fullEvent: PlatformEvent = {...event, user: ctx.user, userState: ctx.user.state, role: ctx.user.role}
        const foundEvent = this.triggers.find(e => {
            return (
                e.type === fullEvent.type
                && (e.userState == fullEvent.userState || e.userState == "*")
                && (e.role === fullEvent.role || e.role == "*")
                && (fullEvent.type === PlatformEventList.NEW_MESSAGE && e.type === PlatformEventList.NEW_MESSAGE ? (e.text === fullEvent?.text) : true)
            )
        });
        if (foundEvent !== undefined) {
            foundEvent.action(fullEvent, ctx);
        }
    }
}
