import { Router } from "express";
import { getAIResponse, streamAIResponse } from "../controllers/ai.controller.js";

const router = Router();

router.post("/api/ai/chat", getAIResponse);
router.post("/api/ai/stream", streamAIResponse);

export default router;