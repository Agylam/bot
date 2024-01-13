import {Telegraf} from "telegraf";
import type {AdditionContext} from "../types/AdditionContext.js";
import {User} from "../entities/User.js";
import {actirovkiNotify} from "../langs/actirovkiNotify.js";
import {toMenuKeyboard} from "../keyboards/toMenuKeyboard.js";
import {getTime} from "./getTime.js";
import {VikaActirovkiAPI} from "../VikaActirovkiAPI.js";

let timeCheck = 60000;
let firstShiftTime = [1, 10]; // 6:10 по UTC+5
let secondShiftTime = [6, 30]; // 11:30 по UTC+5

export const notifier = async (bot: Telegraf<AdditionContext>, vikaApi: VikaActirovkiAPI)=>{
    setInterval(async () => {
        try {
            const {hour, minute} = await getTime();
            let shift: 1 | 2;
            if (hour === firstShiftTime[0] && minute === firstShiftTime[1]) {
                console.log("Оповещаем первую смену......")
                shift = 1;
            } else if (hour === secondShiftTime[0] && minute === secondShiftTime[1]) {
                console.log("Оповещаем вторую смену......")
                shift = 2;
            } else {
                return;
            }
            const users = await User.getByShift(shift);

            const cityIds = users.map(user => user.cityId);
            const uniqueCityIds = [...new Set(cityIds)];

            const citiesWeather = await Promise.all(uniqueCityIds.map(async (cityId) => {
                const weather = await vikaApi.getActirovkaStatus(cityId, shift);
                const user_list = users
                    .filter(user => user.cityId == cityId)
                return {
                    cityId,
                    weather,
                    users: user_list
                };
            }));


            citiesWeather.map((cityWeather) => {
                try {
                    cityWeather.users.map(user => {
                        if(!user.cityId || !user.classRange || !user.shift) return;

                        bot.telegram.sendMessage(user.id, actirovkiNotify(cityWeather.weather, user), toMenuKeyboard())
                            .then(()=>
                                console.log("Успешно оповестили пользователя ID"+user.id+" в городе "+cityWeather.weather.city.name))
                            .catch((e)=>{
                                console.error("Ошибка. NotifyUser: ", e, "Объект городской погоды:", cityWeather)
                                bot.telegram.sendMessage(user.id, "Внутренняя ошибка. Обратись к администрации бота.", toMenuKeyboard())
                                    .then(()=>console.log("Пользователю отправлено сообщение об ошибке"))
                                    .catch((e)=>{
                                        console.error("Ошибка. NotifyUser MAP: ", e, "Объект городской погоды:", cityWeather)
                                    })
                            })
                    });
                } catch (e) {
                    console.error("Ошибка. NotifyUser MAP: ", e, "Объект городской погоды:", cityWeather)
                }
            })

        } catch (e) {
            console.error("Ошибка таймера:", e)
        }
    }, timeCheck)
}
