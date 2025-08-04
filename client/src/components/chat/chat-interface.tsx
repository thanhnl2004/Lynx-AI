"use client";

import { useChat } from '@ai-sdk/react';
import { ChatMessage } from './chat-message';
import { Input } from '@/components/chat/chat-input';
import { useEffect, useRef, useState } from 'react';
import { DefaultChatTransport } from 'ai';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useGetConversationById, useCreateConversation } from '@/hooks/use-convo';
import { CustomUIMessage, convertPrismaMessagesToUIMessages } from '@/types/message';
interface ChatInterfaceProps {
  conversationId: string;
}

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isAutoScrollingRef = useRef(true);
  const lastUserMessageRef = useRef<HTMLDivElement>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  
  const { user } = useAuth(); 
  const router = useRouter();
  const createConversation = useCreateConversation();

  const { data: conversation } = useGetConversationById(currentConversationId);

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.SERVER_URL ?? 'http://localhost:4000'}/api/chat`,
      body: (messages: CustomUIMessage[]) => ({
        messages,
        userId: user?.id,
        conversationId: conversationId,
      }),
    }),
  });

  useEffect(() => {
    if (conversation?.messages && conversation.messages.length > 0) {
      const uiMessages = convertPrismaMessagesToUIMessages(conversation.messages);

      setMessages(uiMessages);
    }
  }, [conversation, setMessages])

  const scrollToBottom = () => {
    if (messagesEndRef.current && isAutoScrollingRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end' 
      });
    }
  };

  const scrollToLastUserMessage = () => {
    if (lastUserMessageRef.current) {
      lastUserMessageRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      });
    }
  };

  useEffect(() => {
    if (isAutoScrollingRef.current && status !== 'streaming') {
      const timeoutId = setTimeout(scrollToBottom, 10);
      return () => clearTimeout(timeoutId);
    }
  }, [messages, status]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      const distanceFromBottom = documentHeight - scrollTop - windowHeight;
      isAutoScrollingRef.current = distanceFromBottom < 200;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSendMessage = async (message: string) => {
    if (message.trim()) {
      const wasScrolledUp = !isAutoScrollingRef.current;

      if (!currentConversationId) {
        try {
          const newConversation = await createConversation.mutateAsync(message);
          setCurrentConversationId(newConversation.id);
          router.push(`/chat/${newConversation.id}`);
        } catch (error) {
          console.error('Error creating conversation:', error);
        }
      }
      
      sendMessage({ text: message });
      
      if (wasScrolledUp) {
        isAutoScrollingRef.current = false;
        setTimeout(scrollToLastUserMessage, 100);
      } else {
        isAutoScrollingRef.current = true;
      }
    }
  };

  const lastUserMessage = messages.filter(m => m.role === 'user').slice(-1)[0];

  return (
    <div className="min-h-screen bg-white pb-32">    
      <div className="px-4 pt-4 space-y-4">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p>Start a conversation with the AI assistant</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div 
              key={message.id}
              ref={message.id === lastUserMessage?.id && message.role === 'user' ? lastUserMessageRef : null}
              className="mb-4"
            >
              <ChatMessage message={message} status={status} />
            </div>
          ))}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700">Error: {error.message}</p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white p-6 z-10" 
           style={{ marginLeft: 'var(--sidebar-width, 0px)' }}>
        <Input 
          onSendMessage={handleSendMessage}
          disabled={status === 'streaming'}
          isLoading={status === 'streaming'}
        />
      </div>
    </div>
  );
}