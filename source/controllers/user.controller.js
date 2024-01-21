import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const registerUser = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    contactNumber,
    userType,
  } = req.body;

  const requiredFields = [
    username,
    email,
    password,
    firstName,
    lastName,
    contactNumber,
    userType,
  ];
  console.log("Required Fields:", requiredFields);

  if (requiredFields.some((field) => !field)) {
    throw new ApiError(400, "All fields are required");
  }

  if (userType.toLowerCase() === "seller") {
    const domain = email.split("@")[1];

    if (domain !== "admin.com") {
      throw new ApiError(400, "Seller email domain must be admin.com");
    }
  }

  const user = await User.create({
    username,
    email,
    password,
    firstName,
    lastName,
    contactNumber,
    userType,
  });

  if (!user) {
    throw new ApiError(500, "Server Error while creating the account");
  }

  res.status(200).json({
    data: {
      _id: user._id,
      username,
      email,
      firstName,
      lastName,
      contactNumber,
      userType,
    },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "Invalid Login Credentials");
  }

  if (user.password !== password) {
    throw new ApiError(401, "Invalid Login Credentials");
  }

  res.status(200).json({
    userId: user._id,
    message: "Login Successful",
  });
});

export const viewUserDetails = asyncHandler(async (req, res) => {
  const username = req.params.username;

  // Check if username is provided
  if (!username) {
    throw new ApiError(400, "Username is required");
  }

  // Find the user by username
  const user = await User.findOne({ username });

  // Check if the user exists
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    data: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      contactNumber: user.contactNumber,
      userType: user.userType,
    },
  });
});

export const updateUserDetails = asyncHandler(async (req, res) => {
  const { userID, firstName, lastName, email, contactNumber, userType } =
    req.body;

  // Check if userID is provided
  if (!userID) {
    throw new ApiError(400, "UserID is required");
  }

  // Find the user by userID
  const user = await User.findById(userID);

  // Check if the user exists
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Update user details
  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.email = email || user.email;
  user.contactNumber = contactNumber || user.contactNumber;
  user.userType = userType || user.userType;

  // Save the updated user
  await user.save();

  res.status(200).json({
    data: {
      userID: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      contactNumber: user.contactNumber,
      userType: user.userType,
    },
  });
});
