import { Router } from "express";
import getAIResponse from "../controllers/ai.controller.js";

const router = Router();

router.post("/api/ai/chat", getAIResponse);

export default router;