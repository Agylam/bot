import {DefaultEvent} from "./DefaultEvent.js";
import {PlatformEventList} from "../PlatformEventList.js";

export type NewMessageEvent = {
    type: PlatformEventList.NEW_MESSAGE;
    text: string;
}
