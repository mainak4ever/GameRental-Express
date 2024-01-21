import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    thumbnailURL: {
      type: String,
      required: true,
    },
    sellerUsername: {
      type: String,
      required: true,
    },
    unitsAvailable: {
      type: Number,
      required: true,
    },
    productType: {
      type: String,
      required: true,
    },
    productImages: [{ type: String }],
    rentalPricePerWeek: {
      type: Number,
    },
    rentalPricePerMonth: {
      type: Number,
    },
  },
  { timestamps: true }
);
export const Product = mongoose.model("Product", productSchema);
