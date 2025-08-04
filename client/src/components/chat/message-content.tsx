import { UIMessage } from 'ai';

interface MessageContentProps {
  message: UIMessage;
}

export function MessageContent({ message }: MessageContentProps) {
  return (
    <div className="whitespace-pre-wrap">
      {message.parts.map((part, index) => {
        if (part.type === 'text') {
          return (
            <span key={index}>
              {part.text}
            </span>
          );
        }
        
        // Handle other part types if needed (files, tool calls, etc.)
        return null;
      })}
    </div>
  );
}