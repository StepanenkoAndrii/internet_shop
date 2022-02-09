import {Request, Response} from "express";
import shopService from "../services/shop.service";
import logger from "../utils/logger";

export default {
    async getAllApiShops(req: Request, res: Response) {
        const allApiShops = await shopService.getAllApiShops();
        logger.info(allApiShops);
        res.send(allApiShops);
    },

    async importApiShops(req: Request, res: Response) {
        const importedApiShops = await shopService.importApiShops();
        logger.info(importedApiShops);
        res.send(importedApiShops);
    },

    // async getAllShops(req: Request, res: Response) {
    //     const shops = await shopService.getAllShops();
    //     logger.info(shops);
    //     res.send(shops);
    // },
    //
    // async getShopById(req: Request, res: Response) {
    //     const shop = await shopService.getShopById(Number(req.params.id));
    //     logger.info(shop);
    //     res.send(shop);
    // },
    //
    // async deleteShop(req: Request, res: Response) {
    //     const shopIsDeleted = await shopService.deleteShop(Number(req.params.id));
    //     if (shopIsDeleted) {
    //         logger.info(shopIsDeleted);
    //         res.send(`shop with id = ${req.params.id} is successfully deleted`);
    //     }
    //     res.send(`shop with id = ${req.params.id} doesn't exist`);
    // },
    //
    // async createShop(req: Request, res: Response) {
    //     const newShop = await shopService.createShop(req.body);
    //     logger.info(newShop);
    //     res.send(newShop);
    // },
};