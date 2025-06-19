import express from "express";
import {
  submitFeedback,
  getAllFeedbacks,
  exportFeedbacks,
} from "../controllers/feedback.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", submitFeedback);
router.get("/", verifyToken, getAllFeedbacks);
router.get("/export", exportFeedbacks); // 🆕 Public route to export CSV

export default router;
