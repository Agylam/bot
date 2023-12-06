import type {NewMessageTrigger} from "./Triggers/NewMessageTrigger.js";
import type {StartMessageTrigger} from "./Triggers/StartMessageTrigger.js";
import {Platforms} from "./Platforms.js";
import {UserStates} from "./UserStates.js";
import type {Action} from "./Action.js";

export type HandlerTrigger = {
    platform?: Platforms;
    role?: string;
    userState?: UserStates;
    action: Action;
}& (NewMessageTrigger | StartMessageTrigger)
