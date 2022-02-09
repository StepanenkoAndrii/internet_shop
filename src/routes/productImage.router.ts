import express from "express";
import productImageController from "../controllers/productImage.controller";

const router = express.Router();

router.post("/api", productImageController.importApiProductImages);

export default router;