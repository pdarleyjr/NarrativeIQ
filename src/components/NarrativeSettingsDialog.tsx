
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NarrativeSettingsProps {
  initialSettings: {
    format_type: string;
    use_abbreviations: boolean;
    include_headers: boolean;
    default_unit: string;
    default_hospital: string;
    custom_format: string;
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

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Narrative Settings</h3>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="default_unit">Default Unit</Label>
          <Input 
            id="default_unit"
            placeholder="Enter default unit designation"
            value={settings.default_unit}
            onChange={(e) => handleInputChange('default_unit', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="default_hospital">Default Hospital</Label>
          <Input 
            id="default_hospital"
            placeholder="Enter default hospital name"
            value={settings.default_hospital}
            onChange={(e) => handleInputChange('default_hospital', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="format_type">Narrative Format</Label>
          <Select 
            value={settings.format_type} 
            onValueChange={(value) => handleInputChange('format_type', value)}
          >
            <SelectTrigger>
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
              className="mt-1"
              placeholder="Enter custom format name"
              value={settings.custom_format}
              onChange={(e) => handleInputChange('custom_format', e.target.value)}
            />
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="abbreviations"
              checked={settings.use_abbreviations}
              onCheckedChange={(checked) => handleInputChange('use_abbreviations', checked)}
            />
            <Label htmlFor="abbreviations">Use EMS Abbreviations</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="headers"
              checked={settings.include_headers}
              onCheckedChange={(checked) => handleInputChange('include_headers', checked)}
            />
            <Label htmlFor="headers">Include Section Headers</Label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default NarrativeSettingsDialog;
