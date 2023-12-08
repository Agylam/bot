import type {PlatformEvent} from "./PlatformEvent.js";
import type {UnityMethods} from "./UnityMethods";
import {Context} from "telegraf";
import type {AdditionContext} from "../classes/Bot.js";

export type Action = (event: PlatformEvent, ctx: Context&AdditionContext) => void;
