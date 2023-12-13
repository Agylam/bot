import type {Action} from "../types/Action.js";
import {startText} from "../langs/startText.js";
import {startKeyboard} from "../keyboards/startKeyboard.js";

export const startAction: Action = async (ctx) => {
    if(ctx.from === undefined) return;
    await ctx.reply(startText(ctx.from.first_name), startKeyboard());
}
