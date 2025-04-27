import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, X } from 'lucide-react';
import { 
  getKnowledgeBaseSources, 
  getUserKbPreferences, 
  saveUserKbPreferences,
  KnowledgeBaseSource
} from '@/lib/knowledgeBaseService';
import { supabase } from '@/lib/supabase';

interface NarrativeKnowledgeBaseSelectorProps {
  onPreferencesChange?: (selectedSources: string[], useWebSearch: boolean) => void;
}

export function NarrativeKnowledgeBaseSelector({ onPreferencesChange }: NarrativeKnowledgeBaseSelectorProps) {
  const [sources, setSources] = useState<KnowledgeBaseSource[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [useWebSearch, setUseWebSearch] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Fetch knowledge base sources and user preferences
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Get all available knowledge base sources
        const availableSources = await getKnowledgeBaseSources();
        setSources(availableSources);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get user preferences
          const preferences = await getUserKbPreferences(user.id);
          
          if (preferences) {
            setSelectedSources(preferences.selected_sources);
            setUseWebSearch(preferences.use_web_search);
          } else {
            // Default to all sources selected
            setSelectedSources(availableSources.map(source => source.id));
          }
        }
      } catch (error) {
        console.error('Error fetching knowledge base data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load knowledge base options',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [toast]);

  // Handle source selection change
  const handleSourceChange = (sourceId: string, checked: boolean) => {
    setSelectedSources(prev => {
      if (checked) {
        return [...prev, sourceId];
      } else {
        return prev.filter(id => id !== sourceId);
      }
    });
  };

  // Handle web search toggle
  const handleWebSearchChange = (checked: boolean) => {
    setUseWebSearch(checked);
  };

  // Save preferences
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await saveUserKbPreferences(user.id, selectedSources, useWebSearch);
        
        toast({
          title: 'Success',
          description: 'Knowledge base preferences saved',
        });
        
        // Notify parent component if callback provided
        if (onPreferencesChange) {
          onPreferencesChange(selectedSources, useWebSearch);
        }
      }
    } catch (error) {
      console.error('Error saving knowledge base preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save preferences',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Remove a source from selection
  const removeSource = (sourceId: string) => {
    setSelectedSources(prev => prev.filter(id => id !== sourceId));
  };

  // Get source name by ID
  const getSourceName = (sourceId: string) => {
    const source = sources.find(s => s.id === sourceId);
    return source?.name || sourceId;
  };

  // Group sources by category
  const nationalProtocols = sources.filter(source => 
    source.name.toLowerCase().includes('national'));
  
  const southFloridaProtocols = sources.filter(source => 
    source.name.toLowerCase().includes('south florida') || 
    source.name.toLowerCase().includes('regional'));
  
  const nfirsProtocols = sources.filter(source => 
    source.name.toLowerCase().includes('nfirs'));
  
  const otherProtocols = sources.filter(source => 
    !source.name.toLowerCase().includes('national') && 
    !source.name.toLowerCase().includes('south florida') && 
    !source.name.toLowerCase().includes('regional') &&
    !source.name.toLowerCase().includes('nfirs'));

  // Toggle all sources in a group
  const toggleGroup = (groupSources: KnowledgeBaseSource[], checked: boolean) => {
    const groupIds = groupSources.map(source => source.id);
    
    if (checked) {
      // Add all sources from the group that aren't already selected
      setSelectedSources(prev => {
        const newSelection = [...prev];
        groupIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    } else {
      // Remove all sources from the group
      setSelectedSources(prev => prev.filter(id => !groupIds.includes(id)));
    }
  };

  // Check if all sources in a group are selected
  const isGroupSelected = (groupSources: KnowledgeBaseSource[]) => {
    const groupIds = groupSources.map(source => source.id);
    return groupIds.every(id => selectedSources.includes(id));
  };

  // Check if some sources in a group are selected
  const isGroupPartiallySelected = (groupSources: KnowledgeBaseSource[]) => {
    const groupIds = groupSources.map(source => source.id);
    return groupIds.some(id => selectedSources.includes(id)) && 
           !groupIds.every(id => selectedSources.includes(id));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Knowledge Base Selection</CardTitle>
        <CardDescription>
          Select which knowledge bases to use for narrative generation
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Selected Sources Chips */}
            {selectedSources.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedSources.map(sourceId => (
                  <Badge key={sourceId} variant="secondary" className="flex items-center gap-1">
                    {getSourceName(sourceId)}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeSource(sourceId)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="space-y-4">
              {/* National EMS Protocols Group */}
              {nationalProtocols.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">National EMS Protocols</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="national-protocols-group"
                      checked={isGroupSelected(nationalProtocols) || isGroupPartiallySelected(nationalProtocols)}
                      onCheckedChange={(checked) => 
                        toggleGroup(nationalProtocols, checked === true)
                      }
                    />
                    <Label htmlFor="national-protocols-group" className="text-sm">
                      National EMS Protocols
                    </Label>
                  </div>
                </div>
              )}
              
              {/* South Florida Protocols Group */}
              {southFloridaProtocols.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">South Florida EMS Protocols</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="south-florida-protocols-group"
                      checked={isGroupSelected(southFloridaProtocols) || isGroupPartiallySelected(southFloridaProtocols)}
                      onCheckedChange={(checked) => 
                        toggleGroup(southFloridaProtocols, checked === true)
                      }
                    />
                    <Label htmlFor="south-florida-protocols-group" className="text-sm">
                      South Florida EMS Protocols
                    </Label>
                  </div>
                </div>
              )}
              
              {/* NFIRS Group */}
              {nfirsProtocols.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">NFIRS</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="nfirs-protocols-group"
                      checked={isGroupSelected(nfirsProtocols) || isGroupPartiallySelected(nfirsProtocols)}
                      onCheckedChange={(checked) => 
                        toggleGroup(nfirsProtocols, checked === true)
                      }
                    />
                    <Label htmlFor="nfirs-protocols-group" className="text-sm">
                      NFIRS Documentation
                    </Label>
                  </div>
                </div>
              )}
              
              {/* Web Search Option */}
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <Label htmlFor="web-search" className="text-sm">
                    The Web
                  </Label>
                  <Switch 
                    id="web-search"
                    checked={useWebSearch}
                    onCheckedChange={handleWebSearchChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleSave} 
                disabled={saving}
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Preferences
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}