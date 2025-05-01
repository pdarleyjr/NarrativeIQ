import React from 'react';
import { Controller, Control, UseFormWatch } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NarrativeFormData } from './types';

interface FormatOptionsFormProps {
  control: Control<NarrativeFormData>;
  watch: UseFormWatch<NarrativeFormData>;
}

const FormatOptionsForm: React.FC<FormatOptionsFormProps> = ({ 
  control,
  watch
}) => {
  const formatType = watch('format_type');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1">
        <Label htmlFor="format_type">Format Type</Label>
        <Controller
          name="format_type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="format_type">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="D.R.A.T.T.">D.R.A.T.T.</SelectItem>
                <SelectItem value="S.O.A.P.">S.O.A.P.</SelectItem>
                <SelectItem value="C.H.A.R.T.">C.H.A.R.T.</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Controller
          name="include_headers"
          control={control}
          render={({ field }) => (
            <Switch
              id="include_headers"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="include_headers">Include Section Headers</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Controller
          name="use_abbreviations"
          control={control}
          render={({ field }) => (
            <Switch
              id="use_abbreviations"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="use_abbreviations">Use Abbreviations</Label>
      </div>
      
      {formatType === 'Custom' && (
        <div className="space-y-1 col-span-1 md:col-span-2">
          <Label htmlFor="custom_format">Custom Format</Label>
          <Controller
            name="custom_format"
            control={control}
            render={({ field }) => <Textarea id="custom_format" {...field} />}
          />
        </div>
      )}
    </div>
  );
};

export default FormatOptionsForm;