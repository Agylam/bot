import {PlatformEvent} from "./PlatformEventList.js";
import {UserRoles} from "./UserRoles.js";

export interface HandlerTrigger {
    name: string;
    type: PlatformEvent;
    roles: UserRoles[];
}
