import { streamText, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";
import { UIMessage } from "ai";
import composioService from "./composio.service.js";

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
      callbacks: AICallbacks, 
      userId?: string
    ) {
      if (!messages || !Array.isArray(messages)) {
        throw new Error('Messages array is required');
      }

      try {
        let tools = {};
        try {
          if (userId) {
            const composioTools = await composioService.getTools(userId, "GMAIL_SEND_EMAIL");
            tools = composioTools;
          }
        } catch (error) {
          console.error('Error fetching composio tools:', error);
        }
        
        const result = streamText({
          model: this.model,
          messages: convertToModelMessages(messages),
          system: `
            You are a helpful AI assistant.
            You can send emails via Gmail using the GMAIL_SEND_EMAIL tool when appropriate.
            Ask for any missing fields (recipient email, subject, body) before calling the tool.
            If Gmail is not connected, suggest the user to connect their Gmail account to use the tool.
          `,
          onChunk: ({chunk}) => {
            if (callbacks.onTextChunk && chunk.type === 'text-delta') {
              callbacks.onTextChunk(chunk.text);
            }
          },
          tools,
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
