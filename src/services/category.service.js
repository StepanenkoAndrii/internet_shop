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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const undici_1 = require("undici");
const pg_format_1 = __importDefault(require("pg-format"));
const app_1 = __importDefault(require("../app"));
function fetchJsonCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield (0, undici_1.fetch)('https://gotoshop.ua/apiv3/categories?limit=15');
        return yield res.json();
    });
}
exports.default = {
    getAllApiCategories() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const apiCategoriesObj = yield fetchJsonCategories();
            return (_a = apiCategoriesObj === null || apiCategoriesObj === void 0 ? void 0 : apiCategoriesObj.categories) !== null && _a !== void 0 ? _a : undefined;
        });
    },
    importApiCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const apiCategories = yield this.getAllApiCategories();
            const categoriesValues = apiCategories === null || apiCategories === void 0 ? void 0 : apiCategories.map(category => {
                const { discounts } = category, other = __rest(category, ["discounts"]);
                return Object.values(other);
            });
            const query = (0, pg_format_1.default)(`INSERT INTO categories (id, name, slug) 
                                   VALUES %L RETURNING *`, categoriesValues);
            const categories = yield (app_1.default === null || app_1.default === void 0 ? void 0 : app_1.default.query(query));
            if (categories && categories.rowCount > 0) {
                return categories.rows;
            }
            return undefined;
        });
    },
    // async importApiCategories(): Promise<Category[] | undefined> {
    //     const query = `INSERT INTO categories (id, name, slug)
    //                    VALUES ($1, $2, $3) RETURNING *`;
    //
    //     const apiCategories = await this.getAllApiCategories();
    //
    //     for (const apiCategory of apiCategories!) {
    //         const values = Object.values(_.omit(apiCategory, ['discounts']));
    //         await pool?.query(query, values);
    //     }
    //
    //     return apiCategories;
    // },
    // async getAllCategories(): Promise<object[] | undefined> {
    //     const query = `SELECT * FROM categories`;
    //     const categories = await pool?.query(query);
    //
    //     if (categories) return categories.rows;
    //     return undefined;
    // },
    //
    // async getCategoryById(categoryId: number) {
    //     const query = `SELECT * FROM categories WHERE id = $1`;
    //     const values = [categoryId];
    //     const category = await pool?.query(query, values);
    //
    //     if (category) return category.rows[0];
    //     return undefined;
    // },
    //
    // async deleteCategory(categoryId: number) {
    //     const query = `DELETE FROM categories WHERE id = $1 RETURNING id`;
    //     const values = [categoryId];
    //     const deletedCategoriesNumber = await pool?.query(query, values);
    //
    //     return !!deletedCategoriesNumber?.rowCount;
    // },
    //
    // async createCategory(newCategoryParams: Category) {
    //     const query = `INSERT INTO categories
    //                    (name, name_in_english)
    //                    VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    //     const values = [
    //         newCategoryParams.name,
    //         newCategoryParams.nameInEnglish,
    //     ];
    //     const newCategory = await pool?.query(query, values);
    //
    //     if (newCategory) return newCategory.rows[0];
    //     return undefined;
    // },
};
