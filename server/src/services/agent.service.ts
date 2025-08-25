import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";

class AgentService {
  private composio: Composio<VercelProvider>;

  constructor() {
    this.composio = new Composio({
      apiKey: process.env.COMPOSIO_API_KEY,
      provider: new VercelProvider(),
    });
  }

  async initiateConnection(userEmail: string, authConfigId: string) {

    const connectionRequest = await this.composio.connectedAccounts.initiate(
      userEmail,
      authConfigId,
    );

    const redirectUrl = connectionRequest.redirectUrl;
    console.log(redirectUrl);

    const connectedAccount = await connectionRequest.waitForConnection();

  }

  async getTools(userEmail: string, toolName: string) {
    return await this.composio.tools.get(userEmail, toolName);
  }
}

const agentService = new AgentService();
export default agentService;