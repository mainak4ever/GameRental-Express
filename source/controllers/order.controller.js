import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/orders.model.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";

export const placeOrder = asyncHandler(async (req, res) => {
  const { userID } = req.body;

  // Find the user and populate the cart with product details
  const user = await User.findById(userID).populate("cart.product");

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  console.log(user.cart);
  // Check if the user's cart is not empty
  if (user.cart.length === 0) {
    throw new ApiError(400, "users cart is empty");
  }

  // Calculate total price and create an order
  const totalPrice = user.cart.reduce(
    (acc, item) => acc + item.count * item.rentedAtPrice,
    0
  );

  const order = new Order({
    user: userID,
    products: user.cart,
    totalPrice,
  });

  // Save the order to the database
  await order.save();

  // Empty the user's cart
  user.cart = [];
  await user.save();

  // Update overall stock for each product
  for (const item of order.products) {
    const product = await Product.findById(item.product._id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update the unitsAvailable based on the count in the order
    product.unitsAvailable -= item.count;
    await product.save();
  }

  res.status(200).json(order);
});

export const viewOrderById = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId;
  console.log(orderId);

  // Find the order by ID
  const order = await Order.findById(orderId).populate("user", "username");
  console.log(order);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res.status(200).json(order);
});

export const viewAllOrders = asyncHandler(async (req, res) => {
  const userID = req.params.userID;
  const orders = await Order.find({ user: userID }).populate(
    "user",
    "username"
  );

  res.status(200).json(orders);
});
