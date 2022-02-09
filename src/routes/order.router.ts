import express from "express";
import ordersController from "../controllers/order.controller";

const router = express.Router();

router.get("/:id", ordersController.getOrderById);
router.get("/", ordersController.getAllOrders);
router.delete("/:id", ordersController.deleteOrder);
router.post("/", ordersController.createOrder);

export default router;