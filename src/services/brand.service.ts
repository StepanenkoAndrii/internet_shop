import {Request, Response} from "express";
import {fetch, Response as Res} from "undici";
import _ from "lodash";
import logger from "../utils/logger";
import pool from "../app";

interface Brand {
    id: number,
    name_ru: string,
    name_orig: string,
    name: string,
    image: string,
    url: string,
}

interface importedBrands {
    brands: Brand[],
}

async function fetchJsonBrands(): Promise<importedBrands | undefined> {
    const res: Res = await fetch('https://gotoshop.ua/apiv3/brands/?limit=18000');
    return await res.json() as importedBrands;
}

export default {
    async getAllApiBrands(): Promise<Brand[] | undefined> {
        const apiBrandsObj = await fetchJsonBrands();
        return apiBrandsObj?.brands as Brand[] ?? undefined;
    },

    async importApiBrands(): Promise<Brand[] | undefined> {
        const query = `INSERT INTO brands 
                       (id, name_ru, name_orig, name, image, url) 
                       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

        const apiBrands = await this.getAllApiBrands() as Brand[];

        for (const apiBrand of apiBrands) {
            const values = Object.values(apiBrand);
            await pool?.query(query, values);
        }

        return apiBrands;
    },
};