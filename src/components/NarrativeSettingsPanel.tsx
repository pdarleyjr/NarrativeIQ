import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NarrativeKnowledgeBaseSelector } from './NarrativeKnowledgeBaseSelector';

const NarrativeSettingsPanel = () => {
  const [useAbbreviations, setUseAbbreviations] = useState<boolean>(true);
  const [defaultTone, setDefaultTone] = useState<string>('professional');
  const [activeTab, setActiveTab] = useState<string>('general');
  const [useOpenRouter, setUseOpenRouter] = useState<boolean>(false);

  const handleKnowledgeBasePreferencesChange = (selectedSources: string[], useWebSearch: boolean) => {
    console.log('Knowledge base preferences updated:', { selectedSources, useWebSearch });
    // You could store these in global state or context if needed
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Narrative Settings</CardTitle>
        <CardDescription>
          Configure default settings for narrative generation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="abbreviations" className="text-base">Use EMS Abbreviations</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Toggle standard EMS abbreviations in narratives
              </p>
            </div>
            <Switch
              id="abbreviations"
              checked={useAbbreviations}
              onCheckedChange={setUseAbbreviations}
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <div>
              <Label htmlFor="openrouter" className="text-base">Use OpenRouter API</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Use OpenRouter instead of OpenAI for narrative generation
              </p>
            </div>
            <Switch
              id="openrouter"
              checked={useOpenRouter}
              onCheckedChange={setUseOpenRouter}
            />
          </div>

          <div className="space-y-3 mt-4">
            <div>
              <Label className="text-base">Narrative Tone</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Select the default tone for generated narratives
              </p>
            </div>
            <ToggleGroup type="single" value={defaultTone} onValueChange={(value) => value && setDefaultTone(value)} className="justify-start">
              <ToggleGroupItem value="professional">Professional</ToggleGroupItem>
              <ToggleGroupItem value="friendly">Friendly</ToggleGroupItem>
              <ToggleGroupItem value="clinical">Clinical</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </TabsContent>
        
        <TabsContent value="knowledge-base">
          <NarrativeKnowledgeBaseSelector onPreferencesChange={handleKnowledgeBasePreferencesChange} />
        </TabsContent>
      </Tabs>
      </CardContent>
    </Card>
  );
};

export default NarrativeSettingsPanel;
