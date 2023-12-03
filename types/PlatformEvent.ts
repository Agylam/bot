import {NewMessage} from "./Events/NewMessage.js";
import {StartMessageMessage} from "./Events/StartMessage.js";

export type PlatformEvent = NewMessage | StartMessageMessage;
