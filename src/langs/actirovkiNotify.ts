import type {UgraActirovkiStatus} from "../VikaActirovkiAPI.js";
import type {User} from "../entities/User.js";

export const actirovkiNotify = (actirovkiStatus : UgraActirovkiStatus, user: User) => {
    if(actirovkiStatus.status === undefined){
        return `💔 К сожалению, информации по актировке для твоей смены сейчас нет...`;
    }else if(actirovkiStatus.status && actirovkiStatus.class_range !== undefined){
        if(actirovkiStatus.class_range.level >= user.classRange){
            return `✅ Актировка с 1 по ${actirovkiStatus.class_range.to} класс\nТемпература ${actirovkiStatus.temperature}°C, ветер ${actirovkiStatus.wind_speed} м/сек.`; // Ура, актировка
        }else{
            return `❌ Актировка с 1 по ${actirovkiStatus.class_range.to} класс\nТемпература ${actirovkiStatus.temperature}°C, ветер ${actirovkiStatus.wind_speed} м/сек.`; // Увы, актировка есть, но не для нас
        }
    }else{
        return `❌ Актировки нет!\nТемпература ${actirovkiStatus.class_range?.to ||"Неизвестно"}°C, ветер ${actirovkiStatus.wind_speed ||"Неизвестно"} м/сек.`; // Блин, актировки нет...
    }
}
