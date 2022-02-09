import express from "express";
import categoriesController from "../controllers/category.controller";

const router = express.Router();

router.get("/api", categoriesController.getAllApiCategories);
// router.get("/:id", categoriesController.getCategoryById);
// router.get("/", categoriesController.getAllCategories);
router.post("/api", categoriesController.importApiCategories);
// router.delete("/:id", categoriesController.deleteCategory);
// router.post("/", categoriesController.createCategory);

export default router;