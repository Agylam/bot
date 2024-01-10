import "dotenv/config"
import "reflect-metadata"
import {AppDataSource} from "./data-source.js";
import {Markup, Telegraf} from "telegraf";
import {User} from "./entities/User.js";
import {startAction} from "./actions/startAction.js";
import type {AdditionContext} from "./types/AdditionContext.js";
import {VikaActirovkiAPI} from "./VikaActirovkiAPI.js";
import {menuAction} from "./actions/menuAction.js";
import {updateSettingAction} from "./actions/updateSettingAction.js";
import {message} from "telegraf/filters";
import {UserStates} from "./types/UserStates.js";
import {classKeyboard} from "./keyboards/classKeyboard.js";
import {notFoundTryAgainText} from "./langs/NotFoundTryAgainText.js";
import { NtpTimeSync } from 'ntp-time-sync';
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

let bot: Telegraf<AdditionContext>;

const vikaApi = new VikaActirovkiAPI();
const timeSync = NtpTimeSync.getInstance();


const timeCheck = 36000000;
const firstShiftTime = [6,10];
const secondShiftTime = [11,30];


const getTime = async () => {
    let now = new Date();
    try {
        const ntpTime = await timeSync.getTime();
        now = ntpTime.now;
    } catch (e) {
        console.error('NTP', e);
    }
    const hour = now.getHours();
    const minute = now.getMinutes();
    const seconds = now.getSeconds();
    const day = now.getDay();

    console.log({ hour, minute, seconds, day });
    return { hour, minute, seconds, day };
};

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

        bot.use(async (ctx, next) => {
            console.log(ctx.message,ctx.reply);

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
                    } else {
                        ctx.user = user;
                    }
                    ctx.user.username = ctx.from.username;
                    await ctx.user.save();
                }
                ctx.vikaApi = vikaApi;
                return next();
            }catch (e){
                console.error("Ошибка", e)
            }
        })


        /* Handlers */

        bot.start(startAction);


        bot.command("menu", menuAction);


        bot.action("menu", menuAction);
        bot.action("update_setting", updateSettingAction);
        bot.action("actirovka_status", actirovkaAction);
        bot.action("notify_settings", notifyMenuAction);

        /* Включение и отключение уведомлений */
        bot.action(/notify_(on|off)/, async (ctx, next) => {
            await ctx.answerCbQuery();

            if(ctx.match[1] === undefined){
                await ctx.reply(notFoundTryAgainText());
            }else{
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
            await ctx.answerCbQuery();
            const shift : UserShifts = Number(ctx.match[1]);

            if(shift < 1 || shift > 2) {
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
            await ctx.answerCbQuery();
            const classRange : ClassRanges = Number(ctx.match[1]);

            if(classRange < 0 || classRange > 2) {
                await ctx.reply(notFoundTryAgainText());
                return;
            }

            ctx.user.classRange = classRange;
            await ctx.user.save();

            await ctx.reply(shiftQuestion(classRange), shiftKeyboard())

        });

        // Подтверждение выбора города при знакомстве
        bot.action(/verify_city_(\d+)/, async (ctx) => {
            await ctx.answerCbQuery();

            const cityId = Number(ctx.match[1]);
            const cityName = ctx.vikaApi.cities[Number(ctx.match[1])];
            if(cityName === undefined){
                await ctx.reply(notFoundTryAgainText());
                return;
            }

            console.log("AS", ctx.match, cityId)

            ctx.user.cityId = Number(cityId);
            ctx.user.state = UserStates.NONE;
            await ctx.user.save();

            await ctx.reply(classQuestion(cityName), classKeyboard())

        });

        // Обработка города по геолокации
        bot.on(message("location"), async (ctx)=>{
            const loc = ctx.message.location;
            ctx.city = await getCityNameByGeo(loc.latitude, loc.longitude);
            // @ts-ignore
            await checkCityAction(ctx);
        })

        // Обработка города по его названию
        // @ts-ignore
        bot.on(message("text"), checkCityAction)

        bot.launch().then()

        process.once('SIGINT', () => bot.stop('SIGINT'))
        process.once('SIGTERM', () => bot.stop('SIGTERM'))
    } catch (e) {
        console.error("Ошибка (TelegramService): ", e);
    }

    // ВНИМАНИЕ, ГОВНОКОД !!!
    setInterval(async (bot)=>{
        try {
            const {hour, minute} = await getTime();
            let shift: 1|2;
            if(hour === firstShiftTime[0] && minute === firstShiftTime[1]){
                shift = 1;
            }else if(hour === secondShiftTime[0] && minute === secondShiftTime[1]){
                shift = 2;
            }else{
                return;
            }
            const users = await User.getByShift(shift);

            const cityIds = users.map(user => user.cityId);
            const uniqueCityIds = [...new Set(cityIds)];

            const cityWeather = uniqueCityIds.map(cityId => vikaApi.getActirovkaStatus(cityId, shift));


        }catch (e) {

        }
    }, timeCheck, bot)
}

AppDataSource.initialize()
    .then(startBot)
    .catch((error) => console.log(error))

