import {Request, Response} from "express";
import {fetch, Response as Res} from "undici";
import format from "pg-format";
import logger from "../utils/logger";
import pool from "../app";
import _ from "lodash";
import {City, importedCities, Product, importedProducts} from "../interfaces";
import shopService from "./shop.service";
import {limitRate} from "../utils/rateLimiter";

const fetchFunc = limitRate(5000, 500)((url) => {
    console.log(url);
    return fetch(url);
});

async function fetchJsonCities(): Promise<importedCities | undefined> {
    const res: Res = await fetch('https://gotoshop.ua/apiv3/cities/?limit=100');
    return await res.json() as importedCities;
}

async function fetchJsonCityProducts(cityId: number, shopId: number): Promise<importedProducts | undefined> {
    const res: Res = await fetch(`https://gotoshop.ua/apiv3/products/?limit=1&offset=0&city_id=${cityId}&shop_id=${shopId}`);
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
        const urls: string[] = [];
        let counter = 0;

        const cities = await this.getAllCities();
        const shops = await shopService.getAllShops();

        for (const city of cities!) {
            for (const shop of shops!) {
                urls.push(`https://gotoshop.ua/apiv3/products/?limit=1&offset=0&city_id=${Number(city.id)}&shop_id=${Number(shop.id)}`);
            }
        }

        const chunk = 1000;

        for (let i = 0; i < urls.length; i += chunk) {
            const slicedUrls = urls.slice(i, i + chunk);
            const urlsData = await Promise.allSettled(slicedUrls.map(url => fetchFunc(url)));
            const {fulfilled, rejected} = urlsData.reduce(
                (acc: { fulfilled: unknown[], rejected: unknown[] }, element) =>
                    element.status === 'fulfilled'
                        ? (acc.fulfilled.push(element.value), acc)
                        : (acc.rejected.push(element.reason), acc),
                ({fulfilled: [], rejected: []}));

            const productResponses = await Promise.all((fulfilled as Res[]).map(data =>
                data.json()
            )) as importedProducts[];

            const productShopRelations = productResponses.filter(element => element.totalCount > 0).map(
                el => [Number(el.input.get.city_id), Number(el.input.get.shop_id)]
            );

            if (productShopRelations.length) {
                const query = format(`INSERT INTO temp (city_id, shop_id)
                                VALUES %L RETURNING *`, productShopRelations);
                pool?.query(query).then(queryRes => {
                    console.log("succ added");
                    // do smth with query result
                });
            }

        }



        // Promise.allSettled(urls.map(url => fetchFunc(url)))
        //     .then(urlsData => {
        //         const {fulfilled, rejected} = urlsData.reduce(
        //             (acc: {fulfilled: unknown[], rejected: unknown[]}, element) =>
        //             element.status === 'fulfilled'
        //                 ? (acc.fulfilled.push(element.value), acc)
        //                 : (acc.rejected.push(element.reason), acc),
        //             ({fulfilled: [], rejected: []}));
        //
        //         const productResponses = await Promise.all((fulfilled as Res[]).map(data =>
        //             data.json()
        //         ))
        //
        //
        //
        //
        //
        //         urlsData.forEach((urlData) => {
        //             if (urlData.status == "fulfilled") {
        //                 urlData.value.json().then((x: importedProducts) => {
        //
        //                     const citiesValues = [Number(x.input.get.city_id), Number(x.input.get.shop_id)];
        //                     console.log(Number(x.input.get.city_id), Number(x.input.get.shop_id));
        //                     const query = format(`INSERT INTO temp (city_id, shop_id)
        //                         VALUES %L RETURNING *`, citiesValues);
        //                     pool?.query(query).then(queryRes => {
        //                         console.log("succ added");
        //                         // do smth with query result
        //                     });
        //                 });
        //             }
        //             if (urlData.status == "rejected") {
        //                 console.log("oh, shit");
        //             }
        //         });
        //     });

        // const query = format(`INSERT INTO city_shop_links (city_id, shop_id)
        //                VALUES %L RETURNING *`, citiesValues);
        // const allCities = await this.getAllCities() as City[];

        // const citiesArr = allCities.map(city => {
        //
        // });
        //
        // Promise.allSettled(citiesArr).then();

        // for (const city of allCities) {
        //     for (let i = 4; i < 20; i++) {
        //         const apiCityProductsObj = await fetchJsonCityProducts(Number(city.id), i * 1000);
        //         const allCityProducts = apiCityProductsObj?.products as Product[] ?? undefined;
        //
        //         console.log(allCityProducts[0]);
        //
        //
        //
        //         for (const cityProduct of allCityProducts) {
        //             if (cityProduct.shops_ids && cityProduct.shops_ids.length > 0) {
        //                 for (const shop_id of cityProduct.shops_ids) {
        //                     const linkAlreadyExists = await this.checkCityShopLinkByBothIds(Number(city.id), Number(shop_id));
        //                     if (!linkAlreadyExists) {
        //                         const values = [
        //                             Number(city.id),
        //                             Number(shop_id),
        //                         ];
        //                         const newCityShopLink = await pool?.query(query, values);
        //                         console.log(newCityShopLink!.rows[0]);
        //                     }
        //                 }
        //             }
        //         }
        //     }
        //
        // }
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