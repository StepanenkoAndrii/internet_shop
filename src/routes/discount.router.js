"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const discount_controller_1 = __importDefault(require("../controllers/discount.controller"));
const router = express_1.default.Router();
router.get("/api", discount_controller_1.default.getAllApiDiscounts);
// router.get("/:id", citiesController.getCityById);
// router.get("/", citiesController.getAllCities);
router.post("/api", discount_controller_1.default.importApiDiscounts);
// router.delete("/:id", citiesController.deleteCity);
// router.post("/", citiesController.createCity);
exports.default = router;
