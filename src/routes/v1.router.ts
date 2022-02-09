import express from "express";
// import productRouter from "./product.router";
import cityRouter from "./city.router";
import categoryRouter from "./category.router";
import shopRouter from "./shop.router";
import discountRouter from "./discount.router";
import productImageRouter from "./productImage.router";
import brandsRouter from "./brand.router";

const router = express.Router();

// router.use("/products", productRouter);
router.use("/cities", cityRouter);
router.use("/discounts", discountRouter);
router.use("/categories", categoryRouter);
router.use("/shops", shopRouter);
router.use("/images", productImageRouter);
router.use("/brands", brandsRouter);

export default router;