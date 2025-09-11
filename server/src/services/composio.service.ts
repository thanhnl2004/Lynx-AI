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

  async getTools(userId: string, toolkitSlugs: string[] = ["GMAIL"]) {
    try {
      return await this.composio.tools.get(userId, {
        toolkits: toolkitSlugs,
      });
    } catch (error) {
      console.error('Error fetching tools:', error);
      return {};
    }
  }

  async getToolKits(userId: string) {
    try {
      console.log('ComposioService.getToolKits: Starting for user:', userId);
      console.log('ComposioService.getToolKits: Composio API Key:', process.env.COMPOSIO_API_KEY ? 'Set' : 'Missing');
      
      const SUPPORTED_TOOLKITS = ['GMAIL', 'GOOGLECALENDAR', 'GITHUB', 'NOTION'];
      
      // List connected accounts to get connection IDs for each toolkit
      console.log('ComposioService.getToolKits: Fetching connected accounts...');
      const connectedAccounts = await this.composio.connectedAccounts.list({
        userIds: [userId],
      });
      console.log('ComposioService.getToolKits: Connected accounts:', connectedAccounts);
    
      const connectedToolkitMap = new Map();
      connectedAccounts.items.forEach(account => {
        connectedToolkitMap.set(account.toolkit.slug.toUpperCase(), account.id);
      });

      // Fetch toolkit data from slugs
      const toolkitPromises = SUPPORTED_TOOLKITS.map(async slug => {
        try {
          const toolkit = await this.composio.toolkits.get(slug);
          const connectionId = connectedToolkitMap.get(slug.toUpperCase());

          return {
            name: toolkit.name,
            slug: toolkit.slug,
            description: toolkit.meta?.description,
            logo: toolkit.meta?.logo,
            categories: toolkit.meta?.categories,
            isConnected: !!connectionId,
            connectionId: connectionId || undefined,
          };
        } catch (error) {
          console.error(`Error fetching toolkit ${slug}:`, error);
          return {
            name: slug,
            slug: slug,
            description: `${slug} toolkit`,
            logo: null,
            categories: [],
            isConnected: false,
            connectionId: undefined,
          };
        }
      });

      const toolkits = await Promise.all(toolkitPromises);
      return { toolkits };
    } catch (error) {
      console.error('Error fetching toolkits:', error);
      return { toolkits: [] };
    }
  }
}

const composioService = new ComposioService();
export default composioService;