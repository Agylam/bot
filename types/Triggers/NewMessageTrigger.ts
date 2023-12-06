import {PlatformEventList} from "../PlatformEventList.js";

export type NewMessageTrigger = {
    type: PlatformEventList.NEW_MESSAGE;
    text: string;
}
