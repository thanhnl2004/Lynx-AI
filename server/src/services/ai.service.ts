import { streamText, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";
import { UIMessage } from "ai";

interface AICallbacks {
  onTextChunk?: (text: string) => void;
  onFinish?: () => Promise<void>;
}

class AIService {
  /**
   * @description Generate AI response stream
   */
    private model;

    constructor(model=google("gemini-2.0-flash")) {
        this.model = model;
    }

    async generateResponse(
      messages: UIMessage[], 
      callbacks: AICallbacks
    ) {
      if (!messages || !Array.isArray(messages)) {
        throw new Error('Messages array is required');
      }

      try {
        const systemPrompt = "You are a helpful AI assistant. You can have natural conversations and help users with various tasks.";
        
        const result = streamText({
          model: this.model,
          messages: convertToModelMessages(messages),
          system: systemPrompt,
          onChunk: ({chunk}) => {
            if (callbacks.onTextChunk && chunk.type === 'text-delta') {
              callbacks.onTextChunk(chunk.text);
            }
          },
          onFinish: callbacks.onFinish
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
