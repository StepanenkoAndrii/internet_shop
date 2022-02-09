import {Request, Response} from "express";
import categoryService from "../services/category.service";
import logger from "../utils/logger";

export default {
    async getAllApiCategories(req: Request, res: Response) {
        const allApiCategories = await categoryService.getAllApiCategories();
        logger.info(allApiCategories);
        res.send(allApiCategories);
    },

    async importApiCategories(req: Request, res: Response) {
        const importedApiCategories = await categoryService.importApiCategories();
        logger.info(importedApiCategories);
        res.send(importedApiCategories);
    },

    async getAllCategories(req: Request, res: Response) {
        const categories = await categoryService.getAllCategories();
        logger.info(categories);
        res.send(categories);
    },

    async getCategoryById(req: Request, res: Response) {
        const category = await categoryService.getCategoryById(Number(req.params.id));
        logger.info(category);
        res.send(category);
    },

    async deleteCategory(req: Request, res: Response) {
        const categoryIsDeleted = await categoryService.deleteCategory(Number(req.params.id));
        if (categoryIsDeleted) {
            logger.info(categoryIsDeleted);
            res.send(`category with id = ${req.params.id} is successfully deleted`);
        }
        res.send(`category with id = ${req.params.id} doesn't exist`);
    },

    async createCategory(req: Request, res: Response) {
        const newCategory = await categoryService.createCategory(req.body);
        logger.info(newCategory);
        res.send(newCategory);
    },
};