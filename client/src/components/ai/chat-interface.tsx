"use client";

import { useChat } from '@ai-sdk/react';
import { ChatMessage } from './chat-message';
import { Input } from '@/components/ai/chat-input';
import { useEffect, useRef } from 'react';
import { DefaultChatTransport } from 'ai';

export function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isAutoScrollingRef = useRef(true);

  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.SERVER_URL ?? 'http://localhost:4000'}/api/chat`,
    }),
  });

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current && isAutoScrollingRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end' 
      });
    }
  };

  // Auto-scroll when messages change
  useEffect(() => {
    if (isAutoScrollingRef.current) {
      // Small delay to ensure DOM is updated
      const timeoutId = setTimeout(scrollToBottom, 10);
      return () => clearTimeout(timeoutId);
    }
  }, [messages]);

  // Auto-scroll during streaming
  useEffect(() => {
    if (status === 'streaming' && isAutoScrollingRef.current) {
      const scrollInterval = setInterval(scrollToBottom, 100); 
      return () => clearInterval(scrollInterval);
    }
  }, [status]); 

  useEffect(() => {
    if (status === 'streaming' && isAutoScrollingRef.current) {
      scrollToBottom();
    }
  }, [messages, status]);

  // Window scroll detection
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

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      isAutoScrollingRef.current = true;
      sendMessage({ text: message });
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">    
      <div className="max-w-4xl mx-auto px-4 pt-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>Start a conversation with the AI assistant</p>
          </div>
        )}
        
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {status === 'streaming' && (
          <div className="flex justify-end">
            <button
              onClick={stop}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Stop generating
            </button>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Error: {error.message}</p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Fixed input at bottom - positioned absolutely within the SidebarInset context */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10" 
           style={{ marginLeft: 'var(--sidebar-width, 0px)' }}>
        <div className="max-w-4xl mx-auto">
          <Input 
            onSendMessage={handleSendMessage}
            disabled={status === 'streaming'}
            isLoading={status === 'streaming'}
          />
        </div>
      </div>
    </div>
  );
}