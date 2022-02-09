import {Request, Response} from "express";
import {fetch, Response as Res} from "undici";
import _ from "lodash";
import logger from "../utils/logger";
import pool from "../app";

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
    image_336?: ProductImage,
    image_full?: ProductImage,
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
    addresses_image?: ProductImage,
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

interface ProductImage {
    src?: string,
    w: number,
    h: number,
    filesize?: number,
}

interface importedProductImages {
    productImages: ProductImage[],
}

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
                       (src, w, h, file_size) 
                       VALUES ($1, $2, $3, $4) RETURNING *`;

        const apiProductsObj = await fetchJsonProducts();
        const apiProducts = apiProductsObj?.products as Product[] ?? undefined;

        for (const apiProduct of apiProducts) {
            if (apiProduct.image_336) {
                // const values336 = Object.values(apiProduct.image_336! ?? null);
                const values336 = [
                    apiProduct.image_336.src,
                    apiProduct.image_336.w,
                    apiProduct.image_336.h,
                    apiProduct.image_336.filesize ?? null
                ];
                await pool?.query(query, values336);
            }
            if (apiProduct.image_full) {
                // const valuesFull = Object.values(apiProduct.image_full! ?? null);
                const valuesFull = [
                    apiProduct.image_full.src,
                    apiProduct.image_full.w,
                    apiProduct.image_full.h,
                    apiProduct.image_full.filesize ?? null
                ];
                await pool?.query(query, valuesFull);
            }
            if (apiProduct.addresses_image) {
                // const valuesAddr = Object.values(apiProduct.addresses_image! ?? null);
                const valuesAddr = [
                    apiProduct.addresses_image.src,
                    apiProduct.addresses_image.w,
                    apiProduct.addresses_image.h,
                    apiProduct.addresses_image.filesize ?? null
                ];
                await pool?.query(query, valuesAddr);
            }
        }
    },
};