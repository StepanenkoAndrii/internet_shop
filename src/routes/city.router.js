"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const city_controller_1 = __importDefault(require("../controllers/city.controller"));
const router = express_1.default.Router();
router.get("/api", city_controller_1.default.getAllApiCities);
router.post("/fill", city_controller_1.default.addLinks);
// router.get("/:id", citiesController.getCityById);
// router.get("/", citiesController.getAllCities);
router.post("/api", city_controller_1.default.importApiCities);
// router.delete("/:id", citiesController.deleteCity);
// router.post("/", citiesController.createCity);
exports.default = router;
