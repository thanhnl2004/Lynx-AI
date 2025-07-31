"use client"

import { useAuth } from '@/app/contexts/auth-context';
import LandingPage from '@/components/home/landing-page';
import { api } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import LLMInput from '@/components/ui/AI/ai-input';

export default function Home() {
  const { user } = useAuth();

  const { data: helloData, isLoading, error} = useQuery({
    queryKey: ['hello'],
    queryFn: () => api.post('/api/ai/chat', { message: 'Hello, how are you?' }),
    enabled: !!user,
  })

  if (!user) {
    return <LandingPage />;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen">
      <LLMInput />
      {helloData && <p>{helloData.response}</p>}
    </div>
  );
}
