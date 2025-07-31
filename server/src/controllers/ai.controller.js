import { streamText } from "ai";
import { google } from "@ai-sdk/google";

const model = google("gemini-2.0-flash");

export const streamAIResponse = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const result = await streamText({
      model,
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Stream the response
    for await (const textPart of result.textStream) {
      res.write(textPart);
    }

    res.end();
  } catch (error) {
    console.error('AI Controller Error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
};

// Non-streaming version for compatibility
export const getAIResponse = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const result = await streamText({
      model,
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    });

    let fullText = '';
    for await (const textPart of result.textStream) {
      fullText += textPart;
    }

    res.json({ response: fullText });
  } catch (error) {
    console.error('AI Controller Error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
};

export default getAIResponse;