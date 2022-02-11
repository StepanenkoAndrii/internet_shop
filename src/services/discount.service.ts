import {Request, Response} from "express";
import {fetch, Response as Res} from "undici";
import _ from "lodash";
import logger from "../utils/logger";
import pool from "../app";
import {Discount, importedDiscounts} from "../interfaces";

async function fetchJsonDiscounts(): Promise<importedDiscounts | undefined> {
    const res: Res = await fetch('https://gotoshop.ua/apiv3/discounts/?limit=1100');
    return await res.json() as importedDiscounts;
}

export default {
    async getAllApiDiscounts(): Promise<Discount[] | undefined> {
        const apiDiscountsObj = await fetchJsonDiscounts();
        return apiDiscountsObj?.discounts as Discount[] ?? undefined;
    },

    async importApiDiscounts(): Promise<Discount[] | undefined> {
        const query = `INSERT INTO discounts 
                       (id, name, slug, start_date, end_date, days_title, color, discount_url) 
                       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

        const apiDiscounts = await this.getAllApiDiscounts() as Discount[];

        for (const apiDiscount of apiDiscounts) {
            const values = Object.values(_.omit(apiDiscount, ['date']));
            await pool?.query(query, values);
        }

        return apiDiscounts;
    },
};