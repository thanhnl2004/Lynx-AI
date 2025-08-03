import { Request, Response } from "express";
import conversationService from "../services/conversation.service.js";

interface GetConversationsRequest extends Request {
  query: {
    userId: string;
  }
}

interface GetConversationWithMessagesRequest extends Request {
  params: {
    conversationId: string;
  },
  query: {
    userId: string;
  }
}

const getConversations = async (req: GetConversationsRequest, res: Response) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(401).json({ error: 'User ID is required' });
  }

  try {
    const conversations = await conversationService.getConversationsByUserId(userId);
    res.status(200).json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
}

const getConversationWithMessages = async (req: GetConversationWithMessagesRequest, res: Response) => {
  const { conversationId } = req.params;
  const { userId } = req.query;

  if (!userId) {
    return res.status(401).json({ error: 'User ID is required' });
  }

  try {
    const conversation = await conversationService.getConversationWithMessages(conversationId);
    res.status(200).json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }

}

const createConversation = async (req: Request, res: Response) => {
  const { userId, title } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'User ID is required' });
  }

  try {
    const conversation = await conversationService.createConversation(userId, title);
    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
}

export { getConversations, getConversationWithMessages, createConversation };