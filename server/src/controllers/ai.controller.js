import { streamText, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";

const model = google("gemini-2.0-flash");

export const getAIResponse = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const result = streamText({
      model,
      messages: convertToModelMessages(messages),
      system: 'You are a helpful AI assistant.',
    });

    res.json({ response: result.toUIMessageStreamResponse()});
  } catch (error) {
    console.error('AI Controller Error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
};

export default getAIResponse;