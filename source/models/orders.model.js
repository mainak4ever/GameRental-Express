import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    products: [],
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
export const Order = mongoose.model("Order", orderSchema);
