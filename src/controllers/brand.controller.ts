import {Request, Response} from "express";
import brandService from "../services/brand.service";
import logger from "../utils/logger";

export default {
    async getAllApiBrands(req: Request, res: Response) {
        const allApiBrands = await brandService.getAllApiBrands();
        logger.info(allApiBrands);
        res.send(allApiBrands);
    },

    async importApiBrands(req: Request, res: Response) {
        const importedApiBrands = await brandService.importApiBrands();
        logger.info(importedApiBrands);
        res.send(importedApiBrands);
    },
};