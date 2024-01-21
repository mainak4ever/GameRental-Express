import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import mongoose, { Schema } from "mongoose";

export const getAllProducts = asyncHandler(async (req, res) => {
  // Fetch all products with basic details
  const products = await Product.find(
    {},
    {
      _id: 1,
      title: 1,
      thumbnailURL: 1,
      sellerUsername: 1,
      unitsAvailable: 1,
      productType: 1,
      rentalPricePerWeek: 1,
      rentalPricePerMonth: 1,
    }
  );

  // Check if any products are found
  if (!products || products.length === 0) {
    throw new ApiError(404, "No products found");
  }

  // Build a simplified array of product details
  const simplifiedProducts = products.map((product) => ({
    productID: product._id,
    title: product.title,
    thumbnailURL: product.thumbnailURL,
    sellerUsername: product.sellerUsername,
    unitsAvailable: product.unitsAvailable,
    productType: product.productType,
    rentalPricePerWeek: product.rentalPricePerWeek,
    rentalPricePerMonth: product.rentalPricePerMonth,
  }));

  res.status(200).json(simplifiedProducts);
});

export const getProductDetails = asyncHandler(async (req, res) => {
  const productId = req.params.productId;

  // Check if productId is provided
  if (!productId) {
    throw new ApiError(400, "ProductID is required");
  }

  // Find the product by productId
  const product = await Product.findById(productId);

  // Check if the product exists
  if (!product) {
    throw new ApiError(404, "Product Not Found");
  }

  res.status(200).json({
    productID: product._id,
    title: product.title,
    thumbnailURL: product.thumbnailURL,
    sellerUsername: product.sellerUsername,
    unitsAvailable: product.unitsAvailable,
    productType: product.productType,
    productImages: product.productImages || [],
    rentalPricePerWeek: product.rentalPricePerWeek,
    rentalPricePerMonth: product.rentalPricePerMonth,
  });
});

export const toggleProductWishlist = asyncHandler(async (req, res) => {
  const { userID, productID } = req.body;

  // Check if userID and productID are provided
  if (!userID || !productID) {
    throw new ApiError(400, "UserID and ProductID are required");
  }

  // Find the user by userID
  const user = await User.findById(userID);

  // Check if the user exists
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if the product is already in the wishlist
  const isProductInWishlist = user.wishlist.includes(productID);

  // Toggle the product in the wishlist
  if (isProductInWishlist) {
    user.wishlist = user.wishlist.filter((id) => id !== productID);
  } else {
    user.wishlist.push(productID);
  }

  await user.save();

  // Get detailed product information for products in the wishlist
  const wishlistProducts = await Product.find(
    { _id: { $in: user.wishlist } },
    {
      _id: 1,
      title: 1,
      thumbnailURL: 1,
      sellerUsername: 1,
      unitsAvailable: 1,
      productType: 1,
      rentalPricePerWeek: 1,
    }
  );

  const wishlistResponse = wishlistProducts.map((product) => ({
    productID: product._id,
    title: product.title,
    thumbnailURL: product.thumbnailURL,
    sellerUsername: product.sellerUsername,
    unitsAvailable: product.unitsAvailable,
    productType: product.productType,
    rentalStartingFromPrice: product.rentalPricePerWeek,
  }));

  res.status(200).json(wishlistResponse);
});

