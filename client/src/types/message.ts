import { z } from "zod";
import { UIMessage, InferUITools, ToolSet } from "ai";
import type { Message, Conversation } from './prisma';

// Re-export Prisma types
export type { Message, Conversation };

// Zod schemas for validation (based on Prisma types)
export const supabaseMessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  role: z.enum(['user', 'assistant']),
  conversationId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const messageMetadataSchema = z.object({
  conversationId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const messageDataPartSchema = z.object({});
export const messageTools: ToolSet = {};

// Type definitions
export type SupabaseMessage = z.infer<typeof supabaseMessageSchema>;
export type MessageMetadata = z.infer<typeof messageMetadataSchema>;
export type MessageDataPart = z.infer<typeof messageDataPartSchema>;
export type MessageTools = InferUITools<typeof messageTools>;

// The key type for AI SDK
export type CustomUIMessage = UIMessage<MessageMetadata, MessageDataPart, MessageTools>;

// Validation functions
export const validateSupabaseMessages = (data: unknown): SupabaseMessage[] => {
  return z.array(supabaseMessageSchema).parse(data);
};

export const validateSupabaseMessage = (data: unknown): SupabaseMessage => {
  return supabaseMessageSchema.parse(data);
};

export function convertPrismaMessageToUIMessage(message: Message): CustomUIMessage {
  console.log('Converting Prisma message:', message);
  
  const uiMessage = {
    id: message.id,
    role: message.role as 'user' | 'assistant',
    parts: [
      {
        type: 'text',
        text: message.content,
      },
    ],
    metadata: {
      conversationId: message.conversationId,
      // Handle both Date objects and strings
      createdAt: typeof message.createdAt === 'string' 
        ? message.createdAt 
        : message.createdAt.toISOString(),
      updatedAt: typeof message.updatedAt === 'string' 
        ? message.updatedAt 
        : message.updatedAt.toISOString(),
    },
  };
  
  console.log('Converted to UIMessage:', uiMessage);
  return uiMessage as CustomUIMessage;
}

export function convertPrismaMessagesToUIMessages(messages: Message[]): CustomUIMessage[] {
  console.log('Converting messages array:', messages);
  const converted = messages.map(convertPrismaMessageToUIMessage);
  console.log('Converted messages array:', converted);
  return converted;
}
