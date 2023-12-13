import type {UgraActirovkiStatus} from "../VikaActirovkiAPI.js";
import type {User} from "../entities/User.js";

export const actirovkiNotify = (actirovkiStatus : UgraActirovkiStatus, user: User) => {
    let result = "";
    if(actirovkiStatus.status === undefined){
        return `💔 К сожалению, информации по актировке для твоей смены сейчас нет...`;
    }else if(actirovkiStatus.status && actirovkiStatus.class_range !== undefined){
        result = actirovkiStatus.class_range.level >= user.classRange? '✅': '❌' ; // Ура, актировка
        result += `Актировка с 1 по ${actirovkiStatus.class_range.to} класс\n\nЗанятия ${user.shift}й смены отменяются в связи с погодными условиями:`;
    }else{
        result = `❌ Актировки нет!`; // Блин, актировки нет...
    }
    return result + `\nТемпература ${actirovkiStatus.temperature || "Неизвестно"} °C Ветер ${actirovkiStatus.wind_speed || "Неизвестно"} м/сек.`;
}
