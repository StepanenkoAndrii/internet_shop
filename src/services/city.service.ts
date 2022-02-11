import {Request, Response} from "express";
import {fetch, Response as Res} from "undici";
import logger from "../utils/logger";
import pool from "../app";
import _ from "lodash";
import {City, importedCities, Product, importedProducts} from "../interfaces";

async function fetchJsonCities(): Promise<importedCities | undefined> {
    const res: Res = await fetch('https://gotoshop.ua/apiv3/cities/?limit=100');
    return await res.json() as importedCities;
}

async function fetchJsonCityProducts(cityId: number, offset: number): Promise<importedProducts | undefined> {
    // const res: Res = await fetch(`https://gotoshop.ua/apiv3/products/?limit=1000&offset=3000&city_id=${cityId}`);
    const res: Res = await fetch(`https://gotoshop.ua/apiv3/products/?limit=1000&offset=${offset}&city_id=${cityId}`);
    return await res.json() as importedProducts;
}

export default {
    async getAllApiCities(): Promise<City[] | undefined> {
        const apiCitiesObj = await fetchJsonCities();
        return apiCitiesObj?.cities as City[] ?? undefined;
    },

    async importApiCities(): Promise<City[] | undefined> {
        const query = `INSERT INTO cities 
                       (id, name, name2, name3, slug, state, region, lat, lng, diff, capital) 
                       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`;

        const apiCities = await this.getAllApiCities();

        for (const apiCity of apiCities!) {
            const values = Object.values(apiCity);
            await pool?.query(query, values);
        }



        return apiCities;
    },

    // to fill city-shop-links table

    async addLinks() {
        // const sleep = (t: number | undefined) => new Promise((resolve) => setTimeout(resolve, t));
        // sleep(1000).then()

        const query = `INSERT INTO city_shop_links (city_id, shop_id)
                       VALUES ($1, $2) RETURNING *`;
        const allCities = await this.getAllCities() as City[];

        // const citiesArr = allCities.map(city => {
        //
        // });
        //
        // Promise.allSettled(citiesArr).then();

        for (const city of allCities) {
            for (let i = 4; i < 20; i++) {
                const apiCityProductsObj = await fetchJsonCityProducts(Number(city.id), i * 1000);
                const allCityProducts = apiCityProductsObj?.products as Product[] ?? undefined;

                console.log(allCityProducts[0]);



                for (const cityProduct of allCityProducts) {
                    if (cityProduct.shops_ids && cityProduct.shops_ids.length > 0) {
                        for (const shop_id of cityProduct.shops_ids) {
                            const linkAlreadyExists = await this.checkCityShopLinkByBothIds(Number(city.id), Number(shop_id));
                            if (!linkAlreadyExists) {
                                const values = [
                                    Number(city.id),
                                    Number(shop_id),
                                ];
                                const newCityShopLink = await pool?.query(query, values);
                                console.log(newCityShopLink!.rows[0]);
                            }
                        }
                    }
                }
            }

        }
    },

    async checkCityShopLinkByBothIds(cityId: number, shopId: number) {
        const query = `SELECT * FROM city_shop_links WHERE city_id = $1 AND shop_id = $2`;
        const values = [cityId, shopId];
        const links = await pool?.query(query, values);

        return !!links?.rowCount ?? null;
    },

    // end of city-shop-links adding

    async getAllCities(): Promise<City[] | undefined> {
        const query = `SELECT * FROM cities`;
        const cities = await pool?.query(query);

        if (cities) return cities.rows;
        return undefined;
    },
    //
    // async getCityById(cityId: number) {
    //     const query = `SELECT * FROM cities WHERE id = $1`;
    //     const values = [cityId];
    //     const city = await pool?.query(query, values);
    //
    //     if (city) return city.rows[0];
    //     return undefined;
    // },
    //
    // async deleteCity(cityId: number) {
    //     const query = `DELETE FROM cities WHERE id = $1 RETURNING id`;
    //     const values = [cityId];
    //     const deletedCitiesNumber = await pool?.query(query, values);
    //
    //     return !!deletedCitiesNumber?.rowCount;
    // },
    //
    // async createCity(newCityParams: City) {
    //     const query = `INSERT INTO cities
    //                    (name, name_in_english, latitude, longitude, is_capital)
    //                    VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    //     const values = [
    //         newCityParams.name,
    //         newCityParams.nameInEnglish,
    //         newCityParams.latitude,
    //         newCityParams.longitude,
    //         newCityParams.isCapital
    //     ];
    //     const newCity = await pool?.query(query, values);
    //
    //     if (newCity) return newCity.rows[0];
    //     return undefined;
    // },
};