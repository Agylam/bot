import type {ClassRanges} from "../types/ClassRanges.js";
import {classRangesName} from "../types/ClassRanges.js";

export const shiftQuestion = (classRange: ClassRanges) => {
    return `${classRangesName[classRange]} Понял. А какая у тебя смена?`
}
