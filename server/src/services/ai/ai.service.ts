import { streamText, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";
import { UIMessage } from "ai";
// import { config } from "dotenv";
// config({ debug: false });


class AIService {
  /**
   * Generate AI response stream
   * @param {Array} messages - Array of conversation messages
   * @returns {Promise} - Stream result from AI model
   */
    private model;

    constructor(model=google("gemini-2.0-flash")) {
        this.model = model;
    }

    generateResponse(messages: UIMessage[]) {
      if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
      }

      try {
        const result = streamText({
            model: this.model,
            messages: convertToModelMessages(messages),
            system: 'You are a helpful AI assistant.',
        });

        return result;
      } catch (error) {
        console.error('AI Service Error:', error);
        throw new Error('Failed to generate AI response');
      }
    }
}

const aiService = new AIService();
export default aiService;
