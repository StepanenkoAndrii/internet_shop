"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shop_controller_1 = __importDefault(require("../controllers/shop.controller"));
const router = express_1.default.Router();
router.get("/api", shop_controller_1.default.getAllApiShops);
// router.get("/:id", shopsController.getShopById);
router.get("/", shop_controller_1.default.getAllShops);
router.post("/api", shop_controller_1.default.importApiShops);
// router.delete("/:id", shopsController.deleteShop);
// router.post("/", shopsController.createShop);
exports.default = router;
