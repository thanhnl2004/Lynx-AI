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

  // Auto-scroll to bottom when messages change or during streaming
  useEffect(() => {
    if (isAutoScrollingRef.current) {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end' 
      });
    }
  }, [messages, status]);

  // Auto-scroll during streaming with more frequent updates
  useEffect(() => {
    if (status === 'streaming') {
      const scrollInterval = setInterval(() => {
        if (isAutoScrollingRef.current) {
          messagesEndRef.current?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'end' 
          });
        }
      }, 100);

      return () => clearInterval(scrollInterval);
    }
  }, [status]);

  // Handle manual scrolling - disable auto-scroll if user scrolls up
  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    const isNearBottom = documentHeight - scrollTop - windowHeight < 100;
    
    // Enable auto-scroll if user is near bottom, disable if they scroll up
    isAutoScrollingRef.current = isNearBottom;
  };

  // Add scroll listener to window
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Re-enable auto-scroll when new message is sent
  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      isAutoScrollingRef.current = true;
      sendMessage({ text: message });
    }
  };

  return (
    <div className="min-h-screen bg-white">    
      {/* Messages area - no overflow hidden, let page scroll naturally */}
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-32 space-y-4">
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
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Fixed input at bottom */}
      <div className="fixed bottom-6 left-0 right-0 px-4 z-10">
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