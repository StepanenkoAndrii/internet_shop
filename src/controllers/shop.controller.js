"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shop_service_1 = __importDefault(require("../services/shop.service"));
const logger_1 = __importDefault(require("../utils/logger"));
exports.default = {
    getAllApiShops(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const allApiShops = yield shop_service_1.default.getAllApiShops();
            logger_1.default.info(allApiShops);
            res.send(allApiShops);
        });
    },
    importApiShops(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const importedApiShops = yield shop_service_1.default.importApiShops();
            logger_1.default.info(importedApiShops);
            res.send(importedApiShops);
        });
    },
    getAllShops(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const shops = yield shop_service_1.default.getAllShops();
            logger_1.default.info(shops);
            res.send(shops);
        });
    },
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
