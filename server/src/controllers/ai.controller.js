import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const model = google("gemini-2.0-flash");

export const getAIResponse = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const { text } = await generateText({
      model,
      prompt: message,
    });

    res.json({ response: text });
  } catch (error) {
    console.error('AI Controller Error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
};

export default getAIResponse;