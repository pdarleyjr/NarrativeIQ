
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, FileEdit } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface NarrativeItem {
  id: string;
  title: string;
  created_at: string;
}

const SavedNarrativesList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedNarratives, setSavedNarratives] = useState<NarrativeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchNarratives = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('narratives')
          .select('id, title, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (error) {
          console.error('Error fetching narratives:', error);
          return;
        }
        
        setSavedNarratives(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNarratives();
  }, [user]);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  const handleViewNarrative = (id: string) => {
    navigate(`/view-narrative/${id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Narratives</CardTitle>
        <CardDescription>
          Review and export your previously generated reports
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ems-600"></div>
          </div>
        ) : savedNarratives.length > 0 ? (
          <ul className="space-y-3">
            {savedNarratives.map((item) => (
              <li key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <FileText className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(item.created_at)}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleViewNarrative(item.id)}
                  className="flex items-center gap-1"
                >
                  <FileEdit className="h-3.5 w-3.5" />
                  View
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p>No narratives saved yet</p>
            <p className="text-sm mt-2">Generated narratives will appear here</p>
          </div>
        )}
        
        {savedNarratives.length > 0 && (
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => navigate('/create-narrative')}
          >
            Create New Narrative
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedNarrativesList;
