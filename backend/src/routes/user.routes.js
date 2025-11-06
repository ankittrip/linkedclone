import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";


import {
  getProfile,
  updateProfile,
  getUserById,
  getAllUsers,
} from "../controllers/user.controller.js";

const router = express.Router();


router.get("/me", protect, getProfile);
router.put("/me", protect, upload.single("avatar"), updateProfile);
router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUserById);

export default router;
