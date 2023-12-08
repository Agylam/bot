import {Context} from "telegraf";
import {User} from "../entities/User.js";

export interface AdditionContext extends Context {
    user: User;
}
