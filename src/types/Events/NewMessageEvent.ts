import {PlatformEventList} from "../PlatformEventList.js";

export type NewMessageEvent = {
    type: PlatformEventList.NEW_MESSAGE;
    isCommand: false;
    cmd: "";
    arguments: [];
    text: string;
}
