
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NarrativeKnowledgeBaseSelector } from './NarrativeKnowledgeBaseSelector';
import { getUserKbPreferences, saveUserKbPreferences } from '@/lib/knowledgeBaseService';
import { supabase } from '@/lib/supabase';

interface NarrativeSettingsProps {
  initialSettings: {
    format_type: string;
    use_abbreviations: boolean;
    include_headers: boolean;
    default_unit: string;
    default_hospital: string;
    custom_format: string;
    unit_id?: string;
    preferred_format?: string;
  };
  onSave: (settings: any) => void;
  onClose: () => void;
}

const narrativeFormatOptions = ["D.R.A.T.T.", "S.O.A.P.", "C.H.A.R.T."];

const NarrativeSettingsDialog: React.FC<NarrativeSettingsProps> = ({
  initialSettings,
  onSave,
  onClose
}) => {
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setSettings(initialSettings);
    
    // Get current user
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    
    fetchUser();
  }, [initialSettings]);

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleKnowledgeBasePreferencesChange = async (selectedSources: string[], useWebSearch: boolean) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      await saveUserKbPreferences(userId, selectedSources, useWebSearch);
    } catch (error) {
      console.error('Error saving knowledge base preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between border-b pb-2 mb-2">
        <h2 className="text-xl font-semibold">Narrative Settings</h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-full">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 overflow-hidden flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mb-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <TabsTrigger value="general" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-md py-2">General</TabsTrigger>
          <TabsTrigger value="knowledge-base" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-md py-2">Knowledge Base</TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-auto">
          <TabsContent value="general" className="space-y-5 pt-2 h-full">
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default_unit" className="text-sm font-medium">Default Unit</Label>
                  <Input
                    id="default_unit"
                    placeholder="Enter default unit designation"
                    value={settings.default_unit}
                    onChange={(e) => handleInputChange('default_unit', e.target.value)}
                    className="h-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default_hospital" className="text-sm font-medium">Default Hospital</Label>
                  <Input
                    id="default_hospital"
                    placeholder="Enter default hospital name"
                    value={settings.default_hospital}
                    onChange={(e) => handleInputChange('default_hospital', e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="format_type" className="text-sm font-medium">Narrative Format</Label>
                <Select
                  value={settings.format_type}
                  onValueChange={(value) => handleInputChange('format_type', value)}
                >
                  <SelectTrigger id="format_type" className="h-10">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {narrativeFormatOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                
                {settings.format_type === 'custom' && (
                  <Input
                    className="mt-2 h-10"
                    placeholder="Enter custom format name"
                    value={settings.custom_format}
                    onChange={(e) => handleInputChange('custom_format', e.target.value)}
                  />
                )}
              </div>
              
              <div className="space-y-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Options</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="abbreviations" className="text-sm cursor-pointer">Use EMS Abbreviations</Label>
                  <Switch
                    id="abbreviations"
                    checked={settings.use_abbreviations}
                    onCheckedChange={(checked) => handleInputChange('use_abbreviations', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="headers" className="text-sm cursor-pointer">Include Section Headers</Label>
                  <Switch
                    id="headers"
                    checked={settings.include_headers}
                    onCheckedChange={(checked) => handleInputChange('include_headers', checked)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="knowledge-base" className="pt-2 h-full">
            <NarrativeKnowledgeBaseSelector onPreferencesChange={handleKnowledgeBasePreferencesChange} />
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="flex justify-end gap-3 pt-4 border-t mt-auto">
        <Button variant="outline" onClick={onClose} className="min-w-[100px]">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={loading} className="min-w-[100px] bg-ems-600 hover:bg-ems-700">
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

export default NarrativeSettingsDialog;
