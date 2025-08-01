import { Plus, Mic, Globe, ChevronDown, Send, Loader2 } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
} 

export const Input = ({ 
  onSendMessage, 
  disabled, 
  isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex flex-col bg-gray-50 border shadow-md rounded-2xl px-4 py-3 gap-6 max-w-4xl mx-auto">
      <input 
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask anything"
        className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base"
        onKeyDown={handleKeyPress}
        disabled={disabled}
      />
      <div className="flex justify-between">
        <div className="flex items-center gap-6">
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <Plus size={20} />
          </button>
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <Mic size={20} />
          </button>
          <div className="flex items-center gap-2 text-gray-600">
            <Globe size={20} />
            <span className="text-sm font-medium">Search</span>
          </div>
          <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors">
            <span className="text-sm font-medium">GPT-4</span>
            <ChevronDown size={16} />
          </button>
        </div>
        <button
          className="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-lg transition-colors"
          disabled={!message.trim()}
          onClick={handleSubmit}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
};
