import {PlatformEventList} from "../types/PlatformEventList.js";
import {Platforms} from "../types/Platforms.js";
import type {PlatformEvent, PlatformEventCut} from "../types/PlatformEvent.js";
import {User} from "../entities/User.js";
import {AppDataSource} from "../data-source.js";
import {UserStates} from "../types/UserStates.js";
import type {UnityMethods} from "../types/UnityMethods.js";

export class BasicPlatformService {
    protected eventCallback: (trigger : PlatformEventCut, unityMethods: UnityMethods) => void;
    prefix = "";

    /* General methods */
    registerEventCallback(callback: (trigger : PlatformEvent, unityMethods: UnityMethods) => void){
        this.eventCallback = (trigger, unityMethods: UnityMethods) =>{
            const author = unityMethods.getAuthor()
            if (author === undefined) throw new Error("Author is undefined");

            this.getUserByAuthorID(author.id)
                .then(user => callback({...trigger, user, userState: user.state }, unityMethods))
        };
    }
    protected splitCmd(msg: string){
        if (!msg.startsWith(this.prefix)) return false;
        const args = msg.trim().split(/ +/g);
        const cmd = args[0]?.slice(this.prefix.length).toLowerCase();
        return {cmd, args}
    }
    protected async updateUserState(authorID : string, newState: UserStates){
        const user = await this.getUserByAuthorID(authorID);
        user.state = newState;
        await user.save();
    }
    protected async getUserByAuthorID(authorID : string) {
        let user = await AppDataSource.getRepository(User).findOne({
            where: {
                authorID: authorID,
                platform: this.platform
            }
        });
        if(user !== null) return user;

        user = new User();
        user.authorID = authorID;
        user.platform = this.platform;
        await user.save();

        return user;
    }
    protected async getAuthorIDByUserUUID(userUUID : string) {
        return await AppDataSource.getRepository(User).findOne({
            where:{
                uuid: userUUID
            },
            select:{
                authorID: true
            }
        })
            .then(user => user?.authorID)
    }
    protected callNewMessageHandler(msg: string, unityMethods: UnityMethods){
        this.eventCallback({
            type: PlatformEventList.NEW_MESSAGE,
            text: msg,
        }, unityMethods)
    }
    protected callStartMessageHandler(unityMethods: UnityMethods){
        this.eventCallback({
            type: PlatformEventList.START_MESSAGE,
        }, unityMethods)
    }



    /* Unique methods */
    constructor() {
    }
    async startService(): Promise<boolean> {
        return false;
    }

    sendMessage(authorID: string, text: string) {
    }



}
