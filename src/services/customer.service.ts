import {Request, Response} from "express";
import logger from "../utils/logger";
import pool from "../app";

type Customer = {
    name: string,
    surname: string,
    email: string,
};

type Params = {
    expenses?: boolean,
    orders?: boolean,
    top?: number,
};

export default {
    async getAllCustomers(): Promise<Customer[] | undefined> {
        const query = `SELECT * FROM customers`;
        const customers = await pool?.query(query);

        if (customers) return customers.rows;
        return undefined;
    },

    async getCustomerById(customerId: number): Promise<Customer | undefined> {
        const query = `SELECT * FROM customers WHERE id = $1`;
        const values = [customerId];
        const customer = await pool?.query(query, values);

        if (customer) return customer.rows[0];
        return undefined;
    },

    async deleteCustomer(customerId: number): Promise<boolean> {
        const query = `DELETE FROM customers WHERE id = $1 RETURNING id`;
        const values = [customerId];
        const deletedCustomersNumber = await pool?.query(query, values);

        return !!deletedCustomersNumber?.rowCount;
    },

    async updateCustomer(customerId: number, customerNewParams: Customer): Promise<Customer | undefined> {
        const query = `UPDATE customers SET name = $2, surname = $3, email = $4 WHERE id = $1`;
        const values = [customerId, customerNewParams.name, customerNewParams.surname, customerNewParams.email];
        const updatedCustomer = await pool?.query(query, values);

        if (updatedCustomer) return updatedCustomer.rows[0];
        return undefined;
    },

    async createCustomer(customerNewParams: Customer) {
        const query = `INSERT INTO customers (name, surname, email) VALUES ($1, $2, $3) RETURNING *`;
        const values = [customerNewParams.name, customerNewParams.surname, customerNewParams.email];
        const newCustomer = await pool?.query(query, values);

        if (newCustomer) return newCustomer.rows[0];
        return undefined;
    },

    // additional queries

    async getCustomersWithNoOrders(): Promise<Customer[] | undefined> {
        const query = `SELECT DISTINCT cu.id, cu.name, cu.surname, cu.email FROM customers cu
                       LEFT JOIN orders ord ON cu.id = ord.customer_id
                       WHERE ord.customer_id IS NULL ORDER BY cu.id`;
        const customersWithNoOrders = await pool?.query(query);

        if (customersWithNoOrders) return customersWithNoOrders.rows;
        return undefined;
    },

    async getCustomersWithOrders(): Promise<Customer[] | undefined> {
        const query = `SELECT DISTINCT cu.id, cu.name, cu.surname, cu.email FROM customers cu
                       INNER JOIN orders ord ON cu.id = ord.customer_id
                       ORDER BY cu.id`;
        const customersWithNoOrders = await pool?.query(query);

        if (customersWithNoOrders) return customersWithNoOrders.rows;
        return undefined;
    },

    async getCustomerExpenses(customerId: number): Promise<number | undefined> {
        const query = `WITH product_ids AS (
                            SELECT product_id FROM orders WHERE customer_id = $1
                       )
                       SELECT SUM(price) FROM products 
                       WHERE ID IN (
                            SELECT product_id FROM product_ids
                       )`;
        const values = [customerId];
        const customerExpenses = await pool?.query(query, values);

        if (customerExpenses) return customerExpenses.rows[0];
        return undefined;
    },

    // async getTopCustomers(params: Params): Promise<number | undefined> {},
};