import {Request, Response} from "express";
import logger from "../utils/logger";
import pool from "../app";

type Product = {
    name: string,
    code: string,
    price: number,
    quantity: number,
};

export default {
    async getAllProducts(): Promise<object[] | undefined> {
        const query = `SELECT * FROM products`;
        const products = await pool?.query(query);

        if (products) return products.rows;
        return undefined;
    },

    async getProductById(productId: number) {
        const query = `SELECT * FROM products WHERE id = $1`;
        const values = [productId];
        const product = await pool?.query(query, values);

        if (product) return product.rows[0];
        return undefined;
    },

    async deleteProduct(productId: number) {
        const query = `DELETE FROM products WHERE id = $1 RETURNING id`;
        const values = [productId];
        const deletedProductsNumber = await pool?.query(query, values);

        return !!deletedProductsNumber?.rowCount;
    },

    async updateProduct(productId: number, productNewParams: Product) {
        const query = `UPDATE products SET name = $2, code = $3, price = $4, quantity = $5 WHERE id = $1`;
        const values = [
            productId,
            productNewParams.name,
            productNewParams.code,
            productNewParams.price,
            productNewParams.quantity,
        ];
        const updatedProduct = await pool?.query(query, values);

        if (updatedProduct) return updatedProduct.rows[0];
        return undefined;
    },

    async createProduct(productNewParams: Product) {
        const query = `INSERT INTO products (name, code, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [
            productNewParams.name,
            productNewParams.code,
            productNewParams.price,
            productNewParams.quantity,
        ];
        const newProduct = await pool?.query(query, values);

        if (newProduct) return newProduct.rows[0];
        return undefined;
    },
};