import { streamText, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";
import aiService from "../../services/ai/ai.service.js";
import { Request, Response } from "express";


export const getAIResponse = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const result = aiService.generateResponse(messages);

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