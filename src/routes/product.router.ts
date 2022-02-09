import express from "express";
import productsController from "../controllers/product.controller";

const router = express.Router();

router.get("/:id", productsController.getProductById);
router.get("/", productsController.getAllProducts);
router.delete("/:id", productsController.deleteProduct);
router.patch("/:id", productsController.updateProduct);
router.post("/", productsController.createProduct);

export default router;