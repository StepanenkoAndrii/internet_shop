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
const city_service_1 = __importDefault(require("../services/city.service"));
const logger_1 = __importDefault(require("../utils/logger"));
exports.default = {
    getAllApiCities(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const allApiCities = yield city_service_1.default.getAllApiCities();
            logger_1.default.info(allApiCities);
            res.send(allApiCities);
        });
    },
    importApiCities(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const importedApiCities = yield city_service_1.default.importApiCities();
            logger_1.default.info(importedApiCities);
            res.send(importedApiCities);
        });
    },
    addLinks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield city_service_1.default.addLinks();
        });
    },
    // async getAllCities(req: Request, res: Response) {
    //     const cities = await cityService.getAllCities();
    //     logger.info(cities);
    //     res.send(cities);
    // },
    //
    // async getCityById(req: Request, res: Response) {
    //     const city = await cityService.getCityById(Number(req.params.id));
    //     logger.info(city);
    //     res.send(city);
    // },
    //
    // async deleteCity(req: Request, res: Response) {
    //     const cityIsDeleted = await cityService.deleteCity(Number(req.params.id));
    //     if (cityIsDeleted) {
    //         logger.info(cityIsDeleted);
    //         res.send(`city with id = ${req.params.id} is successfully deleted`);
    //     }
    //     res.send(`city with id = ${req.params.id} doesn't exist`);
    // },
    //
    // async createCity(req: Request, res: Response) {
    //     const newCity = await cityService.createCity(req.body);
    //     logger.info(newCity);
    //     res.send(newCity);
    // },
};
