import { Router } from "express";
import { getConversations, getConversationWithMessages} from "../controllers/conversation.controller.js";

const router = Router();

router.get("/api/conversations", getConversations);
router.get("/api/conversations/:conversationId", getConversationWithMessages);

export default router;