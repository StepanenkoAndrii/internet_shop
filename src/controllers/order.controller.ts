import {Request, Response} from "express";
import orderService from "../services/order.service";
import logger from "../utils/logger";

export default {
    async getAllOrders(req: Request, res: Response) {
        const orders = await orderService.getAllOrders();
        logger.info(orders);
        res.send(orders);
    },

    async getOrderById(req: Request, res: Response) {
        const order = await orderService.getOrderById(Number(req.params.id));
        logger.info(order);
        res.send(order);
    },

    async deleteOrder(req: Request, res: Response) {
        const orderIsDeleted = await orderService.deleteOrder(Number(req.params.id));
        if (orderIsDeleted) {
            logger.info(orderIsDeleted);
            res.send(`order with id = ${req.params.id} is successfully deleted`);
        }
        res.send(`order with id = ${req.params.id} doesn't exist`);
    },

    async createOrder(req: Request, res: Response) {
        const newOrder = await orderService.createOrder(req.body);
        logger.info(newOrder);
        res.send(newOrder);
    },
};