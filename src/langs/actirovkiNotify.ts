import type {UgraActirovkiStatus} from "../VikaActirovkiAPI.js";
import type {User} from "../entities/User.js";

export const actirovkiNotify = (actirovkiStatus : UgraActirovkiStatus, user: User) => {
    let result = "";
    if(actirovkiStatus.status === undefined){
        return `💔 К сожалению, информации по актировке для твоей смены сейчас нет...`;
    }else if(actirovkiStatus.status && actirovkiStatus.class_range !== undefined){
        //result = actirovkiStatus.class_range.level >= user.classRange? '': '☀️' ; // Ура, актировка
        result += `❄️ Актировка с 1 по ${actirovkiStatus.class_range.to} класс\nЗанятия ${user.shift}й смены отменяются в связи с погодными условиями:`;
    }else{
        result = `☀️ Актировки нет!\nВсе классы учатся в штатном режиме`; // Блин, актировки нет...
    }
    if(actirovkiStatus.temperature === undefined || actirovkiStatus.wind_speed === undefined){
        result += `\n🌡 Температура и ветер: Неизвестно`;
    }else{
        result += `\n🌡 Температура и ветер: ${actirovkiStatus.temperature}°C | 🌬  ${actirovkiStatus.wind_speed} м/с`;
    }
    return result;
}
