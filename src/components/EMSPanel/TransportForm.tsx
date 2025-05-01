import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NarrativeFormData } from './types';

interface TransportFormProps {
  control: Control<NarrativeFormData>;
  refusedTransport: boolean;
}

const TransportForm: React.FC<TransportFormProps> = ({ 
  control,
  refusedTransport
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Controller
          name="refused_transport"
          control={control}
          render={({ field }) => (
            <Switch
              id="refused_transport"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="refused_transport">Patient Refused Transport</Label>
      </div>
      
      {refusedTransport ? (
        <div className="space-y-1">
          <Label htmlFor="refusal_details">Refusal Details</Label>
          <Controller
            name="refusal_details"
            control={control}
            render={({ field }) => <Textarea id="refusal_details" {...field} />}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="transport_destination">Destination</Label>
            <Controller
              name="transport_destination"
              control={control}
              render={({ field }) => <Input id="transport_destination" {...field} />}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="transport_position">Position</Label>
            <Controller
              name="transport_position"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger id="transport_position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Position of comfort">Position of comfort</SelectItem>
                    <SelectItem value="Supine">Supine</SelectItem>
                    <SelectItem value="Fowler's">Fowler's</SelectItem>
                    <SelectItem value="Semi-Fowler's">Semi-Fowler's</SelectItem>
                    <SelectItem value="Left lateral recumbent">Left lateral recumbent</SelectItem>
                    <SelectItem value="Right lateral recumbent">Right lateral recumbent</SelectItem>
                    <SelectItem value="Trendelenburg">Trendelenburg</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="room_number">Room #</Label>
            <Controller
              name="room_number"
              control={control}
              render={({ field }) => <Input id="room_number" {...field} />}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="nurse_name">Nurse</Label>
            <Controller
              name="nurse_name"
              control={control}
              render={({ field }) => <Input id="nurse_name" {...field} />}
            />
          </div>
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Controller
          name="unit_in_service"
          control={control}
          render={({ field }) => (
            <Switch
              id="unit_in_service"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="unit_in_service">Unit Returned to Service</Label>
      </div>
    </div>
  );
};

export default TransportForm;