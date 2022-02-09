import {Request, Response} from "express";
import {fetch, Response as Res} from "undici";
import _ from "lodash";
import logger from "../utils/logger";
import pool from "../app";

interface Shop {
    id: number,
    name: string,
    slug: string,
    website: string,
    image: string,
    image_100: string,
    image_50: string,
    image_25: string,
    image_map: string,
    url: string,
    categories_id?: number,
    discounts?: number,
}

interface importedShops {
    shops: Shop[],
}

async function fetchJsonShops(): Promise<importedShops | undefined> {
    const res: Res = await fetch('https://gotoshop.ua/apiv3/shops?limit=1500');
    return await res.json() as importedShops;
}

export default {
    async getAllApiShops(): Promise<Shop[] | undefined> {
        const apiShopsObj = await fetchJsonShops();
        return apiShopsObj?.shops as Shop[] ?? undefined;
    },

    async importApiShops(): Promise<Shop[] | undefined> {
        const query = `INSERT INTO shops 
                       (id, name, slug, website, image, image_100, image_50, image_25, image_map, url) 
                       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;

        const apiShops = await this.getAllApiShops();

        for (const apiShop of apiShops!) {
            const values = Object.values(_.omit(apiShop, ['categories_id', 'discounts']));
            await pool?.query(query, values);
        }

        return apiShops;
    },

    // async getAllShops(): Promise<object[] | undefined> {
    //     const query = `SELECT * FROM shops`;
    //     const shops = await pool?.query(query);
    //
    //     if (shops) return shops.rows;
    //     return undefined;
    // },
    //
    // async getShopById(shopId: number) {
    //     const query = `SELECT * FROM shops WHERE id = $1`;
    //     const values = [shopId];
    //     const shop = await pool?.query(query, values);
    //
    //     if (shop) return shop.rows[0];
    //     return undefined;
    // },
    //
    // async deleteShop(shopId: number) {
    //     const query = `DELETE FROM shops WHERE id = $1 RETURNING id`;
    //     const values = [shopId];
    //     const deletedShopsNumber = await pool?.query(query, values);
    //
    //     return !!deletedShopsNumber?.rowCount;
    // },
    //
    // async createShop(newShopParams: Shop) {
    //     const query = `INSERT INTO shops
    //                    (name, name_in_english)
    //                    VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    //     const values = [
    //         newShopParams.name,
    //         // newShopParams.nameInEnglish,
    //     ];
    //     const newShop = await pool?.query(query, values);
    //
    //     if (newShop) return newShop.rows[0];
    //     return undefined;
    // },
};