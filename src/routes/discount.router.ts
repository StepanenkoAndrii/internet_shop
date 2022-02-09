import express from "express";
import discountController from "../controllers/discount.controller";

const router = express.Router();

router.get("/api", discountController.getAllApiDiscounts);
// router.get("/:id", citiesController.getCityById);
// router.get("/", citiesController.getAllCities);
router.post("/api", discountController.importApiDiscounts);
// router.delete("/:id", citiesController.deleteCity);
// router.post("/", citiesController.createCity);

export default router;