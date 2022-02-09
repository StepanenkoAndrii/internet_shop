import {Request, Response} from "express";
import cityService from "../services/city.service";
import logger from "../utils/logger";

export default {
    async getAllApiCities(req: Request, res: Response) {
        const allApiCities = await cityService.getAllApiCities();
        logger.info(allApiCities);
        res.send(allApiCities);
    },

    async importApiCities(req: Request, res: Response) {
        const importedApiCities = await cityService.importApiCities();
        logger.info(importedApiCities);
        res.send(importedApiCities);
    },

    async getAllCities(req: Request, res: Response) {
        const cities = await cityService.getAllCities();
        logger.info(cities);
        res.send(cities);
    },

    async getCityById(req: Request, res: Response) {
        const city = await cityService.getCityById(Number(req.params.id));
        logger.info(city);
        res.send(city);
    },

    async deleteCity(req: Request, res: Response) {
        const cityIsDeleted = await cityService.deleteCity(Number(req.params.id));
        if (cityIsDeleted) {
            logger.info(cityIsDeleted);
            res.send(`city with id = ${req.params.id} is successfully deleted`);
        }
        res.send(`city with id = ${req.params.id} doesn't exist`);
    },

    async createCity(req: Request, res: Response) {
        const newCity = await cityService.createCity(req.body);
        logger.info(newCity);
        res.send(newCity);
    },
};