"use client"

import { useAuth } from '@/app/contexts/auth-context';
import LandingPage from '@/components/home/landing-page';
import { api } from '@/utils/api';

import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const { user } = useAuth();

  const { data: helloData, isLoading, error} = useQuery({
    queryKey: ['hello'],
    queryFn: () => api.get('/api/hello'),
    enabled: !!user,
  })

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen">
      <h1>This is the dashboard</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {helloData && <p>{helloData.message}</p>}
    </div>
  );
}
