import {NewMessageEvent} from "./Events/NewMessageEvent.js";
import {StartMessageEvent} from "./Events/StartMessageEvent.js";
import {Platforms} from "./Platforms.js";
import {UserStates} from "./UserStates.js";
import {User} from "../entities/User.js";


export type PlatformEventCut = NewMessageEvent | StartMessageEvent;
export type PlatformEvent = PlatformEventCut & {
    user: User;
    userState: UserStates;
    platform: Platforms;
}
