import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useIsMobile } from '@/hooks/use-mobile';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface NarrativeFormData {
  unit: string;
  dispatch_reason: string;
  response_delay: string;
  response_delay_custom: string;
  patient_sex: string;
  patient_age: string;
  chief_complaint: string;
  duration: string;
  patient_presentation: string;
  aao_person: boolean;
  aao_place: boolean;
  aao_time: boolean;
  aao_event: boolean;
  is_unresponsive: boolean;
  gcs_score: string;
  pupils: string;
  selected_pertinent_negatives: string[];
  unable_to_obtain_negatives: boolean;
  vital_signs_normal: boolean;
  selected_abnormal_vitals: string[];
  all_other_vitals_normal: boolean;
  dcap_btls: boolean;
  additional_assessment: string;
  treatment_provided: string;
  add_protocol_treatments: boolean;
  protocol_exclusions: string;
  refused_transport: boolean;
  refusal_details: string;
  transport_destination: string;
  transport_position: string;
  room_number: string;
  nurse_name: string;
  unit_in_service: boolean;
  format_type: 'D.R.A.T.T.' | 'S.O.A.P.' | 'C.H.A.R.T.' | string;
  use_abbreviations: boolean;
  include_headers: boolean;
  default_unit: string;
  default_hospital: string;
  custom_format: string;
}

interface EMSPanelProps {
  narrativeText?: string;
  onGenerateNarrative: (data: NarrativeFormData) => void;
  defaultFormData: NarrativeFormData;
}

const EMSPanel: React.FC<EMSPanelProps> = ({ 
  narrativeText = "No narrative generated yet. Fill out the form below and click 'Generate Narrative'.",
  onGenerateNarrative,
  defaultFormData
}) => {
  const isMobile = useIsMobile();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);
  const { control, handleSubmit, watch, setValue } = useForm<NarrativeFormData>({
    defaultValues: defaultFormData
  });

  const responseDelay = watch('response_delay');
  const isUnresponsive = watch('is_unresponsive');
  const vitalSignsNormal = watch('vital_signs_normal');
  const refusedTransport = watch('refused_transport');

  const onSubmit = (data: NarrativeFormData) => {
    onGenerateNarrative(data);
  };

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 15 }}
    >
      <Card className="h-2/5 overflow-auto mb-2">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">Generated Narrative</h3>
          <div className="whitespace-pre-wrap text-sm">
            {narrativeText}
          </div>
        </CardContent>
      </Card>
      
      <div className="h-3/5 overflow-hidden flex flex-col">
        <Collapsible 
          open={isAdvancedOpen} 
          onOpenChange={setIsAdvancedOpen}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h3 className="text-lg font-semibold">EMS Narrative Form</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isAdvancedOpen ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">Hide Form</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    <span className="text-sm">Show Form</span>
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6">
                {/* Dispatch Section */}
                <fieldset className="border rounded-md p-4">
                  <legend className="px-2 font-semibold text-sm">Dispatch</legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="space-y-1 col-span-1 md:col-span-2">
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
                      <div className="space-y-1 col-span-1 md:col-span-2">
                        <Label htmlFor="response_delay_custom">Custom Delay Reason</Label>
                        <Controller
                          name="response_delay_custom"
                          control={control}
                          render={({ field }) => <Input id="response_delay_custom" {...field} />}
                        />
                      </div>
                    )}
                  </div>
                </fieldset>
                
                {/* Patient Information */}
                <fieldset className="border rounded-md p-4">
                  <legend className="px-2 font-semibold text-sm">Patient Information</legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="space-y-1 col-span-1 md:col-span-2">
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
                    <div className="space-y-1 col-span-1 md:col-span-2">
                      <Label htmlFor="patient_presentation">Patient Presentation</Label>
                      <Controller
                        name="patient_presentation"
                        control={control}
                        render={({ field }) => <Textarea id="patient_presentation" {...field} />}
                      />
                    </div>
                  </div>
                </fieldset>
                
                {/* Assessment */}
                <fieldset className="border rounded-md p-4">
                  <legend className="px-2 font-semibold text-sm">Assessment</legend>
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
                </fieldset>
                
                {/* Treatment */}
                <fieldset className="border rounded-md p-4">
                  <legend className="px-2 font-semibold text-sm">Treatment</legend>
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
                    
                    {watch('add_protocol_treatments') && (
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
                </fieldset>
                
                {/* Transport */}
                <fieldset className="border rounded-md p-4">
                  <legend className="px-2 font-semibold text-sm">Transport</legend>
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
                </fieldset>
                
                {/* Format Options */}
                <fieldset className="border rounded-md p-4">
                  <legend className="px-2 font-semibold text-sm">Format Options</legend>
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
                    
                    {watch('format_type') === 'Custom' && (
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
                </fieldset>
                
                <Button type="submit" className="w-full">Generate Narrative</Button>
              </form>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
        
        {!isAdvancedOpen && (
          <div className="p-4">
            <Textarea 
              placeholder="Enter your narrative text here..." 
              className="min-h-[150px]"
              value={narrativeText}
              readOnly
            />
            <Button 
              onClick={() => setIsAdvancedOpen(true)} 
              variant="outline" 
              className="mt-2 w-full"
            >
              Show Advanced Options
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EMSPanel;