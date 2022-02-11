import {Request, Response} from "express";
import {fetch, Response as Res} from "undici";
import _ from "lodash";
import logger from "../utils/logger";
import pool from "../app";
import {ProductImage, importedProductImages, Product, importedProducts} from "../interfaces";

async function fetchJsonProducts(): Promise<importedProducts | undefined> {
    const res: Res = await fetch('https://gotoshop.ua/apiv3/products/?limit=2500');
    return await res.json() as importedProducts;
}

export default {
    // async getAllApiProductImages(): Promise<ProductImage[] | undefined> {
    //     const apiProductsObj = await fetchJsonProducts();
    //     const apiProducts = apiProductsObj?.products as Product[] ?? undefined;
    //
    //     for (const apiProduct of apiProducts) {
    //         //to do
    //     }
    //     return;
    // },
    async importApiProductImages() {
        const query = `INSERT INTO product_images 
                       (src, w, h, file_size, url) 
                       VALUES ($1, $2, $3, $4, $5) RETURNING *`;

        const apiProductsObj = await fetchJsonProducts();
        const apiProducts = apiProductsObj?.products as Product[] ?? undefined;

        for (const apiProduct of apiProducts) {
            if (apiProduct.image336) {
                const values336 = [
                    apiProduct.image336.src ?? null,
                    apiProduct.image336.w,
                    apiProduct.image336.h,
                    apiProduct.image336.filesize ?? null,
                    apiProduct.image336.url ?? null,
                ];
                await pool?.query(query, values336);
            }
            if (apiProduct.imagefull) {
                const valuesFull = [
                    apiProduct.imagefull.src ?? null,
                    apiProduct.imagefull.w,
                    apiProduct.imagefull.h,
                    apiProduct.imagefull.filesize ?? null,
                    apiProduct.imagefull.url ?? null,
                ];
                await pool?.query(query, valuesFull);
            }
            if (apiProduct.addresses_image) {
                const valuesAddr = [
                    apiProduct.addresses_image.src ?? null,
                    apiProduct.addresses_image.w,
                    apiProduct.addresses_image.h,
                    apiProduct.addresses_image.filesize ?? null,
                    apiProduct.addresses_image.url ?? null,
                ];
                await pool?.query(query, valuesAddr);
            }
        }
    },
};