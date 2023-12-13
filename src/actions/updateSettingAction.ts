import type {Action} from "../types/Action.js";
import {UserStates} from "../types/UserStates.js";
import {Markup} from "telegraf";

export const updateSettingAction: Action = async (ctx, next) => {
    await ctx.answerCbQuery();
    await ctx.reply("Хорошо. Давай начнём. Где ты живёшь? Можешь прислать название или геопозицию, как удобно",
        Markup.keyboard([
            Markup.button.locationRequest("📍Прислать местоположение"),
        ]).resize());
    ctx.user.state = UserStates.WAIT_CITY;
    await ctx.user.save();
    if(next !== undefined) return next();
}
