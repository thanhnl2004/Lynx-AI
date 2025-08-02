import { PrismaClient } from '@prisma/client';

class DatabaseService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  getClient() {
    return this.prisma;
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}

const db = new DatabaseService();

export default db;