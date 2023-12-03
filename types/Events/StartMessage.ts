import {DefaultEvent} from "./DefaultEvent.js";
import {PlatformEvent} from "../PlatformEventList.js";

export type StartMessageMessage = DefaultEvent & {
    type: PlatformEvent.START_MESSAGE;
}
