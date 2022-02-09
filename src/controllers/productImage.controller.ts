import {Request, Response} from "express";
import productImageService from "../services/productImage.service";
import logger from "../utils/logger";

export default {
    async importApiProductImages(req: Request, res: Response) {
        await productImageService.importApiProductImages();
    },
};