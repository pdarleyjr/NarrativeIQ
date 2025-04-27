import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryProtocol, formatProtocolSnippets, ProtocolQueryResponse } from '@/lib/protocolService';
import { getUserKbPreferences } from '@/lib/knowledgeBaseService';
import { supabase } from '@/lib/supabase';

export function ProtocolQuery() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a question',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to use this feature',
          variant: 'destructive',
        });
        return;
      }
      
      // Get user's knowledge base preferences
      const preferences = await getUserKbPreferences(user.id);
      
      if (!preferences || preferences.selected_sources.length === 0) {
        toast({
          title: 'Warning',
          description: 'No knowledge base sources selected. Please select at least one source in Settings.',
          variant: 'destructive',
        });
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
      toast({
        title: 'Error',
        description: 'Failed to query protocol. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Protocol Q&A</CardTitle>
        <CardDescription>
          Ask questions about EMS protocols and guidelines
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}

export default ProtocolQuery;