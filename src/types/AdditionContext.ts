import {Context} from "telegraf";
import {User} from "../entities/User.js";
import type {VikaActirovkiAPI} from "../VikaActirovkiAPI.js";

export interface AdditionContext extends Context {
    user: User;
    vikaApi: VikaActirovkiAPI;
    city?: string;
    isNotNeedInKeyboard?: boolean;
    softAnswerCbQuery: () => Promise<void>;
}
