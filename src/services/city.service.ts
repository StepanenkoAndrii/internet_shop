import {Request, Response} from "express";
import {fetch, Response as Res} from "undici";
import logger from "../utils/logger";
import pool from "../app";
import _ from "lodash";

interface City {
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

interface importedCities {
    cities: City[],
}

interface Product {
    id: number,
    slug: string,
    discount_id: number,
    external_url: string,
    price_before: number,
    price_after?: number,
    discount?: number,
    discount_type?: string,
    image_contains_price: number,
    start_date?: string,
    end_date?: string,
    catalogs_id?: number,
    quantity?: number,
    quantity_unit: string,
    name2: string,
    name: string,
    image_336?: object,
    image_full?: object,
    count_plus: number,
    count_minus: number,
    shops_ids?: [],
    shops?: [],
    comments: number,
    days_title?: string,
    date?: string,
    discount_name?: string,
    color?: number,
    units: string,
    noted: number,
    not_all_addr: number,
    addresses_image?: object,
    url: string,
    phone: string,
    liked: number,
    desc: string,
    discount_url?: string,
    num: number,
    logged_in_user_id?: number,
    ask_list_before_add: number,
    total_count: boolean,
    brands?: [],
    pcategories?: [],
    quantity_unit_val?: string,
}

interface importedProducts {
    products: Product[],
}

async function fetchJsonCities(): Promise<importedCities | undefined> {
    const res: Res = await fetch('https://gotoshop.ua/apiv3/cities/?limit=100');
    return await res.json() as importedCities;
}

async function fetchJsonCityProducts(cityId: number): Promise<importedProducts | undefined> {
    const res: Res = await fetch(`https://gotoshop.ua/apiv3/products/?limit=2500&city_id=${cityId}`);
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
        const query = `INSERT INTO city_shop_links (city_id, shop_id)
                       VALUES ($1, $2) RETURNING *`;
        const allCities = await this.getAllCities() as City[];

        for (const city of allCities) {
            const apiCityProductsObj = await fetchJsonCityProducts(Number(city.id));
            const allCityProducts = apiCityProductsObj?.products as Product[] ?? undefined;

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
    },

    async checkCityShopLinkByBothIds(cityId: number, shopId: number) {
        const query = `SELECT * FROM city_shop_links WHERE city_id = $1 AND shop_id = $2`;
        const values = [cityId, shopId];
        const links = await pool?.query(query, values);

        return !!links;
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