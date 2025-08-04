import { ChatInterface } from '@/components/chat/chat-interface';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

interface ChatPageProps {
  params: {
    id: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { id } = await params;

  if (!user) {
    redirect('/login');
  }

  return <ChatInterface conversationId={id} />;
}
