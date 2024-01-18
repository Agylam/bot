import type {Action} from "../types/Action.js";
import {UserStates} from "../types/UserStates.js";
import {Markup} from "telegraf";

export const updateSettingAction: Action = async (ctx, next) => {
    await ctx.softAnswerCbQuery();
    await ctx.reply("Хорошо. Давай начнём. Где ты живёшь? Можешь написать название или геопозицию, как удобно",
         Markup.keyboard(!ctx.isNotNeedInKeyboard ?[
            Markup.button.locationRequest("📍Отправить местоположение"),
        ]:[]).resize());
    ctx.user.state = UserStates.WAIT_CITY;
    await ctx.user.save();
    if(next !== undefined) return next();
}
