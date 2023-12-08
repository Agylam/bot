import type {Action} from "../types/Action.js";

export const startAction: Action = (ctx) => {
    if(ctx.from === undefined) return;
        ctx.reply("Привет, "+ ctx.from.first_name)
}
