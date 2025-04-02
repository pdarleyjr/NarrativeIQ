
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface Message {
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatSessionProps {
  messages: Message[];
  onSavePreset?: () => void;
}

const ChatSession: React.FC<ChatSessionProps> = ({ messages, onSavePreset }) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-6">
          <h3 className="font-semibold text-lg mb-2">Welcome to EMS Narrative Generator</h3>
          <p className="text-muted-foreground mb-4">
            Fill in the narrative details in the form below and click "Generate" to create a new narrative,
            or ask a question in the chat to get assistance.
          </p>
          {onSavePreset && (
            <Button variant="outline" onClick={onSavePreset} className="mt-2">
              Load Saved Preset
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full px-4 py-6">
      <div className="flex flex-col gap-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className="text-xs text-gray-400 mt-1">{message.timestamp}</div>
              {message.type === 'assistant' && (
                <div className="flex justify-end mt-2 gap-2">
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                    View in Analysis
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                    Save as Preset
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatSession;
