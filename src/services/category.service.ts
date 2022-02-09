import {Request, Response} from "express";
import {fetch, Response as Res} from "undici";
import logger from "../utils/logger";
import pool from "../app";

type Category = {
    id: number,
    name: string,
    nameInEnglish: string,
};

type importedCategory = {
    id: number,
    name: string,
    slug: string,
    discounts: number,
};

type importedCategories = {
    categories: importedCategory[],
};

async function fetchJsonCategories(): Promise<importedCategories | undefined> {
    const res: Res = await fetch('https://gotoshop.ua/apiv3/categories?limit=15');
    return await res.json() as importedCategories;
}

export default {
    async getAllApiCategories(): Promise<importedCategory[] | undefined> {
        const apiCategoriesObj = await fetchJsonCategories();
        return apiCategoriesObj?.categories as importedCategory[] ?? undefined;
    },

    async importApiCategories(): Promise<Category[] | undefined> {
        const query = `INSERT INTO categories (id, name, name_in_english) 
                       VALUES ($1, $2, $3) RETURNING *`;

        let resultCategories: Category[] = [];
        const apiCategories = await this.getAllApiCategories();

        for (const apiCategory of apiCategories!) {
            resultCategories.push(
                {
                    id: apiCategory.id,
                    name: apiCategory.name,
                    nameInEnglish: apiCategory.slug,
                }
            );
        }
        for (const resultCategory of resultCategories) {
            const values = [
                resultCategory.id,
                resultCategory.name,
                resultCategory.nameInEnglish,
            ];
            await pool?.query(query, values);
        }

        return resultCategories;
    },

    async getAllCategories(): Promise<object[] | undefined> {
        const query = `SELECT * FROM categories`;
        const categories = await pool?.query(query);

        if (categories) return categories.rows;
        return undefined;
    },

    async getCategoryById(categoryId: number) {
        const query = `SELECT * FROM categories WHERE id = $1`;
        const values = [categoryId];
        const category = await pool?.query(query, values);

        if (category) return category.rows[0];
        return undefined;
    },

    async deleteCategory(categoryId: number) {
        const query = `DELETE FROM categories WHERE id = $1 RETURNING id`;
        const values = [categoryId];
        const deletedCategoriesNumber = await pool?.query(query, values);

        return !!deletedCategoriesNumber?.rowCount;
    },

    async createCategory(newCategoryParams: Category) {
        const query = `INSERT INTO categories 
                       (name, name_in_english) 
                       VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [
            newCategoryParams.name,
            newCategoryParams.nameInEnglish,
        ];
        const newCategory = await pool?.query(query, values);

        if (newCategory) return newCategory.rows[0];
        return undefined;
    },
};