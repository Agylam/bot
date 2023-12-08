import {PlatformEventList} from "../PlatformEventList.js";
import type {NewMessageEvent} from "./NewMessageEvent.js";

export type CommandEvent = NewMessageEvent & {
    isCommand: true;
}
