import { Router } from "express";
import {
  createProduct,
  getProductDetails,
  toggleProductCart,
  toggleProductWishlist,
  updateProduct,
} from "../controllers/product.controller.js";

const router = Router();

router.route("/create").post(createProduct);
router.route("/update").put(updateProduct);
router.route("/:productId").get(getProductDetails);
router.route("/toggleWishlist").put(toggleProductWishlist);
router.route("/toggleCart").put(toggleProductCart);
export default router;
