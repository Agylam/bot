import "dotenv/config"
import "reflect-metadata"
import {Unity} from "./classes/Unity.js";
import {TelegramService} from "./services/TelegramService.js";
import type {HandlerTrigger} from "./types/HandlerTrigger.js";
import {PlatformEventList} from "./types/PlatformEventList.js";
import {AppDataSource} from "./data-source.js";
import {startAction} from "./actions/startAction.js";

const handlers : HandlerTrigger[] = [
    {
        type: PlatformEventList.START_MESSAGE,
        action: startAction
    }
];

AppDataSource.initialize()
    .then(() => {
        const a = new Unity([TelegramService], handlers)
    })
    .catch((error) => console.log(error))

