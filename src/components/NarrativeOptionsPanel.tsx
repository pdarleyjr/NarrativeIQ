
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface NarrativeOptionsProps {
  format: 'standard' | 'chronological' | 'soap';
  useAbbreviations: boolean;
  includeHeaders: boolean;
  onUpdateOptions: (options: {
    format: 'standard' | 'chronological' | 'soap';
    useAbbreviations: boolean;
    includeHeaders: boolean;
  }) => void;
}

const NarrativeOptionsPanel: React.FC<NarrativeOptionsProps> = ({
  format,
  useAbbreviations,
  includeHeaders,
  onUpdateOptions
}) => {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Narrative Options</h3>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="abbreviations"
            checked={useAbbreviations}
            onCheckedChange={(checked) => 
              onUpdateOptions({ format, useAbbreviations: checked, includeHeaders })
            }
          />
          <Label htmlFor="abbreviations">Use EMS Abbreviations</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="headers"
            checked={includeHeaders}
            onCheckedChange={(checked) => 
              onUpdateOptions({ format, useAbbreviations, includeHeaders: checked })
            }
          />
          <Label htmlFor="headers">Include Section Headers</Label>
        </div>
        
        <div className="space-y-2">
          <Label>Format Style</Label>
          <div className="flex gap-2">
            {(['standard', 'chronological', 'soap'] as const).map((formatType) => (
              <Button 
                key={formatType}
                variant={format === formatType ? "default" : "outline"}
                size="sm"
                onClick={() => 
                  onUpdateOptions({ format: formatType, useAbbreviations, includeHeaders })
                }
              >
                {formatType.charAt(0).toUpperCase() + formatType.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NarrativeOptionsPanel;
