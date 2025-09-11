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
      userId?: string,
      enabledToolkits: string[] = []
    ) {
      if (!messages || !Array.isArray(messages)) {
        throw new Error('Messages array is required');
      }

      try {
        let tools = {};
        try {
          if (userId && enabledToolkits.length > 0) {
            console.log('AI Service: Enabled toolkits received:', enabledToolkits);
            const composioTools = await composioService.getTools(userId, enabledToolkits);
            tools = composioTools || {};
            console.log('AI Service: Fetched Composio tools:', Object.keys(tools));
            console.log('AI Service: Tools count:', Object.keys(tools).length);
          } else {
            console.log('AI Service: No enabled toolkits or no user ID. EnabledToolkits:', enabledToolkits, 'UserId:', userId);
          }
        } catch (error) {
          console.error('Error fetching composio tools:', error);
        }
        
        const systemPrompt = this.buildSystemPrompt(enabledToolkits, Object.keys(tools).length > 0);
        console.log('AI Service: System prompt:', systemPrompt);
        
        const result = streamText({
          model: this.model,
          messages: convertToModelMessages(messages),
          system: systemPrompt,
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

    private buildSystemPrompt(enabledToolkits: string[], hasTools: boolean): string {
      let prompt = "You are a helpful AI assistant.";
      
      if (enabledToolkits.some(toolkit => toolkit.toUpperCase() === "GMAIL") && hasTools) {
        prompt += `
        
        You can send emails via Gmail using the available Gmail tools when appropriate.
        When a user requests to send an email:
        1. Ask for any missing required fields (recipient email, subject, body) if not provided
        2. Use the Gmail tools to send the email
        3. Confirm successful sending or report any errors
        
        Always be helpful and ask for clarification when needed.`;
      } else if (enabledToolkits.some(toolkit => toolkit.toUpperCase() === "GMAIL") && !hasTools) {
        prompt += `
        
        The user has enabled Gmail integration but it's not currently connected.
        If they ask to send emails, suggest they connect their Gmail account first.`;
      }
      
      if (enabledToolkits.length === 0) {
        prompt += `
        
        You can have normal conversations. If the user asks to send emails or use other external services, 
        let them know they need to connect the appropriate services first.`;
      }
      
      return prompt;
    }
}

const aiService = new AIService();
export default aiService;
