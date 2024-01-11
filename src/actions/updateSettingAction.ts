import type {Action} from "../types/Action.js";
import {UserStates} from "../types/UserStates.js";
import {Markup} from "telegraf";

export const updateSettingAction: Action = async (ctx, next) => {
    try {
        await ctx.answerCbQuery();
    }catch (err) {}
    await ctx.reply("Хорошо. Давай начнём. Где ты живёшь? Можешь прислать название или геопозицию, как удобно",
        ctx.isNeedInKeyboard ? Markup.keyboard([
            Markup.button.locationRequest("📍Прислать местоположение"),
        ]).resize(): undefined);
    ctx.user.state = UserStates.WAIT_CITY;
    await ctx.user.save();
    if(next !== undefined) return next();
}
