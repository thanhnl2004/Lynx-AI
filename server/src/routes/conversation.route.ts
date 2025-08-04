import { Router } from "express";
import { 
  createConversation, 
  getConversations, 
  getConversationWithMessages,
  renameConversation
} from "../controllers/conversation.controller.js";
import { rename } from "fs";

const router = Router();

router.get("/api/conversations", getConversations);
router.get("/api/conversations/:conversationId", getConversationWithMessages);
router.post("/api/conversations", createConversation);
router.put("/api/conversations/:conversationId/rename", renameConversation);

export default router;