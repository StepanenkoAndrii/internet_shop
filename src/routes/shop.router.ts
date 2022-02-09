import express from "express";
import shopsController from "../controllers/shop.controller";

const router = express.Router();

router.get("/api", shopsController.getAllApiShops);
router.get("/:id", shopsController.getShopById);
router.get("/", shopsController.getAllShops);
router.post("/api", shopsController.importApiShops);
router.delete("/:id", shopsController.deleteShop);
router.post("/", shopsController.createShop);

export default router;