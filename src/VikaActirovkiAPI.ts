/*

    API Дурат... КХМ КХМ, неудобное, поэтому и код ... некрасивый
    Депинформтехнологий Югры.....

 */
const classRangeRegex = /с 1 по (\d{1,2})/gm;

export interface UgraCities {
    [id: number]: string;
}

interface UgraActirovkiStatus {
    city: {
        name: string;
        id: number;
    },
    status: boolean,
    class_range?: {
        from: 1;
        to: number;
    },
    temperature?: string;
    wind_speed?: string; // "м/с"
    shift: 1 | 2;
    fullMessage?: string;
}


interface VikaActirovkiCities {
    ID: string;
    NAME: string;
}

interface VikaActirovkiStatus {
    id: string;
    city: string;
    shift: number;
    classRange: string | null;
    fullMessage: string;
    createDatetime: string | null;
    weather?: {
        temperature: string;
        windSpeed: string;
        datetimeReceiving: string;
    };
    threshold?: {
        temperature: number;
        wind: number;
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

    async getActirovkaStatus(city_id: number, shift: 1 | 2): Promise<UgraActirovkiStatus> {
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
            status: false,
            shift: shift
        }

        const record = currentRecords.find(r => r.shift === shift);

        if (record !== undefined) {
            response.fullMessage = record.fullMessage;
            if (record.classRange !== null && record.weather !== undefined) {
                const classRangeRegexExec = classRangeRegex.exec(record.classRange)
                if (classRangeRegexExec === null) {
                    throw new Error("Unexpected classRange: " + record.classRange + " cityId: " + city_id);
                }


                response.status = true;
                response.class_range = {
                    from: 1,
                    to: Number(classRangeRegexExec[1])
                };
                response.temperature = record.weather.temperature;
                response.wind_speed = record.weather.windSpeed;
            }
        }

        return response;
    }
}
