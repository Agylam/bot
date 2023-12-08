import "dotenv/config"
import "reflect-metadata"
import {AppDataSource} from "./data-source.js";
import {Markup, Telegraf} from "telegraf";
import {User} from "./entities/User.js";
import {startAction} from "./actions/startAction.js";
import type {AdditionContext} from "./types/AdditionContext.js";

let bot: Telegraf<AdditionContext>

const startBot = async () => {
    try {
        if (process.env['TELEGRAM_TOKEN'] === undefined) {
            console.error("Ошибка: TELEGRAM_TOKEN не задан. Дальнейшая работа невозможна");
            return;
        }
        bot = new Telegraf<AdditionContext>(process.env['TELEGRAM_TOKEN']);
        bot.use(async (ctx, next) => {
            try{

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
            }catch (e){
                console.error("Ошибка", e)
            }
        })


        /* Handlers */

        bot.start(startAction)




        bot.launch().then()

        process.once('SIGINT', () => bot.stop('SIGINT'))
        process.once('SIGTERM', () => bot.stop('SIGTERM'))
    } catch (e) {
        console.error("Ошибка (TelegramService): ", e);
    }
}

AppDataSource.initialize()
    .then(startBot)
    .catch((error) => console.log(error))

