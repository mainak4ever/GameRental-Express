import { Router } from "express";
import {
  placeOrder,
  viewAllOrders,
  viewOrderById,
} from "../controllers/order.controller.js";

const router = Router();

router.route("/place").post(placeOrder);
router.route("/user/:userID").get(viewAllOrders);
router.route("/:orderId").get(viewOrderById);

export default router;
