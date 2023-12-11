import type {Action} from "../types/Action.js";
import {menuAction} from "./menuAction.js";
import {actirovkiNotify} from "../langs/actirovkiNotify.js";

export const actirovkaAction: Action = async (ctx, next) => {
    await ctx.answerCbQuery();

    try{
        const user = ctx.user
        if(user.cityId !== null && user.classRange !== null && user.shift !== null){
            const actirovkaStatus = await ctx.vikaApi.getActirovkaStatus(user.cityId, user.shift);

            console.log("A", actirovkaStatus)

            await ctx.reply(actirovkiNotify(actirovkaStatus, user));
        }else {
            await ctx.reply("Мы не до конца с вами знакомы. Возвращайтесь и я обязательно тебе подскажу.");
        }
    }catch (e) {
        await ctx.reply("Внутренняя ошибка. Обратитесь к администрации бота.");
        console.error("Ошибка. actirovkaAction: ", e)
    }

    menuAction(ctx);
    if(next !== undefined)
        return await next();
}
