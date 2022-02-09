import {Request, Response} from "express";
import {fetch, Response as Res} from "undici";
import logger from "../utils/logger";
import pool from "../app";

type City = {
    id: number,
    name: string,
    nameInEnglish: string,
    latitude: number,
    longitude: number,
    isCapital: boolean,
};

type importedCity = {
    id: number,
    name: string,
    name2: string,
    name3: string,
    slug: string,
    state: string,
    region: string,
    lat: number,
    lng: number,
    diff: string,
    capital: number
}

type importedCities = {
    cities: importedCity[],
};

async function fetchJsonCities(): Promise<importedCities | undefined> {
    const res: Res = await fetch('https://gotoshop.ua/apiv3/cities');
    return await res.json() as importedCities;
}

export default {
    async getAllApiCities(): Promise<importedCity[] | undefined> {
        const apiCitiesObj = await fetchJsonCities();
        return apiCitiesObj?.cities as importedCity[] ?? undefined;
    },

    async importApiCities(): Promise<City[] | undefined> {
        const query = `INSERT INTO cities 
                       (id, name, name_in_english, latitude, longitude, is_capital) 
                       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

        let resultCities: City[] = [];
        const apiCities = await this.getAllApiCities();

        for (const apiCity of apiCities!) {
            const isCapital = Number(apiCity.capital) > 0;
            resultCities.push(
                {
                    id: apiCity.id,
                    name: apiCity.name,
                    nameInEnglish: apiCity.slug,
                    latitude: apiCity.lat,
                    longitude: apiCity.lng,
                    isCapital: isCapital,
                }
            )
        }
        for (const resultCity of resultCities) {
            const values = [
                resultCity.id,
                resultCity.name,
                resultCity.nameInEnglish,
                resultCity.latitude,
                resultCity.longitude,
                resultCity.isCapital
            ];
            await pool?.query(query, values);
        }

        return resultCities;
    },

    async getAllCities(): Promise<object[] | undefined> {
        const query = `SELECT * FROM cities`;
        const cities = await pool?.query(query);

        if (cities) return cities.rows;
        return undefined;
    },

    async getCityById(cityId: number) {
        const query = `SELECT * FROM cities WHERE id = $1`;
        const values = [cityId];
        const city = await pool?.query(query, values);

        if (city) return city.rows[0];
        return undefined;
    },

    async deleteCity(cityId: number) {
        const query = `DELETE FROM cities WHERE id = $1 RETURNING id`;
        const values = [cityId];
        const deletedCitiesNumber = await pool?.query(query, values);

        return !!deletedCitiesNumber?.rowCount;
    },

    async createCity(newCityParams: City) {
        const query = `INSERT INTO cities
                       (name, name_in_english, latitude, longitude, is_capital)
                       VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [
            newCityParams.name,
            newCityParams.nameInEnglish,
            newCityParams.latitude,
            newCityParams.longitude,
            newCityParams.isCapital
        ];
        const newCity = await pool?.query(query, values);

        if (newCity) return newCity.rows[0];
        return undefined;
    },
};