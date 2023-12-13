import type {Action} from "../types/Action.js";
import {menuText} from "../langs/menuText.js";
import {menuKeyboard} from "../keyboards/menuKeyboard.js";
import {classRangesName} from "../types/ClassRanges.js";

export const menuAction: Action = async (ctx) => {
    await ctx.answerCbQuery();
    const userCity = ctx.user.cityId === undefined ? undefined : ctx.vikaApi.cities[ctx.user.cityId];
    const userClass = ctx.user.classRange === undefined ? "Не установлен" : classRangesName[ctx.user.classRange]
    await ctx.reply(menuText(userCity, userClass, ctx.user.shift), menuKeyboard(userCity !== undefined))
}
