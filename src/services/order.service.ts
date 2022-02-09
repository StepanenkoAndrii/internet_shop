import {Request, Response} from "express";
import logger from "../utils/logger";
import pool from "../app";

type Order = {
    customer_id: number,
    product_id: number,
    date: string,
};

export default {
    async getAllOrders(): Promise<object[] | undefined> {
        const query = `SELECT * FROM orders`;
        const orders = await pool?.query(query);

        if (orders) return orders.rows;
        return undefined;
    },

    async getOrderById(orderId: number) {
        const query = `SELECT * FROM orders WHERE id = $1`;
        const values = [orderId];
        const order = await pool?.query(query, values);

        if (order) return order.rows[0];
        return undefined;
    },

    async deleteOrder(orderId: number) {
        const query = `DELETE FROM orders WHERE id = $1 RETURNING id`;
        const values = [orderId];
        const deletedOrdersNumber = await pool?.query(query, values);

        return !!deletedOrdersNumber?.rowCount;
    },

    async createOrder(orderNewParams: Order) {
        const query = `INSERT INTO orders (customer_id, product_id, date) VALUES ($1, $2, $3) RETURNING *`;
        const values = [orderNewParams.customer_id, orderNewParams.product_id, orderNewParams.date];
        const newOrder = await pool?.query(query, values);

        if (newOrder) return newOrder.rows[0];
        return undefined;
    },
};