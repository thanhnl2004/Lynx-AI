import { Router } from "express";
import conversationController from "../controllers/conversation.controller.js";

const router = Router();

router.get("/api/conversations", conversationController.getConversations);
router.get("/api/conversations/:conversationId", conversationController.getConversationWithMessages);
router.post("/api/conversations", conversationController.createConversation);
router.put("/api/conversations/:conversationId/rename", conversationController.renameConversation);

export default router;