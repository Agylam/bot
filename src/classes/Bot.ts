import type {PlatformEvent} from "../types/PlatformEvent.js";
import {BasicPlatformService} from "./BasicPlatformService.js";
import type {HandlerTrigger} from "../types/HandlerTrigger.js";
import type {UnityMethods} from "../types/UnityMethods.js";
import {TelegramService} from "./TelegramService.js";

export class Bot {
    private triggers : HandlerTrigger[];
    private telegramService: TelegramService;

    constructor(handlers : HandlerTrigger[]) {
        this.triggers = handlers;
        this.telegramService = new TelegramService();
        this.telegramService.registerEventCallback(this.newEvent)
        this.telegramService.startService().then(status => {
            if (status) {
                console.log("Успешный запуск всех сервисов")
            } else {
                console.error("Ошибка запуска")
            }
        }, (error)=>console.error("Ошибка запуска:",error));
    }

    newEvent = (event : PlatformEvent, unityMethods: UnityMethods)=> {
        const foundEvent = this.triggers.find(e=> e.type === event.type);
        if (foundEvent !== undefined){
            foundEvent.action(event, unityMethods);
        }
    }
}
