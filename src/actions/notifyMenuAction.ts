import type {Action} from "../types/Action.js";
import {notifyMenu} from "../langs/notifyMenu.js";
import {notifyKeyboard} from "../keyboards/notifyKeyboard.js";

export const notifyMenuAction: Action = async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(notifyMenu(ctx.user.enabledNotify), notifyKeyboard(ctx.user.enabledNotify))
}
