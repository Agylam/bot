import {Entity, Column, BaseEntity, PrimaryColumn} from "typeorm"
import {UserStates} from "../types/UserStates.js";

@Entity()
export class User extends BaseEntity{

    /* Required */
    @PrimaryColumn()
    id: number;

    @Column({
        type: "enum",
        enum: UserStates,
        default: UserStates.NONE
    })
    state: UserStates;

    @Column({default: false})
    enabledNotify: boolean;

    @Column({default: 0})
    notifyHour: number;

    @Column({default: 0})
    notifyMinute: number;


    /* Non-required */
    @Column({nullable: true})
    cityId?: number;
}
