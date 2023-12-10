import type {Action} from "../types/Action.js";
import {UserStates} from "../types/UserStates.js";

export const updateSettingAction: Action = async (ctx, next) => {
    await ctx.answerCbQuery();
    await ctx.reply("Хорошо. Давай начнём. Где ты живёшь? Мне важно именно название");
    ctx.user.state = UserStates.WAIT_CITY;
    await ctx.user.save();
    if(next !== undefined) return next();
}
