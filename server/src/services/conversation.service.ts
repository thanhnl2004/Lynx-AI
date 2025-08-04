import db from "./db.service.js";
import { PrismaClient } from "@prisma/client";

class ConversationService {
  /**
   * @Service for managing conversations and messages.
   */
  private db: PrismaClient = db.getClient();

  async getConversationsByUserId(userId: string) {
    return await this.db.conversation.findMany({
      where: {userId},
      include: {
        messages: {
          orderBy: {createdAt: 'asc'},
          take: 1
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
  }

  async createConversation(userId: string, title?: string) {
    const conversation = await this.db.conversation.create({
      data: {
        userId,
        title: title || "New Conversation"
      }
    })

    return conversation;
  }

  async getOrCreateConversation(userId: string) {
    return await this.createConversation(userId, "New Chat");
  }

  async saveMessage(conversationId: string, content: string, role: 'user' | 'assistant') {
    return await this.db.message.create({
      data: {
        conversationId,
        content,
        role
      }
    });
  }

  async getConversationWithMessages(conversationId: string) {
    return await this.db.conversation.findUnique({
      where: { id: conversationId },
      include: { 
        messages: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });
  }
}

const conversationService = new ConversationService();

export default conversationService;