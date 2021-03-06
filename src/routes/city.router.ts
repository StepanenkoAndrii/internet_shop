import express from "express";
import cityController from "../controllers/city.controller";

const router = express.Router();

router.get("/api", cityController.getAllApiCities);
router.post("/fill", cityController.addLinks);
// router.get("/:id", citiesController.getCityById);
// router.get("/", citiesController.getAllCities);
router.post("/api", cityController.importApiCities);
// router.delete("/:id", citiesController.deleteCity);
// router.post("/", citiesController.createCity);

export default router;