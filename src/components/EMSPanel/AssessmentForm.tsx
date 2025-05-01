import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NarrativeFormData } from './types';

interface AssessmentFormProps {
  control: Control<NarrativeFormData>;
  isUnresponsive: boolean;
  vitalSignsNormal: boolean;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ 
  control, 
  isUnresponsive,
  vitalSignsNormal
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Controller
          name="is_unresponsive"
          control={control}
          render={({ field }) => (
            <Switch
              id="is_unresponsive"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="is_unresponsive">Patient Unresponsive</Label>
      </div>
      
      {!isUnresponsive && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Controller
                name="aao_person"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="aao_person"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="aao_person">Alert to Person</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Controller
                name="aao_place"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="aao_place"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="aao_place">Alert to Place</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Controller
                name="aao_time"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="aao_time"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="aao_time">Alert to Time</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Controller
                name="aao_event"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="aao_event"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="aao_event">Alert to Event</Label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="gcs_score">GCS Score</Label>
              <Controller
                name="gcs_score"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="gcs_score">
                      <SelectValue placeholder="Select GCS score" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 15 }, (_, i) => i + 1).reverse().map(score => (
                        <SelectItem key={score} value={score.toString()}>{score}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="pupils">Pupils</Label>
              <Controller
                name="pupils"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="pupils">
                      <SelectValue placeholder="Select pupils" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERRL">PERRL</SelectItem>
                      <SelectItem value="PERRLA">PERRLA</SelectItem>
                      <SelectItem value="Unequal">Unequal</SelectItem>
                      <SelectItem value="Fixed">Fixed</SelectItem>
                      <SelectItem value="Dilated">Dilated</SelectItem>
                      <SelectItem value="Constricted">Constricted</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Controller
            name="vital_signs_normal"
            control={control}
            render={({ field }) => (
              <Switch
                id="vital_signs_normal"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="vital_signs_normal">Vital Signs Normal</Label>
        </div>
        
        {!vitalSignsNormal && (
          <div className="space-y-2 pl-6">
            <div className="flex items-center space-x-2">
              <Controller
                name="all_other_vitals_normal"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="all_other_vitals_normal"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="all_other_vitals_normal">All Other Vitals Normal</Label>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Controller
          name="dcap_btls"
          control={control}
          render={({ field }) => (
            <Switch
              id="dcap_btls"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="dcap_btls">No DCAP-BTLS</Label>
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="additional_assessment">Additional Assessment</Label>
        <Controller
          name="additional_assessment"
          control={control}
          render={({ field }) => <Textarea id="additional_assessment" {...field} />}
        />
      </div>
    </div>
  );
};

export default AssessmentForm;