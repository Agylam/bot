//

import {UserStates} from "../types/UserStates.js";
import {notFoundTryAgainText} from "../langs/NotFoundTryAgainText.js";
import {checkCityText} from "../langs/checkCityText.js";
import {checkCityKeyboard} from "../keyboards/checkCityKeyboard.js";
import type {NarrowedContext} from "telegraf";
import type {AdditionContext} from "../types/AdditionContext.js";
import type {Message, Update } from "@telegraf/types";
import {Markup} from "telegraf";

export const checkCityAction = async (ctx: NarrowedContext<AdditionContext, Update.MessageUpdate<Record<"text", {}> & Message.TextMessage>>) => {
    if(ctx.user.state === UserStates.WAIT_CITY){
        const inputtedCityLower = (ctx.city !== undefined ? ctx.city : ctx.message?.text).toLowerCase()
        const cityIndex = Object.values(ctx.vikaApi.cities).findIndex(c => c.toLowerCase().includes(inputtedCityLower));
        if(cityIndex === -1){
            await ctx.reply(notFoundTryAgainText());
            return;
        }

        const cityId = Object.keys(ctx.vikaApi.cities)[cityIndex];
        const cityName = Object.values(ctx.vikaApi.cities)[cityIndex];


        if(cityId === undefined){
            await ctx.reply(notFoundTryAgainText());
            return;
        }
        await ctx.reply(checkCityText(cityName), checkCityKeyboard(cityId))
    }
}
