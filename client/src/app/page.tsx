import { ChatInterface } from '@/components/ai/chat-interface';
import LandingPage from '@/components/home/landing-page';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <LandingPage />
  }

  return <ChatInterface />;
}
