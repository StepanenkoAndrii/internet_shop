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
// import fetch from "node-fetch";
const pg_format_1 = __importDefault(require("pg-format"));
const logger_1 = __importDefault(require("../utils/logger"));
const app_1 = __importDefault(require("../app"));
const shop_service_1 = __importDefault(require("./shop.service"));
// const limitedFetch = limitRate(30000, 5)(fetch);
function fetchJsonCities() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield (0, undici_1.fetch)('https://gotoshop.ua/apiv3/cities/?limit=100');
        return yield res.json();
    });
}
function fetchJsonCityShopProducts(cityId, shopId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield (0, undici_1.fetch)(`https://gotoshop.ua/apiv3/products/?limit=1&offset=0&city_id=${cityId}&shop_id=${shopId}`);
        return yield res.json();
    });
}
exports.default = {
    getAllApiCities() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const apiCitiesObj = yield fetchJsonCities();
            return (_a = apiCitiesObj === null || apiCitiesObj === void 0 ? void 0 : apiCitiesObj.cities) !== null && _a !== void 0 ? _a : undefined;
        });
    },
    importApiCities() {
        return __awaiter(this, void 0, void 0, function* () {
            const apiCities = yield this.getAllApiCities();
            const citiesValues = apiCities === null || apiCities === void 0 ? void 0 : apiCities.map(city => Object.values(city));
            const query = (0, pg_format_1.default)(`INSERT INTO cities
                       (id, name, name2, name3, slug, state, region, lat, lng, diff, capital)
                       VALUES %L RETURNING *`, citiesValues);
            const cities = yield (app_1.default === null || app_1.default === void 0 ? void 0 : app_1.default.query(query));
            if (cities && cities.rowCount > 0) {
                return cities.rows;
            }
            return undefined;
        });
    },
    // to fill city-shop-links table
    addLinks() {
        return __awaiter(this, void 0, void 0, function* () {
            let urls = [];
            const allCities = yield this.getAllCities();
            const allShops = yield shop_service_1.default.getAllShops();
            for (const city of allCities) {
                for (const shop of allShops) {
                    urls.push(`https://gotoshop.ua/apiv3/products/?limit=1&offset=0&city_id=${city.id}&shop_id=${shop.id}`);
                }
            }
            // Promise.allSettled(urls.map(url => limitedFetch(url))).then(
            Promise.allSettled(urls.map(url => (0, undici_1.fetch)(url))).then(results => {
                results.forEach(result => {
                    if (result.status == 'fulfilled') {
                        console.log(result.value);
                        result.value.json().then((value) => {
                            const foundProducts = value;
                            if (Number(foundProducts.totalCount) > 0) {
                                const query = (0, pg_format_1.default)(`INSERT INTO temp (city_id, shop_id) 
                                    VALUES %L RETURNING *`, Number(foundProducts.input.get.city_id), Number(foundProducts.input.get.shop_id));
                                // const query = format(`INSERT INTO city_shop_links (city_id, shop_id)
                                //     VALUES %L RETURNING *`,
                                //     Number(foundProducts.input.get.city_id),
                                //     Number(foundProducts.input.get.shop_id)
                                // );
                                app_1.default === null || app_1.default === void 0 ? void 0 : app_1.default.query(query).then(queryRes => {
                                    return queryRes.rows;
                                }).catch(error => {
                                    logger_1.default.error(error.message);
                                });
                            }
                        });
                    }
                    else {
                        logger_1.default.error(result.reason);
                    }
                });
            });
            // const sleep = (t: number | undefined) => new Promise((resolve) => setTimeout(resolve, t));
            // sleep(1000).then()
            // const query = format(`INSERT INTO city_shop_links (city_id, shop_id)
            //                VALUES %L RETURNING *`, cityShopValues);
            // const allCities = await this.getAllCities() as City[];
            // const citiesArr = allCities.map(city => {
            //
            // });
            //
            // Promise.allSettled(citiesArr).then();
            // for (const city of allCities) {
            //     for (let i = 4; i < 20; i++) {
            //         const apiCityProductsObj = await fetchJsonCityProducts(Number(city.id), i * 1000);
            //         const allCityProducts = apiCityProductsObj?.products as Product[] ?? undefined;
            //
            //         console.log(allCityProducts[0]);
            //
            //
            //
            //         for (const cityProduct of allCityProducts) {
            //             if (cityProduct.shops_ids && cityProduct.shops_ids.length > 0) {
            //                 for (const shop_id of cityProduct.shops_ids) {
            //                     const linkAlreadyExists = await this.checkCityShopLinkByBothIds(Number(city.id), Number(shop_id));
            //                     if (!linkAlreadyExists) {
            //                         const values = [
            //                             Number(city.id),
            //                             Number(shop_id),
            //                         ];
            //                         const newCityShopLink = await pool?.query(query, values);
            //                         console.log(newCityShopLink!.rows[0]);
            //                     }
            //                 }
            //             }
            //         }
            //     }
            //
            // }
        });
    },
    checkCityShopLinkByBothIds(cityId, shopId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM city_shop_links WHERE city_id = $1 AND shop_id = $2`;
            const values = [cityId, shopId];
            const links = yield (app_1.default === null || app_1.default === void 0 ? void 0 : app_1.default.query(query, values));
            return (_a = !!(links === null || links === void 0 ? void 0 : links.rowCount)) !== null && _a !== void 0 ? _a : null;
        });
    },
    // end of city-shop-links adding
    getAllCities() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM cities`;
            const cities = yield (app_1.default === null || app_1.default === void 0 ? void 0 : app_1.default.query(query));
            if (cities)
                return cities.rows;
            return undefined;
        });
    },
    //
    // async getCityById(cityId: number) {
    //     const query = `SELECT * FROM cities WHERE id = $1`;
    //     const values = [cityId];
    //     const city = await pool?.query(query, values);
    //
    //     if (city) return city.rows[0];
    //     return undefined;
    // },
    //
    // async deleteCity(cityId: number) {
    //     const query = `DELETE FROM cities WHERE id = $1 RETURNING id`;
    //     const values = [cityId];
    //     const deletedCitiesNumber = await pool?.query(query, values);
    //
    //     return !!deletedCitiesNumber?.rowCount;
    // },
    //
    // async createCity(newCityParams: City) {
    //     const query = `INSERT INTO cities
    //                    (name, name_in_english, latitude, longitude, is_capital)
    //                    VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    //     const values = [
    //         newCityParams.name,
    //         newCityParams.nameInEnglish,
    //         newCityParams.latitude,
    //         newCityParams.longitude,
    //         newCityParams.isCapital
    //     ];
    //     const newCity = await pool?.query(query, values);
    //
    //     if (newCity) return newCity.rows[0];
    //     return undefined;
    // },
};
