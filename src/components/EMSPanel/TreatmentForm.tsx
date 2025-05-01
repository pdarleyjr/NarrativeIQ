import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { NarrativeFormData } from './types';

interface TreatmentFormProps {
  control: Control<NarrativeFormData>;
  addProtocolTreatments: boolean;
}

const TreatmentForm: React.FC<TreatmentFormProps> = ({ 
  control,
  addProtocolTreatments
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="treatment_provided">Treatment Provided</Label>
        <Controller
          name="treatment_provided"
          control={control}
          render={({ field }) => <Textarea id="treatment_provided" {...field} />}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Controller
          name="add_protocol_treatments"
          control={control}
          render={({ field }) => (
            <Switch
              id="add_protocol_treatments"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="add_protocol_treatments">Additional Treatments Per Protocol</Label>
      </div>
      
      {addProtocolTreatments && (
        <div className="space-y-1">
          <Label htmlFor="protocol_exclusions">Protocol Exclusions</Label>
          <Controller
            name="protocol_exclusions"
            control={control}
            render={({ field }) => <Input id="protocol_exclusions" {...field} />}
          />
        </div>
      )}
    </div>
  );
};

export default TreatmentForm;