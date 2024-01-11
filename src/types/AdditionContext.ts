import {Context} from "telegraf";
import {User} from "../entities/User.js";
import type {VikaActirovkiAPI} from "../VikaActirovkiAPI.js";
import type {FmtString} from "telegraf/format.js";

export interface AdditionContext extends Context {
    user: User;
    vikaApi: VikaActirovkiAPI;
    city?: string;
    isNeedInKeyboard?: boolean;
}
