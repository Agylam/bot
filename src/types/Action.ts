import type {AdditionContext} from "./AdditionContext.js";
import type {MiddlewareFn} from "telegraf";

export type Action = (ctx: AdditionContext, next?: ()=>Promise<void>) => void;
