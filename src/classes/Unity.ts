import type {PlatformEvent} from "../types/PlatformEvent.js";
import {BasicPlatformService} from "../services/BasicPlatformService.js";
import type {HandlerTrigger} from "../types/HandlerTrigger.js";
import type {UnityMethods} from "../types/UnityMethods.js";

export class Unity {
    private services: BasicPlatformService[] = [];
    private triggers : HandlerTrigger[];

    constructor(services: (typeof BasicPlatformService)[], handlers : HandlerTrigger[]) {
        this.services = services.map(Service => new Service());
        this.triggers = handlers;
        this.services.map(service => service.registerEventCallback(this.newEvent));

        Promise.all(this.services.map(service => service.startService())).then(
            (values)=>{
                const failedServiceIndex = values.indexOf(false);
                if (failedServiceIndex !== -1){
                    const failedServiceID = this.services[failedServiceIndex]?.platform;
                    console.error("Ошибка запуска сервиса с ID (Enum)", failedServiceID);
                    return;
                }
                console.log("Успешный запуск всех сервисов")
            },
            (error) => {
                console.error("Ошибка (Unity):", error);
            }
        )
    }

    newEvent = (event : PlatformEvent, unityMethods: UnityMethods)=> {
        const foundEvent = this.triggers.find(e=> e.type === event.type);
        if (foundEvent !== undefined){
            foundEvent.action(event, unityMethods);
        }
    }
}
