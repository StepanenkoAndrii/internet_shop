import express from "express";
import brandController from "../controllers/brand.controller";

const router = express.Router();

router.get("/api", brandController.getAllApiBrands);
// router.get("/:id", citiesController.getCityById);
// router.get("/", citiesController.getAllCities);
router.post("/api", brandController.importApiBrands);
// router.delete("/:id", citiesController.deleteCity);
// router.post("/", citiesController.createCity);

export default router;