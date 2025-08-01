"use client"

import { useAuth } from '@/components/contexts/auth-context';
import LandingPage from '@/components/home/landing-page';
import { api } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import Input from '@/components/ai/ai-input';

export default function Home() {
  const { user } = useAuth();

  const { data: AIResponse, isLoading, error} = useQuery({
    queryKey: ['hello'],
    queryFn: () => api.post('/api/chat', { message: 'Hello, how are you?' }),
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
      <Input />
      {AIResponse?.response}
    </div>
  );
}
