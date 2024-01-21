import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
    },
    cart: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        count: {
          type: Number,
          defaultValue: 1,
        },
        bookingStartDate: {
          type: Date,
        },
        bookingEndDate: {
          type: Date,
        },
        rentedAtPrice: {
          type: Number,
        },
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);
export const User = mongoose.model("User", userSchema);
