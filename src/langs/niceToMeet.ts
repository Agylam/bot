import type {UserShifts} from "../types/UserShifts.js";

export const niceToMeet = (shift: UserShifts) => {
    return `${shift == 1 ? "Первая" : "Вторая"} смена. Замечательно. Рад знакомству 🤙`
}
