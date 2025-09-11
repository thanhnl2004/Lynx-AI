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
    connectionId?: string;
  }
}

class ComposioController {
  private composioService: typeof composioService;

  constructor() {
    this.composioService = composioService;
  }
  initiateConnection = async (req: ComposioInitiateConnectionRequest, res: Response) => {
    try {
      const { userId, authConfigId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
    
      const configId = authConfigId || process.env.COMPOSIO_GMAIL_AUTH_CONFIG_ID;
      if (!configId) {
        return res.status(500).json({ error: 'Auth config ID is required' });
      }
    
      const connectionRequest = await this.composioService.initiateConnection(userId, configId);
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

  checkConnectionStatus = async (req: Request, res: Response) => {
    try {
      const { connectionId } = req.query;
      if (!connectionId) {
        return res.status(400).json({ error: 'Connection ID is required' });
      }
  
      const connection = await this.composioService.checkConnectionStatus(connectionId as string);
      res.status(200).json(connection);
    } catch (error) {
      console.error('Error checking Composio connection status:', error);
      res.status(500).json({ error: 'Failed to check Composio connection status' });
    }
  }


  deleteConnection = async (req: Request, res: Response) => {
    try {
      const { connectionId } = req.query;
      if (!connectionId) {
        return res.status(400).json({ error: 'Connection ID is required' });
      }
      await this.composioService.deleteConnection(connectionId as string);
      res.status(200).json({ 
        success: true,
        message: 'Connection deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting Composio connection:', error);
      res.status(500).json({ error: 'Failed to delete Composio connection' });
    }
  }

  getToolkits = async (req: Request, res: Response) => {
    try {
      console.log('getToolkits: Request received with query:', req.query);
      const { userId } = req.query;
      if (!userId) {
        console.log('getToolkits: User ID missing');
        return res.status(400).json({ error: 'User ID is required' });
      }

      console.log('getToolkits: Fetching toolkits for user:', userId);
      const toolkits = await this.composioService.getToolKits(userId as string);
      console.log('getToolkits: Result:', toolkits);
      res.status(200).json(toolkits);
    } catch (error) {
      console.error('Error fetching toolkits:', error);
      res.status(500).json({ error: 'Failed to fetch toolkits' });
    }
  }
}



const composioController = new ComposioController();
export default composioController;