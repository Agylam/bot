import type {Action} from "../types/Action.js";
import {sadNotify} from "../langs/sadNotify.js";

export const startAction: Action = (ctx) => {
    if(ctx.from === undefined) return;
    ctx.reply(sadNotify(4,"-24","1"))
}
