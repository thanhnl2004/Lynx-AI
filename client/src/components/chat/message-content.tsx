import { UIMessage } from 'ai';
import { MemoizedMarkdown } from '@/components/chat/memoized-markdown';

interface MessageContentProps {
  message: UIMessage;
}

export function MessageContent({ message }: MessageContentProps) {
  return (
    <div className="whitespace-pre-wrap">
      {message.parts.map((part) => {
        if (part.type === 'text') {
          return (
            <MemoizedMarkdown 
              content={part.text} 
              id={message.id}
              key={`${message.id}-text`} 
            />
          );
        }
        
        // Handle other part types if needed (files, tool calls, etc.)
        return null;
      })}
    </div>
  );
}