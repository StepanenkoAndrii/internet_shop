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
const undici_1 = require("undici");
const lodash_1 = __importDefault(require("lodash"));
const app_1 = __importDefault(require("../app"));
function fetchJsonDiscounts() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield (0, undici_1.fetch)('https://gotoshop.ua/apiv3/discounts/?limit=1100');
        return yield res.json();
    });
}
exports.default = {
    getAllApiDiscounts() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const apiDiscountsObj = yield fetchJsonDiscounts();
            return (_a = apiDiscountsObj === null || apiDiscountsObj === void 0 ? void 0 : apiDiscountsObj.discounts) !== null && _a !== void 0 ? _a : undefined;
        });
    },
    importApiDiscounts() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO discounts 
                       (id, name, slug, start_date, end_date, days_title, color, discount_url) 
                       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
            const apiDiscounts = yield this.getAllApiDiscounts();
            for (const apiDiscount of apiDiscounts) {
                const values = Object.values(lodash_1.default.omit(apiDiscount, ['date']));
                yield (app_1.default === null || app_1.default === void 0 ? void 0 : app_1.default.query(query, values));
            }
            return apiDiscounts;
        });
    },
};
