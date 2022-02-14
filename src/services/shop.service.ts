import {Request, Response} from "express";
import {fetch, Response as Res} from "undici";
import format from "pg-format";
import _ from "lodash";
import logger from "../utils/logger";
import pool from "../app";
import {Shop, importedShops} from "../interfaces";

async function fetchJsonShops(): Promise<importedShops | undefined> {
    const res: Res = await fetch('https://gotoshop.ua/apiv3/shops?limit=1500');
    return await res.json() as importedShops;
}

// bulk insert

export default {
    async getAllApiShops(): Promise<Shop[] | undefined> {
        const apiShopsObj = await fetchJsonShops();
        return apiShopsObj?.shops as Shop[] ?? undefined;
    },

    async importApiShops(): Promise<Shop[] | undefined> {
        const apiShops = await this.getAllApiShops();
        const shopValues = apiShops?.map(shop => {
            const {categories_id, discounts, ...other} = shop;
            return Object.values(other);
        })
        const query = format(`INSERT INTO shops 
                       (id, name, slug, website, image, image_100, image_50, image_25, image_map, url) 
                       VALUES %L RETURNING *`, shopValues);

        const shops = await pool?.query(query);

        if (shops && shops.rowCount > 0) {
            return shops.rows;
        }
        return undefined;
    },

    async getAllShops(): Promise<Shop[] | undefined> {
        const query = `SELECT * FROM shops`;
        const shops = await pool?.query(query);

        if (shops) return shops.rows;
        return undefined;
    },

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