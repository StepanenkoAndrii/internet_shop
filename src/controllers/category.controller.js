"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_service_1 = __importDefault(require("../services/category.service"));
const logger_1 = __importDefault(require("../utils/logger"));
exports.default = {
    getAllApiCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const allApiCategories = yield category_service_1.default.getAllApiCategories();
            logger_1.default.info(allApiCategories);
            res.send(allApiCategories);
        });
    },
    importApiCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const importedApiCategories = yield category_service_1.default.importApiCategories();
            logger_1.default.info(importedApiCategories);
            res.send(importedApiCategories);
        });
    },
    // async getAllCategories(req: Request, res: Response) {
    //     const categories = await categoryService.getAllCategories();
    //     logger.info(categories);
    //     res.send(categories);
    // },
    //
    // async getCategoryById(req: Request, res: Response) {
    //     const category = await categoryService.getCategoryById(Number(req.params.id));
    //     logger.info(category);
    //     res.send(category);
    // },
    //
    // async deleteCategory(req: Request, res: Response) {
    //     const categoryIsDeleted = await categoryService.deleteCategory(Number(req.params.id));
    //     if (categoryIsDeleted) {
    //         logger.info(categoryIsDeleted);
    //         res.send(`category with id = ${req.params.id} is successfully deleted`);
    //     }
    //     res.send(`category with id = ${req.params.id} doesn't exist`);
    // },
    //
    // async createCategory(req: Request, res: Response) {
    //     const newCategory = await categoryService.createCategory(req.body);
    //     logger.info(newCategory);
    //     res.send(newCategory);
    // },
};
