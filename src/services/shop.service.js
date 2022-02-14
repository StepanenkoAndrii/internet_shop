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
function fetchJsonShops() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield (0, undici_1.fetch)('https://gotoshop.ua/apiv3/shops?limit=1500');
        return yield res.json();
    });
}
// bulk insert
exports.default = {
    getAllApiShops() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const apiShopsObj = yield fetchJsonShops();
            return (_a = apiShopsObj === null || apiShopsObj === void 0 ? void 0 : apiShopsObj.shops) !== null && _a !== void 0 ? _a : undefined;
        });
    },
    importApiShops() {
        return __awaiter(this, void 0, void 0, function* () {
            const apiShops = yield this.getAllApiShops();
            const shopsValues = apiShops === null || apiShops === void 0 ? void 0 : apiShops.map(shop => {
                const { categories_id, discounts } = shop, other = __rest(shop, ["categories_id", "discounts"]);
                return Object.values(other);
            });
            const query = (0, pg_format_1.default)(`INSERT INTO shops 
                       (id, name, slug, website, image, image_100, image_50, image_25, image_map, url) 
                       VALUES %L RETURNING *`, shopsValues);
            const shops = yield (app_1.default === null || app_1.default === void 0 ? void 0 : app_1.default.query(query));
            if (shops && shops.rowCount > 0) {
                return shops.rows;
            }
            return undefined;
        });
    },
    getAllShops() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM shops`;
            const shops = yield (app_1.default === null || app_1.default === void 0 ? void 0 : app_1.default.query(query));
            if (shops)
                return shops.rows;
            return undefined;
        });
    },
    //
    // async getShopById(shopId: number) {
    //     const query = `SELECT * FROM shops WHERE id = $1`;
    //     const values = [shopId];
    //     const shop = await pool?.query(query, values);
    //
    //     if (shop) return shop.rows[0];
    //     return undefined;
    // },
    //
    // async deleteShop(shopId: number) {
    //     const query = `DELETE FROM shops WHERE id = $1 RETURNING id`;
    //     const values = [shopId];
    //     const deletedShopsNumber = await pool?.query(query, values);
    //
    //     return !!deletedShopsNumber?.rowCount;
    // },
    //
    // async createShop(newShopParams: Shop) {
    //     const query = `INSERT INTO shops
    //                    (name, name_in_english)
    //                    VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    //     const values = [
    //         newShopParams.name,
    //         // newShopParams.nameInEnglish,
    //     ];
    //     const newShop = await pool?.query(query, values);
    //
    //     if (newShop) return newShop.rows[0];
    //     return undefined;
    // },
};
