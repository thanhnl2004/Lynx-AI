import { Router } from "express";
import { createConversation, getConversations, getConversationWithMessages} from "../controllers/conversation.controller.js";

const router = Router();

router.get("/api/conversations", getConversations);
router.get("/api/conversations/:conversationId", getConversationWithMessages);
router.post("/api/conversations", createConversation);

export default router;