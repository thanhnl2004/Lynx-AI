import { UIMessage } from 'ai';
import { MessageContent } from '@/components/chat/message-content';

interface ChatMessageProps {
  message: UIMessage;
  status?: string;
}

export function ChatMessage({ message, status }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block p-3 rounded-lg ${
          isUser 
            ? 'bg-blue-500 text-white rounded-br-sm' 
            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
        }`}>
          <MessageContent message={message} />
        </div>
        {status && (
          <div className="text-xs text-gray-500">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}