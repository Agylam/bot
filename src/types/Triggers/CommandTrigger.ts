import {PlatformEventList} from "../PlatformEventList.js";

export type CommandTrigger = {
    type: PlatformEventList.NEW_MESSAGE;
    text: string;
}