export const toggleProductCart = asyncHandler(async (req, res) => {
  const { userID, productID, count, bookingStartDate, bookingEndDate } =
    req.body;

  // Check if userID, productID, and count are provided
  if (!userID || !productID || !count) {
    throw new ApiError(400, "UserID, ProductID, and Count are required");
  }

  // Find the user by userID
  const user = await User.findById(userID);

  // Check if the user exists
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Find the product by productID
  const product = await Product.findById(productID);

  // Check if the product exists
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check if the count exceeds the unitsAvailable of the product
  if (count > product.unitsAvailable) {
    throw new ApiError(400, `Only ${product.unitsAvailable} units available`);
  }

  // Check if the product is already in the user's cart
  const cartItemIndex = user.cart.findIndex(
    (item) => item.product.toString() === productID
  );

  // Calculate rentedAtPrice based on the current rental price of the product and booking duration
  const rentedAtPricePerWeek = product.rentalPricePerWeek;
  const rentedAtPricePerMonth = product.rentalPricePerMonth;

  let rentedAtPrice = 0; // Initialize as a number
  if (bookingStartDate && bookingEndDate) {
    const durationInDays = Math.ceil(
      (new Date(bookingEndDate) - new Date(bookingStartDate)) /
        (1000 * 60 * 60 * 24)
    );

    if (durationInDays >= 30) {
      const months = Math.floor(durationInDays / 30);
      rentedAtPrice += rentedAtPricePerMonth * months;

      // Subtract the months from the total duration
      durationInDays -= months * 30;
    }

    if (durationInDays >= 7) {
      const weeks = Math.floor(durationInDays / 7);
      rentedAtPrice += rentedAtPricePerWeek * weeks;
    }
  }

  // If the product is already in the cart, update the count
  if (cartItemIndex !== -1) {
    user.cart.splice(cartItemIndex, 1);
  } else {
    // If the product is not in the cart, add it
    user.cart.push({
      product: productID,
      count,
      bookingStartDate,
      bookingEndDate,
      rentedAtPrice,
    });
  }

  await user.save();

  // console.log(user);

  // Populate the product details in the user's cart
  await user.populate({
    path: "cart.product",
    select:
      "title thumbnailURL sellerUsername unitsAvailable productType rentalPricePerWeek rentalPricePerMonth",
  });

  // Respond with the array of products in the cart
  const cartResponse = user.cart.map((cartItem) => {
    const { product, count, bookingStartDate, bookingEndDate, rentedAtPrice } =
      cartItem;
    return {
      productID: product._id,
      title: product.title,
      thumbnailURL: product.thumbnailURL,
      sellerUsername: product.sellerUsername,
      count,
      unitsAvailable: product.unitsAvailable,
      productType: product.productType,
      bookingStartDate,
      bookingEndDate,
      rentedAtPrice,
    };
  });

  res.status(200).json(cartResponse);
});

export const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    thumbnailURL,
    sellerUsername,
    unitsAvailable,
    productType,
    productImages,
    rentalPricePerWeek,
    rentalPricePerMonth,
  } = req.body;

  // Check if all required fields are provided
  if (
    !title ||
    !thumbnailURL ||
    !sellerUsername ||
    !unitsAvailable ||
    !productType ||
    !rentalPricePerWeek ||
    !rentalPricePerMonth
  ) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Validate productType
  const validProductTypes = ["console", "controller", "game"];
  if (!validProductTypes.includes(productType.toLowerCase())) {
    throw new ApiError(
      400,
      "Invalid productType. It should be console, controller, or game"
    );
  }

  // Create the new product
  const newProduct = await Product.create({
    title,
    thumbnailURL,
    sellerUsername,
    unitsAvailable,
    productType,
    productImages: productImages || [],
    rentalPricePerWeek,
    rentalPricePerMonth,
  });

  res.status(200).json(newProduct);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const {
    productID,
    title,
    thumbnailURL,
    sellerUsername,
    unitsAvailable,
    productType,
    productImages,
    rentalPricePerWeek,
    rentalPricePerMonth,
  } = req.body;

  // Check if productID is provided
  if (!productID) {
    throw new ApiError(400, "ProductID is required");
  }
  console.log(productID);
  // Find the product by productID
  const product = await Product.findOne({ _id: productID });
  console.log(product);

  if (!product) {
    throw new ApiError(404, "Product Not Found");
  }

  // Update the product details
  product.title = title || product.title;
  product.thumbnailURL = thumbnailURL || product.thumbnailURL;
  product.sellerUsername = sellerUsername || product.sellerUsername;
  product.unitsAvailable = unitsAvailable || product.unitsAvailable;
  product.productType = productType || product.productType;
  product.productImages = productImages || product.productImages;
  product.rentalPricePerWeek = rentalPricePerWeek || product.rentalPricePerWeek;
  product.rentalPricePerMonth =
    rentalPricePerMonth || product.rentalPricePerMonth;

  await product.save();

  res.status(200).json(product);
});
