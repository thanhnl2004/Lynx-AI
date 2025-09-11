"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToolkits } from "@/hooks/use-toolkits";

interface Toolkit {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  isConnected: boolean;
  connectionId?: string;
}

export function ConnectGmail() {
  const [connecting, setConnecting] = useState(false);
  const { user } = useAuth();
  const { toolkits, loading, fetchToolkits } = useToolkits();

  const handleConnect = async () => {
    if (!user?.id) return;
    
    setConnecting(true);
    try {
      // Check if auth config ID is available
      const authConfigId = process.env.NEXT_PUBLIC_GMAIL_AUTH_CONFIG_ID;
      if (!authConfigId) {
        console.error('Gmail auth config ID not found in environment variables');
        alert('Gmail auth config ID not configured. Please check your environment variables.');
        setConnecting(false);
        return;
      }

      console.log('Initiating Gmail connection for user:', user.id);
      
      // Initiate connection
      const response = await fetch(
        `${process.env.SERVER_URL ?? "http://localhost:4000"}/api/composio/connect`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
            body: JSON.stringify({
              userId: user.id,
              authConfigId: authConfigId,
            }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Connection initiation response:', data);
        
        // Open OAuth window
        const authWindow = window.open(
          data.redirectUrl,
          'composio-auth',
          'width=600,height=600,scrollbars=yes,resizable=yes'
        );

        // Poll for connection completion
        const pollConnection = async () => {
          try {
            const statusResponse = await fetch(
              `${process.env.SERVER_URL ?? "http://localhost:4000"}/api/composio/status?connectionId=${data.connectionId}`
            );
            
            if (statusResponse.ok) {
              const statusData = await statusResponse.json();
              
              if (statusData.status === 'active') {
                authWindow?.close();
                fetchToolkits(); // Refresh toolkit status
                setConnecting(false);
                return;
              }
            }
            
            // Continue polling if window is still open
            if (authWindow && !authWindow.closed) {
              setTimeout(pollConnection, 2000);
            } else {
              setConnecting(false);
            }
          } catch (error) {
            console.error('Error polling connection:', error);
            setConnecting(false);
          }
        };

        pollConnection();
      } else {
        const errorData = await response.text();
        console.error('Failed to initiate connection:', response.status, errorData);
        alert(`Failed to initiate connection: ${response.status} - ${errorData}`);
        setConnecting(false);
      }
    } catch (error) {
      console.error('Error connecting to Gmail:', error);
      setConnecting(false);
    }
  };

  const handleDisconnect = async (toolkit: Toolkit) => {
    if (!toolkit.connectionId) return;
    
    setConnecting(true);
    try {
      const response = await fetch(
        `${process.env.SERVER_URL ?? "http://localhost:4000"}/api/composio/delete?connectionId=${toolkit.connectionId}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        fetchToolkits(); // Refresh toolkit status
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
    } finally {
      setConnecting(false);
    }
  };

  const gmailToolkit = toolkits.find(t => t.slug.toUpperCase() === 'GMAIL');
  
  // Debug logging (reduced)
  console.log('ConnectGmail: Gmail toolkit status:', {
    found: !!gmailToolkit,
    connected: gmailToolkit?.isConnected,
    totalToolkits: toolkits.length
  });

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!gmailToolkit) {
    return (
      <div className="flex flex-col items-start gap-1 px-3 py-1 max-w-xs">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <span className="text-sm text-gray-600">Gmail unavailable</span>
        </div>
        <div className="text-xs text-gray-500">
          Debug: {toolkits.length} toolkits loaded, User: {user?.id ? 'Yes' : 'No'}, 
          AuthConfig: {process.env.NEXT_PUBLIC_GMAIL_AUTH_CONFIG_ID ? 'Set' : 'Missing'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {gmailToolkit.isConnected ? (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Gmail Connected
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDisconnect(gmailToolkit)}
            disabled={connecting}
            className="h-6 px-2 text-xs"
          >
            Disconnect
          </Button>
        </div>
      ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleConnect()}
            disabled={connecting}
            className="flex items-center gap-2 h-6 px-2 text-xs"
        >
          {connecting ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Mail className="h-3 w-3" />
          )}
          {connecting ? 'Connecting...' : 'Connect Gmail'}
        </Button>
      )}
    </div>
  );
}
