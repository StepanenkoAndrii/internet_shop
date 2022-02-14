"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = __importDefault(require("../controllers/category.controller"));
const router = express_1.default.Router();
router.get("/api", category_controller_1.default.getAllApiCategories);
// router.get("/:id", categoriesController.getCategoryById);
// router.get("/", categoriesController.getAllCategories);
router.post("/api", category_controller_1.default.importApiCategories);
// router.delete("/:id", categoriesController.deleteCategory);
// router.post("/", categoriesController.createCategory);
exports.default = router;
