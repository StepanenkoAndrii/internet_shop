import express from "express";
import citiesController from "../controllers/city.controller";

const router = express.Router();

router.get("/api", citiesController.getAllApiCities);
router.get("/:id", citiesController.getCityById);
router.get("/", citiesController.getAllCities);
router.post("/api", citiesController.importApiCities);
router.delete("/:id", citiesController.deleteCity);
router.post("/", citiesController.createCity);

export default router;