import {HandlerTrigger} from "../types/HandlerTrigger.js";
import {PlatformEventList} from "../types/PlatformEventList.js";
import {Platforms} from "../types/Platforms.js";
import {PlatformEvent, PlatformEventWithoutUser} from "../types/PlatformEvent.js";
import {User} from "../entities/User.js";
import {AppDataSource} from "../data-source.js";
import {UserStates} from "../types/UserStates.js";

export abstract class BasicPlatformService {
    protected eventCallback: (trigger : PlatformEventWithoutUser, authorID : string) => void;
    platformName: Platforms;
    prefix = "";

    /* General methods */
    registerEventCallback(callback: (trigger : PlatformEvent) => void){
        this.eventCallback = (trigger, authorID) =>{
            this.getUserByAuthorID(authorID)
                .then(user => callback({...trigger, user, userState: user.state }))
        };
    }
    protected splitCmd(msg: string){
        if (!msg.startsWith(this.prefix)) return false;
        const args = msg.trim().split(/ +/g);
        const cmd = args[0].slice(this.prefix.length).toLowerCase();
        return [cmd, args]
    }
    protected async updateUserState(authorID : string, newState: UserStates){
        const user = await this.getUserByAuthorID(authorID);
        user.state = newState;
        await user.save();
    }
    protected async getUserByAuthorID(authorID : string) {
        return await AppDataSource.getRepository(User).findOneOrFail({
            where:{
                authorID: authorID,
                platform: this.platformName
            }
        })
    }
    protected async getAuthorIDByUserUUID(userUUID : string) {
        return await AppDataSource.getRepository(User).findOneOrFail({
            where:{
                uuid: userUUID
            },
            select:{
                authorID: true
            }
        })
            .then(user => user.authorID)
    }
    protected callNewMessageHandler(msg: string, authorID: string){
        this.eventCallback({
            type: PlatformEventList.NEW_MESSAGE,
            platform: this.platformName,
            text: msg,
        }, authorID)
    }
    protected callStartMessageHandler(authorID: string){
        this.eventCallback({
            type: PlatformEventList.START_MESSAGE,
            platform: this.platformName,
        }, authorID)
    }



    /* Unique methods */
    protected constructor() {
    }
    startService() {
    }

    sendMessage(userID: string, text: string) {
    }



}
