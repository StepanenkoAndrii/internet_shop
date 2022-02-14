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
function fetchJsonProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield (0, undici_1.fetch)('https://gotoshop.ua/apiv3/products/?limit=2500');
        return yield res.json();
    });
}
exports.default = {
    // async getAllApiProductImages(): Promise<ProductImage[] | undefined> {
    //     const apiProductsObj = await fetchJsonProducts();
    //     const apiProducts = apiProductsObj?.products as Product[] ?? undefined;
    //
    //     for (const apiProduct of apiProducts) {
    //         //to do
    //     }
    //     return;
    // },
    importApiProductImages() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO product_images 
                       (src, w, h, file_size, url) 
                       VALUES ($1, $2, $3, $4, $5) RETURNING *`;
            const apiProductsObj = yield fetchJsonProducts();
            const apiProducts = (_a = apiProductsObj === null || apiProductsObj === void 0 ? void 0 : apiProductsObj.products) !== null && _a !== void 0 ? _a : undefined;
            for (const apiProduct of apiProducts) {
                if (apiProduct.image336) {
                    const values336 = [
                        (_b = apiProduct.image336.src) !== null && _b !== void 0 ? _b : null,
                        apiProduct.image336.w,
                        apiProduct.image336.h,
                        (_c = apiProduct.image336.filesize) !== null && _c !== void 0 ? _c : null,
                        (_d = apiProduct.image336.url) !== null && _d !== void 0 ? _d : null,
                    ];
                    yield (app_1.default === null || app_1.default === void 0 ? void 0 : app_1.default.query(query, values336));
                }
                if (apiProduct.imagefull) {
                    const valuesFull = [
                        (_e = apiProduct.imagefull.src) !== null && _e !== void 0 ? _e : null,
                        apiProduct.imagefull.w,
                        apiProduct.imagefull.h,
                        (_f = apiProduct.imagefull.filesize) !== null && _f !== void 0 ? _f : null,
                        (_g = apiProduct.imagefull.url) !== null && _g !== void 0 ? _g : null,
                    ];
                    yield (app_1.default === null || app_1.default === void 0 ? void 0 : app_1.default.query(query, valuesFull));
                }
                if (apiProduct.addresses_image) {
                    const valuesAddr = [
                        (_h = apiProduct.addresses_image.src) !== null && _h !== void 0 ? _h : null,
                        apiProduct.addresses_image.w,
                        apiProduct.addresses_image.h,
                        (_j = apiProduct.addresses_image.filesize) !== null && _j !== void 0 ? _j : null,
                        (_k = apiProduct.addresses_image.url) !== null && _k !== void 0 ? _k : null,
                    ];
                    yield (app_1.default === null || app_1.default === void 0 ? void 0 : app_1.default.query(query, valuesAddr));
                }
            }
        });
    },
};
