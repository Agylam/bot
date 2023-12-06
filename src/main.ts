import "dotenv/config"
import "reflect-metadata"
import {Unity} from "./classes/Unity.js";
import {TelegramService} from "./services/TelegramService.js";
import {HandlerTrigger} from "./types/HandlerTrigger";
import {PlatformEventList} from "./types/PlatformEventList";

const handlers : HandlerTrigger[] = [
    {
        type: PlatformEventList.START_MESSAGE,
        action: (event, unityMethods) => unityMethods.replyWithText("Hello world!")
    }
];

const a = new Unity([TelegramService], handlers)
