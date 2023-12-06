import type {Action} from "../types/Action.js";

export const startAction: Action = (event, unityMethods) => {
    unityMethods.replyWithText("Привет, "+ unityMethods.getAuthor()?.firstName);
}
