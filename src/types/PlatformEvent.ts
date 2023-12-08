import type {NewMessageEvent} from "./Events/NewMessageEvent.js";
import type {StartMessageEvent} from "./Events/StartMessageEvent.js";
import {UserStates} from "./UserStates.js";
import {User} from "../entities/User.js";
import type {UserRoles} from "./UserRoles.js";
import type {CommandEvent} from "./Events/CommandEvent.js";


export type PlatformEventCut = NewMessageEvent | StartMessageEvent;
export type PlatformEvent = PlatformEventCut & {
    user: User;
    userState: UserStates;
    role: UserRoles
}
