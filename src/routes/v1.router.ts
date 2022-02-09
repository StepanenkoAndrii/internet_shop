import express from "express";
import customersRouter from "./customer.router";
import productsRouter from "./product.router";
import citiesRouter from "./city.router";
import categoriesRouter from "./category.router";
import shopsRouter from "./shop.router";

const router = express.Router();

router.use("/customers", customersRouter);
router.use("/products", productsRouter);
// router.use("/orders", ordersRouter);
router.use("/cities", citiesRouter);
router.use("/categories", categoriesRouter);
router.use("/shops", shopsRouter);

export default router;