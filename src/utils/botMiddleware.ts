import {AppDataSource} from "../data-source.js";
import {User} from "../entities/User.js";
import {VikaActirovkiAPI} from "../VikaActirovkiAPI.js";
import type {Middleware} from "telegraf";
import type {AdditionContext} from "../types/AdditionContext.js";

export const botMiddleware = (vikaApi: VikaActirovkiAPI) : Middleware<AdditionContext> => {
    return async (ctx, next) => {
        console.log(ctx.message, ctx.reply);

        try {
            if (ctx.from !== undefined) {
                const user = await AppDataSource.getRepository(User).findOne({
                    where: {
                        id: ctx.from.id,
                    }
                });
                if (user === null) {
                    ctx.user = new User();
                    ctx.user.id = ctx.from.id;
                } else {
                    ctx.user = user;
                }
                ctx.user.username = ctx.from.username;
                await ctx.user.save();
            }
            ctx.vikaApi = vikaApi;
            return next();
        } catch (e) {
            console.error("Ошибка", e)
        }
    }
}
