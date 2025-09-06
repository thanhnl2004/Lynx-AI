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

class ConversationController {
  private conversationService: typeof conversationService;

  constructor() {
    this.conversationService = conversationService;
  }


  async getConversations(req: GetConversationsRequest, res: Response) {
    const { userId } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    try {
      const conversations = await this.conversationService.getConversationsByUserId(userId);
      res.status(200).json(conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  }

  async getConversationWithMessages(req: GetConversationWithMessagesRequest, res: Response) {
    const { conversationId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    try {
      const conversation = await this.conversationService.getConversationWithMessages(conversationId);
      res.status(200).json(conversation);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      res.status(500).json({ error: 'Failed to fetch conversation' });
    }

  }

  async createConversation(req: Request, res: Response) {
    const { userId, title } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    try {
      const conversation = await this.conversationService.createConversation(userId, title);
      res.status(201).json(conversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      res.status(500).json({ error: 'Failed to create conversation' });
    }
  }

  async renameConversation(req: Request, res: Response) {
    const { conversationId } = req.params;
    const { newTitle } = req.body;

    if (!conversationId) {
      console.log(`convo id: ${conversationId}`);
      return res.status(401).json({ error: 'Conversation ID doesn\'t exist'});
    }

    try {
      const updatedConversation = await this.conversationService.renameConversation(conversationId, newTitle as string);
      res.status(200).json(updatedConversation);
    } catch (error) {
      console.error('Error renaming conversation:', error);
      res.status(500).json({ error: 'Failed to rename conversation' });
    }

  }
}

const conversationController = new ConversationController();
export default conversationController;