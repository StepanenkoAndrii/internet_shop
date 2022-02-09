import {Request, Response} from "express";
import discountService from "../services/discount.service";
import logger from "../utils/logger";

export default {
    async getAllApiDiscounts(req: Request, res: Response) {
        const allApiDiscounts = await discountService.getAllApiDiscounts();
        logger.info(allApiDiscounts);
        res.send(allApiDiscounts);
    },

    async importApiDiscounts(req: Request, res: Response) {
        const importedApiDiscounts = await discountService.importApiDiscounts();
        logger.info(importedApiDiscounts);
        res.send(importedApiDiscounts);
    },
};