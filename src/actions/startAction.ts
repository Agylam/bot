import type {Action} from "../types/Action.js";
import {sadNotify} from "../langs/sadNotify.js";
import {sadNotifyFull} from "../langs/sadNotifyFull.js";
import {happyNotify} from "../langs/happyNotify.js";
import {menuText} from "../langs/menuText.js";
import {startText} from "../langs/startText.js";
import {menuAction} from "./menuAction.js";

export const startAction: Action = async (ctx) => {
    if(ctx.from === undefined) return;
    await ctx.reply(startText(ctx.from.first_name));
    menuAction(ctx);
}
