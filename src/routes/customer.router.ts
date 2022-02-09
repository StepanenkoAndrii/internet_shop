import express from "express";
import customersController from "../controllers/customer.controller";

const router = express.Router();

// router.get("/top", customersController.getTopCustomers);
router.get("/expenses/:id", customersController.getCustomerExpenses);
router.get("/withOrders", customersController.getCustomersWithOrders);
router.get("/withNoOrders", customersController.getCustomersWithNoOrders);

router.get("/:id", customersController.getCustomerById);
router.get("/", customersController.getAllCustomers);
router.delete("/:id", customersController.deleteCustomer);
router.patch("/:id", customersController.updateCustomer);
router.post("/", customersController.createCustomer);

export default router;