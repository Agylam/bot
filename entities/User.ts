import {Entity, Column, PrimaryGeneratedColumn, BaseEntity} from "typeorm"
import {Platforms} from "../types/Platforms.js";
import {UserRoles} from "../types/UserRoles.js";
import {UserStates} from "../types/UserStates.js";

@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    uuid: string

    @Column({
        type: "enum",
        enum: Platforms
    })
    platform: Platforms;

    @Column()
    authorID: string;

    @Column({
        type: "enum",
        enum: UserRoles,
        default: UserRoles.DEFAULT_USER
    })
    role: UserRoles;

    @Column({
        type: "enum",
        enum: UserStates,
        default: UserStates.NONE
    })
    state: UserStates;
}
