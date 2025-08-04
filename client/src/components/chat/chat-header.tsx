import { MessageCircle } from 'lucide-react';

export function ChatHeader() {
  return (
    <div className="border-b bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
          <MessageCircle size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">AI Assistant</h1>
          <p className="text-sm text-gray-500">Ask me anything!</p>
        </div>
      </div>
    </div>
  );
}