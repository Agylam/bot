import type {Action} from "../types/Action.js";
import {sadNotify} from "../langs/sadNotify.js";
import {sadNotifyFull} from "../langs/sadNotifyFull.js";
import {happyNotify} from "../langs/happyNotify.js";
import {menuText} from "../langs/menuText.js";

export const startAction: Action = async (ctx) => {
    if(ctx.from === undefined) return;
    await ctx.reply(sadNotify(4,"-24","1"))
    await ctx.reply(sadNotifyFull())
    await ctx.reply(sadNotifyFull("-24","1"))
    await ctx.reply(happyNotify(4,"-24","1"))
    await ctx.reply(menuText())
}
