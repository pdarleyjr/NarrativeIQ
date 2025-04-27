import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Plus, Trash2, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Template {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface CustomInstructionsDialogProps {
  onClose: () => void;
  onAddToChat: (content: string) => void;
}

const CustomInstructionsDialog: React.FC<CustomInstructionsDialogProps> = ({
  onClose,
  onAddToChat
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to access templates');
        return;
      }
      
      // Fetch templates
      const { data, error } = await supabase
        .from('narrative_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching templates:', error);
        toast.error('Failed to load templates');
        return;
      }
      
      setTemplates(data || []);
    } catch (error) {
      console.error('Error in fetchTemplates:', error);
      toast.error('An error occurred while loading templates');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please provide both a title and content');
      return;
    }
    
    try {
      setSaving(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to save templates');
        return;
      }
      
      // Save template
      const { data, error } = await supabase
        .from('narrative_templates')
        .insert({
          user_id: user.id,
          title,
          content
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error saving template:', error);
        toast.error('Failed to save template');
        return;
      }
      
      toast.success('Template saved successfully');
      setTemplates([data, ...templates]);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error in handleSaveTemplate:', error);
      toast.error('An error occurred while saving the template');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      // Delete template
      const { error } = await supabase
        .from('narrative_templates')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting template:', error);
        toast.error('Failed to delete template');
        return;
      }
      
      toast.success('Template deleted');
      setTemplates(templates.filter(t => t.id !== id));
      
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(null);
      }
    } catch (error) {
      console.error('Error in handleDeleteTemplate:', error);
      toast.error('An error occurred while deleting the template');
    }
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setTitle(template.title);
    setContent(template.content);
  };

  const handleAddToChat = () => {
    if (selectedTemplate) {
      onAddToChat(selectedTemplate.content);
      onClose();
    } else if (content.trim()) {
      onAddToChat(content);
      onClose();
    } else {
      toast.error('Please select a template or enter content to add to chat');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Custom Instructions & Templates</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template-title">Template Title</Label>
            <Input
              id="template-title"
              placeholder="E.g., Standard Chest Pain Template"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template-content">
              Instructions or Sample Narrative
              <span className="text-xs text-gray-500 ml-2">
                (Enter instructions for the AI or a sample narrative to follow)
              </span>
            </Label>
            <Textarea
              id="template-content"
              placeholder="Enter your custom instructions or sample narrative here. The AI will use this as a guide when generating new narratives."
              className="min-h-[200px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={handleSaveTemplate}
                disabled={saving || !title.trim() || !content.trim()}
              >
                {saving ? 'Saving...' : 'Save Template'}
              </Button>
              
              <Button
                onClick={handleAddToChat}
                disabled={!selectedTemplate && !content.trim()}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Add to Chat
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Saved Templates</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSelectedTemplate(null);
                setTitle('');
                setContent('');
              }}
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
          
          <ScrollArea className="h-[300px] pr-4">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-sm text-gray-500">Loading templates...</p>
              </div>
            ) : templates.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <FileText className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">No templates saved yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Create your first template to get started
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {templates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id 
                        ? 'border-primary' 
                        : 'hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h5 className="font-medium text-sm">{template.title}</h5>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {template.content}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-400 hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTemplate(template.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default CustomInstructionsDialog;