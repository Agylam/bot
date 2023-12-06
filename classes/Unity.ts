import {HandlerManager} from "./HandlerManager.js";
import {PlatformEvent} from "../types/PlatformEvent.js";
import {BasicPlatformService} from "../services/BasicPlatformService";
import {HandlerTrigger} from "../types/HandlerTrigger";
import {UnityMethods} from "../types/UnityMethods";

export class Unity {
    private handlerManager = new HandlerManager();
    private services: BasicPlatformService[];

    constructor(services: (typeof BasicPlatformService)[], handlers : HandlerTrigger[]) {
        this.services = services.map(Service => new Service())
        this.services.map(service => service.registerEventCallback(this.newEvent))

        Promise.all(this.services.map(service => service.startService())).then(
            (values)=>{
                const failedServiceIndex = values.indexOf(false);
                if (failedServiceIndex !== -1){
                    const failedServiceID = this.services[failedServiceIndex].platform;
                    console.error("Ошибка запуска сервиса с ID (Enum)", failedServiceID);
                    return;
                }

                handlers.map(handler => this.handlerManager.registerTrigger(handler))
            },
            (error) => {
                console.error("Ошибка (Unity):", error);
            }
        )
    }

    newEvent(event : PlatformEvent, unityMethods: UnityMethods){
        this.handlerManager.newEvent(event, unityMethods);
    }
}
