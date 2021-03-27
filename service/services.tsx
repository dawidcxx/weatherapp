import { delay } from "../utils/utils";

export interface Forecast {
    geometry: {
        type: string;
        coordinates: number[];
    };
    properties: {
        timeseries: Array<{
            time: string,
            data: {
                instant: {
                    details: {
                        air_pressure_at_sea_level: number;
                        air_temperature: number;
                        cloud_area_fraction: number;
                        relative_humidity: number;
                        wind_from_direction: number;
                        wind_speed: number;
                    }
                },
                next_12_hours: {
                    summary: {
                        symbol_code: string
                    }
                }
            }
        }>;
    }
};


export interface Cords {
    latitude: number;
    longitude: number;
}

export const forecastService = {
    async getForcecast(cords: Cords): Promise<Forecast> {
        const resp: Forecast = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${cords.latitude}&lon=${cords.longitude}`)
            .then(resp => resp.json());
        await delay(100);
        resp.properties.timeseries = resp.properties.timeseries.slice(0, 24);
        return resp;
    },

};


export const geolocationService = {
    async getCityNameFromLatLong(cords: Cords): Promise<string> {
        let resp = await fetch('/api/reverse-geocodes', {
            method: 'POST',
            body: JSON.stringify(cords),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(resp => resp.json());
        return resp.name;
    }
};