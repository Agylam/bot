import type {NewMessageTrigger} from "./Triggers/NewMessageTrigger.js";
import type {StartMessageTrigger} from "./Triggers/StartMessageTrigger.js";
import {UserStates} from "./UserStates.js";
import type {Action} from "./Action.js";
import type {UserRoles} from "./UserRoles.js";
import type {CommandTrigger} from "./Triggers/CommandTrigger.js";

export type HandlerTrigger = {
    role: UserRoles | "*";
    userState?: UserStates;
    action: Action;
}& (NewMessageTrigger | StartMessageTrigger)
