import {DefaultEvent} from "./DefaultEvent.js";
import {PlatformEvent} from "../PlatformEventList.js";

export type NewMessage = DefaultEvent & {
    type: PlatformEvent.NEW_MESSAGE;
    text: string;
}
