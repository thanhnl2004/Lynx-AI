"use client";

import { useChat } from '@ai-sdk/react';
import { ChatMessage } from './chat-message';
import { Input } from '@/components/ai/chat-input';
import { useEffect, useRef } from 'react';
import { DefaultChatTransport } from 'ai';

export function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
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
      }, 100); // Scroll every 100ms during streaming

      return () => clearInterval(scrollInterval);
    }
  }, [status]);

  // Handle manual scrolling - disable auto-scroll if user scrolls up
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    // Enable auto-scroll if user is near bottom, disable if they scroll up
    isAutoScrollingRef.current = isNearBottom;
  };

  // Re-enable auto-scroll when new message is sent
  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      isAutoScrollingRef.current = true; // Always auto-scroll for new messages
      sendMessage({ text: message });
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white">    
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onScroll={handleScroll}
      >
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
      
      <div className="border-t bg-gray-50 p-4">
        <Input 
          onSendMessage={handleSendMessage}
          disabled={status === 'streaming'}
          isLoading={status === 'streaming'}
        />
      </div>
    </div>
  );
}