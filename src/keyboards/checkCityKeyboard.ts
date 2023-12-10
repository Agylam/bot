import {Markup} from "telegraf";

export const checkCityKeyboard = (cityId: string) => {
    return Markup.inlineKeyboard([
        Markup.button.callback("✅ Верно", "verify_city_"+cityId),
    ])
}
