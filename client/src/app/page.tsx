"use client"

import { useAuth } from '@/components/contexts/auth-context';
import LandingPage from '@/components/home/landing-page';
import { ChatInterface } from '@/components/ai/chat-interface';
export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ChatInterface />
    </div>
  );
}
