import type {Action} from "../types/Action.js";
import {menuAction} from "./menuAction.js";
import {actirovkiNotify} from "../langs/actirovkiNotify.js";
import {toMenuKeyboard} from "../keyboards/toMenuKeyboard.js";
import {startKeyboard} from "../keyboards/startKeyboard.js";

export const actirovkaAction: Action = async (ctx, next) => {
    await ctx.answerCbQuery();

    try{
        const user = ctx.user
        if(user.cityId !== null && user.classRange !== null && user.shift !== null){
            const actirovkaStatus = await ctx.vikaApi.getActirovkaStatus(user.cityId, user.shift);

            await ctx.reply(actirovkiNotify(actirovkaStatus, user), toMenuKeyboard());
        }else {
            await ctx.reply("Мы не до конца с вами знакомы. Познакомимся?", startKeyboard());
        }
    }catch (e) {
        await ctx.reply("Внутренняя ошибка. Обратись к администрации бота.");
        console.error("Ошибка. actirovkaAction: ", e)
        menuAction(ctx);
    }

    if(next !== undefined)
        return await next();
}
