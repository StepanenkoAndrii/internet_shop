import {Request, Response} from "express";
import customerService from "../services/customer.service";
import logger from "../utils/logger";

export default {
    async getAllCustomers(req: Request, res: Response) {
        const customers = await customerService.getAllCustomers();
        logger.info(customers);
        res.send(customers);
    },

    async getCustomerById(req: Request, res: Response) {
        const customer = await customerService.getCustomerById(Number(req.params.id));
        logger.info(customer);
        res.send(customer);
    },

    async deleteCustomer(req: Request, res: Response) {
        const customerIsDeleted = await customerService.deleteCustomer(Number(req.params.id));
        if (customerIsDeleted) {
            logger.info(customerIsDeleted);
            res.send(`customer with id = ${req.params.id} is successfully deleted`);
        }
        res.send(`customer with id = ${req.params.id} doesn't exist`);
    },

    async updateCustomer(req: Request, res: Response) {
        const updatedCustomer = await customerService.updateCustomer(Number(req.params.id), req.body);
        logger.info(updatedCustomer);
        res.send(updatedCustomer);
    },

    async createCustomer(req: Request, res: Response) {
        const newCustomer = await customerService.createCustomer(req.body);
        logger.info(newCustomer);
        res.send(newCustomer);
    },

    // additional queries

    async getCustomersWithNoOrders(req: Request, res: Response) {
        const customersWithNoOrders = await customerService.getCustomersWithNoOrders();
        logger.info(customersWithNoOrders);
        res.send(customersWithNoOrders);
    },

    async getCustomersWithOrders(req: Request, res: Response) {
        const customersWithOrders = await customerService.getCustomersWithOrders();
        logger.info(customersWithOrders);
        res.send(customersWithOrders);
    },

    async getCustomerExpenses(req: Request, res: Response) {
        const customerExpenses = await customerService.getCustomerExpenses(Number(req.params.id));
        logger.info(customerExpenses);
        res.send(customerExpenses);
    },

    // async getTopCustomers(req: Request, res: Response) {
    //     const topCustomers = await customerService.getTopCustomers(req.query);
    //     logger.info(topCustomers);
    //     res.send(topCustomers);
    // },
};