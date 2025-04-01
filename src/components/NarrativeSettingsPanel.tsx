
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';

const NarrativeSettingsPanel = () => {
  const [useAbbreviations, setUseAbbreviations] = useState<boolean>(true);
  const [defaultTone, setDefaultTone] = useState<string>('professional');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Narrative Settings</CardTitle>
        <CardDescription>
          Configure default settings for narrative generation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
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

        <div className="space-y-3">
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
      </CardContent>
    </Card>
  );
};

export default NarrativeSettingsPanel;
