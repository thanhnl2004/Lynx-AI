import { Request, Response } from "express";
import composioService from "../services/composio.service.js";

interface ComposioInitiateConnectionRequest extends Request {
  body: {
    userId: string;
    authConfigId: string;
  };
  query: {
    userId?: string;
    authConfigId?: string;
  }
}

const initiateConnection = async (req: ComposioInitiateConnectionRequest, res: Response) => {
  try {
    const { userId, authConfigId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
  
    const configId = authConfigId || process.env.COMPOSIO_GMAIL_AUTH_CONFIG_ID;
    if (!configId) {
      return res.status(500).json({ error: 'Auth config ID is required' });
    }
  
    const connectionRequest = await composioService.initiateConnection(userId, configId);
    res.status(200).json({
      success: true,
      redirectUrl: (connectionRequest as any).redirectUrl,
      connectionId: (connectionRequest as any).id,
    });
  } catch (error) {
    console.error('Error initiating Composio connection:', error);
    res.status(500).json({ error: 'Failed to initiate Composio connection' });
  }
}

const getConnectionStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const tools = await composioService.getTools(userId as string, "GMAIL_SEND_EMAIL");

    res.status(200).json({
      connected: tools && Object.keys(tools).length > 0,
      tools: tools || {},
    });
  } catch (error) {
    console.error('Error fetching Composio tools:', error);
    res.status(500).json({ error: 'Failed to fetch Composio tools' });
  }
}

export { initiateConnection, getConnectionStatus };