import type {NewMessageEvent} from "./Events/NewMessageEvent.js";
import type {StartMessageEvent} from "./Events/StartMessageEvent.js";
import {UserStates} from "./UserStates.js";
import {User} from "../entities/User.js";


export type PlatformEventCut = NewMessageEvent | StartMessageEvent;
export type PlatformEvent = PlatformEventCut & {
    user: User;
    userState: UserStates;
}
