import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NarrativeFormData } from './types';

interface ArrivalFormProps {
  control: Control<NarrativeFormData>;
}

const ArrivalForm: React.FC<ArrivalFormProps> = ({ control }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      <div className="space-y-1">
        <Label htmlFor="patient_sex">Sex</Label>
        <Controller
          name="patient_sex"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="patient_sex">
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="patient_age">Age</Label>
        <Controller
          name="patient_age"
          control={control}
          render={({ field }) => <Input id="patient_age" {...field} />}
        />
      </div>
      <div className="space-y-1 col-span-1 sm:col-span-2">
        <Label htmlFor="chief_complaint">Chief Complaint</Label>
        <Controller
          name="chief_complaint"
          control={control}
          render={({ field }) => <Input id="chief_complaint" {...field} />}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="duration">Duration</Label>
        <Controller
          name="duration"
          control={control}
          render={({ field }) => <Input id="duration" {...field} />}
        />
      </div>
      <div className="space-y-1 col-span-1 sm:col-span-2">
        <Label htmlFor="patient_presentation">Patient Presentation</Label>
        <Controller
          name="patient_presentation"
          control={control}
          render={({ field }) => <Textarea id="patient_presentation" {...field} />}
        />
      </div>
    </div>
  );
};

export default ArrivalForm;