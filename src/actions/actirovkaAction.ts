import type {Action} from "../types/Action.js";
import {menuAction} from "./menuAction.js";

export const actirovkaAction: Action = async (ctx) => {
    const user = ctx.user

    if(user.cityId === undefined || user.classRange === undefined || user.shift === undefined){
        await ctx.reply("Мы не до конца с вами знакомы. Возвращайтесь и я обязательно тебе подскажу.");
        menuAction(ctx);
    }
}
