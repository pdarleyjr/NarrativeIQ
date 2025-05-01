import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NarrativeFormData } from './types';

interface DispatchFormProps {
  control: Control<NarrativeFormData>;
  responseDelay: string;
}

const DispatchForm: React.FC<DispatchFormProps> = ({ control, responseDelay }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      <div className="space-y-1">
        <Label htmlFor="unit">Unit</Label>
        <Controller
          name="unit"
          control={control}
          render={({ field }) => <Input id="unit" {...field} />}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="dispatch_reason">Dispatch Reason</Label>
        <Controller
          name="dispatch_reason"
          control={control}
          render={({ field }) => <Input id="dispatch_reason" {...field} />}
        />
      </div>
      <div className="space-y-1 col-span-1 sm:col-span-2">
        <Label htmlFor="response_delay">Response Delay</Label>
        <Controller
          name="response_delay"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="response_delay">
                <SelectValue placeholder="Select response delay" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No response delays">No response delays</SelectItem>
                <SelectItem value="Weather">Weather</SelectItem>
                <SelectItem value="Traffic">Traffic</SelectItem>
                <SelectItem value="Distance">Distance</SelectItem>
                <SelectItem value="Directions">Directions</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      {responseDelay === 'Custom' && (
        <div className="space-y-1 col-span-1 sm:col-span-2">
          <Label htmlFor="response_delay_custom">Custom Delay Reason</Label>
          <Controller
            name="response_delay_custom"
            control={control}
            render={({ field }) => <Input id="response_delay_custom" {...field} />}
          />
        </div>
      )}
    </div>
  );
};

export default DispatchForm;