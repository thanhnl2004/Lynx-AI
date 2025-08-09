import LandingPage from '@/components/landing/landing-page';
import { createClient } from '@/utils/supabase/server';
import { ChatInterface } from '@/components/chat/chat-interface';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <LandingPage />;
  }

  return <ChatInterface conversationId=''/>;
}
