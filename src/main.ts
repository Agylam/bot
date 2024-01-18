import "dotenv/config"
import "reflect-metadata"
import {AppDataSource} from "./data-source.js";
import {Markup, Telegraf} from "telegraf";
import {startAction} from "./actions/startAction.js";
import type {AdditionContext} from "./types/AdditionContext.js";
import {VikaActirovkiAPI} from "./VikaActirovkiAPI.js";
import {menuAction} from "./actions/menuAction.js";
import {updateSettingAction} from "./actions/updateSettingAction.js";
import {message} from "telegraf/filters";
import {UserStates} from "./types/UserStates.js";
import {classKeyboard} from "./keyboards/classKeyboard.js";
import {notFoundTryAgainText} from "./langs/NotFoundTryAgainText.js";
import type {ClassRanges} from "./types/ClassRanges.js";
import {shiftQuestion} from "./langs/shiftQuestion.js";
import {shiftKeyboard} from "./keyboards/shiftKeyboard.js";
import {classQuestion} from "./langs/classQuestion.js";
import {niceToMeet} from "./langs/niceToMeet.js";
import type {UserShifts} from "./types/UserShifts.js";
import {actirovkaAction} from "./actions/actirovkaAction.js";
import {getCityNameByGeo} from "./getCityNameByGeo.js";
import {checkCityAction} from "./actions/checkCityAction.js";
import {notifyMenuAction} from "./actions/notifyMenuAction.js";
import {notifyKeyboard} from "./keyboards/notifyKeyboard.js";
import {notifyMenu} from "./langs/notifyMenu.js";
import {startKeyboard} from "./keyboards/startKeyboard.js";
import {notifier} from "./utils/notifier.js";
import {botMiddleware} from "./utils/botMiddleware.js";

const vikaApi = new VikaActirovkiAPI();
let bot: Telegraf<AdditionContext>;

const startBot = async () => {
    try {
        if (process.env['TELEGRAM_TOKEN'] === undefined) {
            console.error("Ошибка: TELEGRAM_TOKEN не задан. Дальнейшая работа невозможна");
            return;
        }
        if (process.env['DADATA_TOKEN'] === undefined) {
            console.error("Ошибка: DADATA_TOKEN не задан. Дальнейшая работа невозможна");
            return;
        }
        bot = new Telegraf<AdditionContext>(process.env['TELEGRAM_TOKEN']);
        bot.use(botMiddleware(vikaApi))


        /* Handlers */
        bot.start(startAction);
        bot.command("menu", menuAction);

        bot.action("menu", menuAction);
        bot.action("update_setting", updateSettingAction);
        bot.action("actirovka_status", actirovkaAction);
        bot.action("notify_settings", notifyMenuAction);

        /* Включение и отключение уведомлений */
        bot.action(/notify_(on|off)/, async (ctx, next) => {
            await ctx.softAnswerCbQuery();
            const user = ctx.user
            if (!user.cityId || !user.classRange && !user.shift) {
                await ctx.reply("Мы не до конца с вами знакомы. Познакомимся?", startKeyboard());
            } else if (ctx.match[1] === undefined) {
                await ctx.reply(notFoundTryAgainText());
            } else {
                ctx.user.enabledNotify = ctx.match[1] === "on";
                await ctx.user.save();
                await ctx.editMessageText(
                    notifyMenu(ctx.user.enabledNotify),
                    notifyKeyboard(ctx.user.enabledNotify)
                );
            }

            return await next();
        });

        // Подтверждение смены при знакомстве
        bot.action(/verify_shift_(1|2)/, async (ctx) => {
            await ctx.softAnswerCbQuery();
            const shift: UserShifts = Number(ctx.match[1]);

            if (shift < 1 || shift > 2) {
                await ctx.reply(notFoundTryAgainText());
                return;
            }

            ctx.user.shift = shift;
            await ctx.user.save();

            await ctx.reply(niceToMeet(shift), Markup.removeKeyboard());
            menuAction(ctx);
        });


        // Подтверждение выбора класса при знакомстве
        bot.action(/verify_class_(\d+)/, async (ctx) => {
            await ctx.softAnswerCbQuery();
            const classRange: ClassRanges = Number(ctx.match[1]);

            if (classRange < 0 || classRange > 2) {
                await ctx.reply(notFoundTryAgainText());
                return;
            }

            ctx.user.classRange = classRange;
            await ctx.user.save();

            await ctx.reply(shiftQuestion(classRange), shiftKeyboard())

        });

        // Подтверждение выбора города при знакомстве
        bot.action(/verify_city_(\d+)/, async (ctx) => {
            await ctx.softAnswerCbQuery();

            const cityId = Number(ctx.match[1]);
            const cityName = ctx.vikaApi.cities[Number(ctx.match[1])];
            if (cityName === undefined) {
                await ctx.reply(notFoundTryAgainText());
                return;
            }

            ctx.user.cityId = Number(cityId);
            ctx.user.state = UserStates.NONE;
            await ctx.user.save();

            await ctx.reply(classQuestion(cityName), classKeyboard())

        });

        // Обработка города по геолокации
        bot.on(message("location"), async (ctx) => {
            const loc = ctx.message.location;
            try {
                ctx.city = await getCityNameByGeo(loc.latitude, loc.longitude);
                // @ts-ignore
                await checkCityAction(ctx);
            } catch (e) {
                console.error("Location ERROR: ", e, "UserID:", ctx.user.id);
                await ctx.reply("Ошибка. Попробуйте ввести название города.");
                ctx.isNotNeedInKeyboard = false;
                updateSettingAction(ctx);
            }
        })

        // Обработка города по его названию
        // @ts-ignore
        bot.on(message("text"), checkCityAction)

        notifier(bot, vikaApi);

        const launch = () => bot.launch()
            .then(()=>console.log("Бот успешно запущен"))
            .catch(err => {
                console.error("Ошибка запуска бота:", err);
                launch();
            })

        process.once('SIGINT', () => bot.stop('SIGINT'))
        process.once('SIGTERM', () => bot.stop('SIGTERM'))
    } catch (e) {
        console.error("Ошибка (TelegramService): ", e);
    }
}

AppDataSource.initialize()
    .then(startBot)
    .catch((error) => console.log(error));
