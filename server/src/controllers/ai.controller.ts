import { UIMessage } from "ai";
import aiService from "../services/ai.service.js";
import { Request, Response } from "express";
import conversationService from "../services/conversation.service.js";

interface AuthenticatedRequest extends Request {
  body: {
    messages: UIMessage[];
    userId: string;  // Add userId to the body type
  }
}

export const getAIResponse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { messages, userId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const conversation = await conversationService.getOrCreateConversation(userId);

    // save the latest message to the conversation
    const latestMessage = messages[messages.length - 1];
    if (latestMessage.role === 'user') {
      // Narrow in on only the text parts
      const textParts = latestMessage.parts
        .filter((p): p is { type: 'text'; text: string } => p.type === 'text');
    
      const userPrompt = textParts.map(p => p.text).join('');
    
      await conversationService.saveMessage(
        conversation.id,
        userPrompt,
        'user'
      );
    }
    let aiResponseContent = '';

    const result = aiService.generateResponse(messages, {
      onTextChunk: (text) => {
        aiResponseContent += text;
      },
      onFinish: async () => {
        try {
          await conversationService.saveMessage(
            conversation.id,
            aiResponseContent,
            'assistant'
          )
          console.log(`Saved AI response to conversation: ${conversation.id}`);
        } catch (error) {
          console.error('Error saving AI response:', error);
        }
      }
    })
    
    result.pipeUIMessageStreamToResponse(res);

    console.log(`POST /api/chat ${res.statusCode}`);
  } catch (error) {
    console.error('AI Controller Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to get AI response' });
    }
  }
};

export default getAIResponse;