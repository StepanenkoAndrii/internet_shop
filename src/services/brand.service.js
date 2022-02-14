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
const app_1 = __importDefault(require("../app"));
function fetchJsonBrands() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield (0, undici_1.fetch)('https://gotoshop.ua/apiv3/brands/?limit=18000');
        return yield res.json();
    });
}
exports.default = {
    getAllApiBrands() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const apiBrandsObj = yield fetchJsonBrands();
            return (_a = apiBrandsObj === null || apiBrandsObj === void 0 ? void 0 : apiBrandsObj.brands) !== null && _a !== void 0 ? _a : undefined;
        });
    },
    importApiBrands() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO brands 
                       (id, name_ru, name_orig, name, image, url) 
                       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
            const apiBrands = yield this.getAllApiBrands();
            for (const apiBrand of apiBrands) {
                const values = Object.values(apiBrand);
                yield (app_1.default === null || app_1.default === void 0 ? void 0 : app_1.default.query(query, values));
            }
            return apiBrands;
        });
    },
};
