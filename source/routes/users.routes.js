import { Router } from "express";
import {
  loginUser,
  registerUser,
  updateUserDetails,
  viewUserDetails,
} from "../controllers/user.controller.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/:username").get(viewUserDetails);
router.route("/update").put(updateUserDetails);

export default router;
