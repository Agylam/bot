import type {Action} from "../types/Action.js";
import {notifyMenu} from "../langs/notifyMenu.js";
import {notifyKeyboard} from "../keyboards/notifyKeyboard.js";

export const notifyMenuAction: Action = async (ctx) => {
    await ctx.softAnswerCbQuery();
    const user = ctx.user;
    const isEnabledNotify = ctx.user.enabledNotify && !(!user.cityId || !user.classRange || !user.shift);
    await ctx.editMessageText(notifyMenu(ctx.user.enabledNotify), notifyKeyboard(isEnabledNotify))
}
