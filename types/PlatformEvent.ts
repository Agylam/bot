import {NewMessageEvent} from "./Events/NewMessageEvent.js";
import {StartMessageEvent} from "./Events/StartMessageEvent.js";
import {DefaultEvent} from "./Events/DefaultEvent.js";
import {Platforms} from "./Platforms.js";
import {UserStates} from "./UserStates.js";
import {User} from "../entities/User.js";


export type PlatformEventWithoutUser = {
    platform: Platforms;
} & (NewMessageEvent | StartMessageEvent);
export type PlatformEvent = PlatformEventWithoutUser & {
    user: User;
    userState: UserStates;
}
