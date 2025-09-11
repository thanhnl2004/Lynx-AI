import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';

interface Toolkit {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  isConnected: boolean;
  connectionId?: string;
}

export function useToolkits() {
  const [toolkits, setToolkits] = useState<Toolkit[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchToolkits = useCallback(async () => {
    if (!user?.id) {
      console.log('fetchToolkits: No user ID');
      return;
    }
    
    console.log('fetchToolkits: Starting for user:', user.id);
    setLoading(true);
    try {
      const url = `${process.env.SERVER_URL ?? "http://localhost:4000"}/api/composio/toolkits?userId=${user.id}`;
      console.log('fetchToolkits: Calling API:', url);
      
      const response = await fetch(url);
      console.log('fetchToolkits: Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('fetchToolkits: Response data:', data);
        console.log('fetchToolkits: Setting toolkits to:', data.toolkits);
        setToolkits(data.toolkits || []);
        console.log('fetchToolkits: State should be updated');
      } else {
        const errorText = await response.text();
        console.error('fetchToolkits: API error:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error fetching toolkits:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    console.log('useToolkits useEffect triggered, user.id:', user?.id);
    fetchToolkits();
  }, [fetchToolkits]);

  const getEnabledToolkits = () => {
    return toolkits.filter(t => t.isConnected).map(t => t.slug.toUpperCase());
  };

  return {
    toolkits,
    loading,
    fetchToolkits,
    getEnabledToolkits,
  };
}
