import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";

class ComposioService {
  /**
   * @description Interact with tools and services provided by Composio
   */
  private composio: Composio<VercelProvider>;

  constructor() {
    this.composio = new Composio({
      apiKey: process.env.COMPOSIO_API_KEY,
      provider: new VercelProvider(),
    });
  }

  async initiateConnection(userId: string, authConfigId: string) {
    const connectionRequest = await this.composio.connectedAccounts.initiate(
      userId,
      authConfigId,
    );

    return connectionRequest;
  }

  async checkConnectionStatus(connectionId: string) {
    const connection = await this.composio.connectedAccounts.waitForConnection(connectionId);

    return connection;
  }
  
  async deleteConnection(connectionId: string) {
    await this.composio.connectedAccounts.delete(connectionId);
  }

  async getTools(userId: string, toolName: string) {
    return await this.composio.tools.get(userId, toolName);
  }

  async getToolKits(userId: string) {
    const connectedAccounts = await this.composio.connectedAccounts.list({
      userIds: [userId],
    });
  
    const connectedToolkitMap = new Map();
  
    connectedAccounts.items.forEach(account => {
      connectedToolkitMap.set(account.toolkit.slug.toUpperCase(), account.id);
    });
  }
}

const composioService = new ComposioService();
export default composioService;