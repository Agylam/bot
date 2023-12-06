import {HandlerTrigger} from "../types/HandlerTrigger.js";
import {PlatformEvent} from "../types/PlatformEvent.js";

export class HandlerManager {
    private triggers : HandlerTrigger[];

    registerTrigger (newTrigger : HandlerTrigger){
        this.triggers.push(newTrigger);
    }

    newEvent (event : PlatformEvent){
        const foundEvent = this.triggers.find(e=> e.type === event.type);
        if (foundEvent !== undefined){
            foundEvent.action(event);
        }
    }

}
