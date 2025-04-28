import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, ArrowUp, Zap, BookOpen, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TouchFeedback } from '@/components/ui/ios-feedback';
import ChatSession from '@/components/ChatSession';
import { useIsMobile } from '@/hooks/use-mobile';

interface Message {
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatPanelProps {
  messages: Message[];
  userInput: string;
  setUserInput: (input: string) => void;
  handleSendMessage: () => void;
  isGenerating: boolean;
  isRecording: boolean;
  toggleSpeechRecognition: () => void;
  transcript: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  userInput,
  setUserInput,
  handleSendMessage,
  isGenerating,
  isRecording,
  toggleSpeechRecognition,
  transcript
}) => {
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [quickActionsExpanded, setQuickActionsExpanded] = React.useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 15 }}
    >
      <div className="flex-1 overflow-y-auto p-4">
        <ChatSession 
          messages={messages} 
          onSavePreset={() => {}}
        />
        <div ref={messagesEndRef} />
      </div>
      
      {isMobile && quickActionsExpanded && (
        <div className="p-2 border-t flex items-center gap-1 overflow-x-auto bg-background/95 backdrop-blur-sm">
          <TouchFeedback>
            <Button
              size="sm"
              variant="outline"
              className="whitespace-nowrap"
              onClick={() => {
                setUserInput(userInput + " Generate a full arrest narrative");
                setQuickActionsExpanded(false);
              }}
            >
              <Zap className="h-3.5 w-3.5 mr-1" />
              Full Arrest
            </Button>
          </TouchFeedback>
          <TouchFeedback>
            <Button
              size="sm"
              variant="outline"
              className="whitespace-nowrap"
              onClick={() => {
                setUserInput(userInput + " Generate a chest pain narrative");
                setQuickActionsExpanded(false);
              }}
            >
              <svg className="h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8h8"></path>
                <path d="M18 16v-2"></path>
                <path d="M18 20v-2"></path>
              </svg>
              Chest Pain
            </Button>
          </TouchFeedback>
          <TouchFeedback>
            <Button
              size="sm"
              variant="outline"
              className="whitespace-nowrap"
              onClick={() => {
                setUserInput(userInput + " Generate a trauma narrative");
                setQuickActionsExpanded(false);
              }}
            >
              <svg className="h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
              Trauma
            </Button>
          </TouchFeedback>
        </div>
      )}
      
      <div className={`${isMobile ? 'p-2' : 'p-4'} border-t border-gray-200 dark:border-gray-700`}>
        <div className="relative">
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={isRecording ? 'Listening...' : 'Type your message here or ask for help...'}
            className={`min-h-[${isMobile ? '50' : '60'}px] ${isMobile ? 'text-base' : ''} pr-24 ${isRecording ? 'bg-red-50 dark:bg-red-900/10' : ''}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          {transcript && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-gray-100 dark:bg-gray-800 p-2 rounded-md text-sm">
              {transcript}
            </div>
          )}
          
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            {isMobile && (
              <TouchFeedback feedbackColor="#6366f1">
                <Button
                  onClick={() => setQuickActionsExpanded(!quickActionsExpanded)}
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8"
                  title="Quick actions"
                  aria-label="Quick actions"
                >
                  <Zap className="h-4 w-4" />
                </Button>
              </TouchFeedback>
            )}
            
            <TouchFeedback feedbackColor="#6366f1">
              <Button
                onClick={toggleSpeechRecognition}
                variant={isRecording ? "destructive" : "secondary"}
                size="icon"
                className="h-8 w-8"
                title={isRecording ? 'Stop recording' : 'Start voice recording'}
                aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </TouchFeedback>
            
            <TouchFeedback feedbackColor="#4f46e5">
              <Button
                onClick={handleSendMessage}
                disabled={isGenerating || !userInput.trim()}
                className="h-8 w-8 button-gradient"
                aria-label="Send message"
              >
                {isGenerating ? 
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : 
                  <ArrowUp className="h-4 w-4" />
                }
              </Button>
            </TouchFeedback>
          </div>
        </div>
        
        {!isMobile && (
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
            <div>
              <span>
                Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700">Enter</kbd> to send
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                className="text-ems-600 dark:text-ems-400 hover:underline flex items-center"
                onClick={() => {
                  setUserInput("Generate a narrative");
                }}
              >
                <Zap className="h-3 w-3 mr-1" />
                <span>Generate Narrative</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatPanel;