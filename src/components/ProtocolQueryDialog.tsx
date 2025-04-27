import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { queryProtocol, formatProtocolSnippets, ProtocolQueryResponse } from '@/lib/protocolService';
import { getUserKbPreferences } from '@/lib/knowledgeBaseService';
import { supabase } from '@/lib/supabase';

interface ProtocolQueryDialogProps {
  onClose: () => void;
  onAddToChat?: (content: string) => void;
}

export function ProtocolQueryDialog({ onClose, onAddToChat }: ProtocolQueryDialogProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setAnswer("Error: You must be logged in to use this feature.");
        return;
      }
      
      // Get user's knowledge base preferences
      const preferences = await getUserKbPreferences(user.id);
      
      if (!preferences || preferences.selected_sources.length === 0) {
        setAnswer("No knowledge base sources selected. Please select at least one source in Settings > Knowledge Base.");
        return;
      }
      
      // Query the protocol
      const response = await queryProtocol(
        question,
        preferences.selected_sources,
        5
      );
      
      // Format the response
      const formattedAnswer = formatProtocolSnippets(response.snippets);
      setAnswer(formattedAnswer);
      
    } catch (error) {
      console.error('Error querying protocol:', error);
      setAnswer(`Error querying protocol: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToChat = () => {
    if (onAddToChat && answer) {
      const content = `**Protocol Query:** ${question}\n\n${answer}`;
      onAddToChat(content);
      onClose();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Protocol Q&A</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Enter your protocol question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={loading || !question.trim()}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Searching...' : 'Search Protocols'}
          </Button>
        </div>
        
        {answer && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <h3 className="text-sm font-medium mb-2">Protocol Information:</h3>
            <div className="whitespace-pre-wrap text-sm">
              {answer}
            </div>
          </div>
        )}
      </form>
      
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        {answer && onAddToChat && (
          <Button onClick={handleAddToChat}>
            Add to Chat
          </Button>
        )}
      </div>
    </div>
  );
}

export default ProtocolQueryDialog;