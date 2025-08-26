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

    const redirectUrl = connectionRequest.redirectUrl;
    console.log(redirectUrl);

    const connectedAccount = await connectionRequest.waitForConnection();
    return connectedAccount;
  }

  async getTools(userId: string, toolName: string) {
    return await this.composio.tools.get(userId, toolName);
  }
}

const composioService = new ComposioService();
export default composioService;