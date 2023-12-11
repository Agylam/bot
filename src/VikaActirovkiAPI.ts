/*

    API Дурат... КХМ КХМ, неудобное, поэтому и код ... некрасивый
    Депинформтехнологий Югры.....

 */
import {UserShifts} from "./types/UserShifts.js";
import type {ClassRanges} from "./types/ClassRanges.js";

const classRangeRegex = /с 1 по (\d{1,2})/gm;

export interface UgraCities {
    [id: number]: string;
}

export interface UgraActirovkiStatus {
    city: {
        name: string;
        id: number;
    },
    shift: UserShifts;
    fullMessage?: string;
    status?: boolean,
    class_range?: {
        from: 1;
        to: number;
        level: ClassRanges;
    },
    temperature?: string; // "C"
    wind_speed?: string; // "м/с"
};


interface VikaActirovkiCities {
    ID: string;
    NAME: string;
}

interface VikaActirovkiStatus {
    ID: string;
    CITY: string;
    SHIFT: number;
    CLASS_RANGE: string | null;
    FULL_MESSAGE: string;
    CREATE_DATETIME: string | null;
    WEATHER?: {
        TEMPERATURE: string;
        WIND_SPEED: string;
        DATETIME_RECEIVING: string;
    };
    THRESHOLD?: {
        TEMPERATURE: number;
        WIND: number;
    };
}

export class VikaActirovkiAPI {
    readonly API_URL = "https://vi.admhmao.ru/api/actirovki/";
    cities: UgraCities;

    constructor() {
        this.getCityList().then(cityList => this.cities = cityList)
    }

    async getCityList(): Promise<UgraCities> {
        const citiesApi: VikaActirovkiCities[] = await fetch(this.API_URL + "?action=getCityList")
            .then(r => r.json())
            .then(r => r.result.response)


        const citiesArray = citiesApi.map((city) => [Number(city.ID), city.NAME]);

        // @ts-ignore
        return Object.fromEntries(new Map(citiesArray));
    }

    async getActirovkaStatus(city_id: number, shift: UserShifts): Promise<UgraActirovkiStatus> {
        const cityName = this.cities[city_id];
        if (cityName === undefined) throw new Error("Unknown cityId: " + city_id);
        const currentRecords: VikaActirovkiStatus[] = await fetch(this.API_URL + "?action=getCurrentRecord&city_id=" + city_id)
            .then(r => r.json())
            .then(r => r.result.response);

        let response: UgraActirovkiStatus = {
            city: {
                id: city_id,
                name: cityName
            },
            shift: shift
        }

        const record = currentRecords.find(r => r.SHIFT === shift);

        if (record !== undefined) {
            response.fullMessage = record.FULL_MESSAGE;
            if (record.CLASS_RANGE !== null && record.WEATHER !== undefined) {
                classRangeRegex.lastIndex = 0;
                const classRangeRegexExec = classRangeRegex.exec(record.CLASS_RANGE)
                if (classRangeRegexExec === null) {
                    throw new Error("Unexpected classRange: " + record.CLASS_RANGE + " cityId: " + city_id);
                }

                const classRangeTo = Number(classRangeRegexExec[1]);
                const classRangeLevel = classRangeTo > 4 ? (classRangeTo > 8 ? 2 : 1) : 0

                response.status = true;
                response.class_range = {
                    from: 1,
                    to: classRangeTo,
                    level: classRangeLevel
                };
                response.temperature = record.WEATHER.TEMPERATURE;
                response.wind_speed = record.WEATHER.WIND_SPEED;
            }else{
                response.status = false;
            }
        }
        console.log("Отправил данные по API", response)
        return response;
    }
}
