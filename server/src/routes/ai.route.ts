import { Router } from "express";
import aiController from "../controllers/ai.controller.js";

const router = Router();

router.post("/api/chat", aiController.getAIResponse);

export default router;