import type {HandlerTrigger} from "../types/HandlerTrigger.js";
import type {PlatformEvent} from "../types/PlatformEvent.js";
import type {UnityMethods} from "../types/UnityMethods.js";

export class HandlerManager {
    private triggers : HandlerTrigger[];

    registerTrigger (newTrigger : HandlerTrigger){
        this.triggers.push(newTrigger);
    }

    newEvent (event : PlatformEvent, unityMethods: UnityMethods){
        const foundEvent = this.triggers.find(e=> e.type === event.type);
        if (foundEvent !== undefined){
            foundEvent.action(event, unityMethods);
        }
    }

}
