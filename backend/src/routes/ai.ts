import express from "express";
import {
  generateContentSuggestions,
  getPersonalizedRecommendations,
  answerQuestion,
  enhanceDescription,
  chat,
  chatStream,
} from "../controllers/aiController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

// Public endpoints (no auth required)
router.post("/suggestions", generateContentSuggestions);
router.post("/answer", answerQuestion);
router.post("/enhance", enhanceDescription);
router.post("/chat", chat);
router.post("/chat/stream", chatStream);

// Protected endpoints (auth required)
router.post("/recommendations", requireAuth, getPersonalizedRecommendations);

export default router;
