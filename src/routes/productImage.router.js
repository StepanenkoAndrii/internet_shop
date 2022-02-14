"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productImage_controller_1 = __importDefault(require("../controllers/productImage.controller"));
const router = express_1.default.Router();
router.post("/api", productImage_controller_1.default.importApiProductImages);
exports.default = router;
