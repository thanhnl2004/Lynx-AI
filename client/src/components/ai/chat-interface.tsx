"use client";

import { useChat } from '@ai-sdk/react';
import { ChatMessage } from './chat-message';
import { Input } from '@/components/ai/chat-input';
import { DefaultChatTransport } from 'ai';

export function ChatInterface() {
  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: 'http://localhost:4000/api/chat',
    }),
  });

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      sendMessage({ text: message });
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white">    
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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