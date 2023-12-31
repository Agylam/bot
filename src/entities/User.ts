import {Entity, Column, BaseEntity, PrimaryColumn} from "typeorm"
import {UserStates} from "../types/UserStates.js";
import {ClassRanges} from "../types/ClassRanges.js";

@Entity()
export class User extends BaseEntity{

    /* Required */
    @PrimaryColumn()
    id: number;

    @Column({nullable: true})
    username?: string;

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
    cityId: number;

    @Column({
        nullable: true,
        type: "enum",
        enum: ClassRanges
    })
    classRange: number;

    @Column({nullable: true})
    shift: number;
}
