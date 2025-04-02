
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from "sonner";

// Define dropdown options based on sample narratives
const unitOptions = ["R1", "R2", "R3", "M1", "M2", "M3", "E1", "E2", "E3", "S1", "S2"];
const sexOptions = ["Male", "Female", "Other", "Unknown"];
const ageGroups = ["Infant", "Child", "Adolescent", "Adult", "Elderly"];
const chiefComplaintOptions = [
  "Shortness of breath",
  "Chest pain",
  "Altered mental status",
  "Unconscious",
  "Cardiac arrest",
  "Abdominal pain",
  "Trauma",
  "Seizure",
  "Stroke symptoms",
  "Allergic reaction",
  "Syncope",
  "Behavioral/psychiatric",
  "Overdose/poisoning",
  "Diabetic emergency",
  "Fall",
  "Pain (other)",
  "Bleeding (non-traumatic)",
  "Weakness",
  "Dizziness",
  "Fever"
];
const durationOptions = [
  "< 1 hour", 
  "1-3 hours", 
  "3-6 hours", 
  "6-12 hours", 
  "12-24 hours", 
  "1 day", 
  "2 days", 
  "3 days", 
  "4 days", 
  "5 days", 
  "6 days", 
  "1 week", 
  "2 weeks", 
  "1 month", 
  "> 1 month"
];
const hospitalOptions = [
  "Mount Sinai Hospital",
  "Baptist Medical Center",
  "Memorial Hospital",
  "St. Luke's Hospital",
  "Mayo Clinic",
  "University Hospital",
  "County General Hospital",
  "Community Regional Medical Center",
  "Mercy Hospital",
  "Good Samaritan Hospital"
];
const transportPositionOptions = [
  "Position of comfort",
  "Supine",
  "Semi-Fowler's",
  "Fowler's",
  "Lateral recumbent",
  "Recovery position",
  "Trendelenburg",
  "Reverse Trendelenburg",
  "Seated"
];
const narrativeFormatOptions = ["D.R.A.T.T.", "S.O.A.P.", "C.H.A.R.T."];

interface NarrativeFormData {
  // Dispatch tab
  unit: string;
  dispatch_location: string;
  
  // Response tab
  response_delay: boolean;
  response_delay_reason: string;
  
  // Arrival tab
  patient_sex: string;
  patient_age: string;
  chief_complaint: string;
  duration: string;
  patient_presentation: string;
  
  // Assessment tab
  general_assessment: string;
  denied_symptoms: boolean;
  dcap_btls: boolean;
  vitals_normal: boolean;
  additional_assessment: string;
  
  // Treatment tab
  treatment_provided: string;
  add_protocol_treatments: boolean;
  protocol_exclusions: string;
  
  // Transport tab
  refused_transport: boolean;
  refusal_details: string;
  transport_destination: string;
  transport_position: string;
  room_number: string;
  nurse_name: string;
  unit_in_service: boolean;
  
  // Settings (pulled from the NarrativeOptions)
  format_type: 'D.R.A.T.T.' | 'S.O.A.P.' | 'C.H.A.R.T.' | string;
  use_abbreviations: boolean;
  include_headers: boolean;
  default_unit: string;
  default_hospital: string;
  custom_format: string;
}

const initialFormData: NarrativeFormData = {
  unit: '',
  dispatch_location: '',
  response_delay: false,
  response_delay_reason: '',
  patient_sex: '',
  patient_age: '',
  chief_complaint: '',
  duration: '',
  patient_presentation: '',
  general_assessment: 'Patient was AAOx4, GCS-15, PERRL, -LOC.',
  denied_symptoms: true,
  dcap_btls: true,
  vitals_normal: true,
  additional_assessment: '',
  treatment_provided: '',
  add_protocol_treatments: false,
  protocol_exclusions: '',
  refused_transport: false,
  refusal_details: '',
  transport_destination: '',
  transport_position: 'Position of comfort',
  room_number: '',
  nurse_name: '',
  unit_in_service: true,
  format_type: 'D.R.A.T.T.',
  use_abbreviations: true,
  include_headers: true,
  default_unit: 'R1',
  default_hospital: 'Mount Sinai Hospital',
  custom_format: ''
};

interface EnhancedNarrativeFormProps {
  onGenerateNarrative: (data: NarrativeFormData) => void;
  onSavePreset: (data: NarrativeFormData) => void;
  loadPreset?: NarrativeFormData;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const EnhancedNarrativeForm: React.FC<EnhancedNarrativeFormProps> = ({ 
  onGenerateNarrative,
  onSavePreset,
  loadPreset,
  activeTab = "dispatch",
  onTabChange
}) => {
  const [formData, setFormData] = useState<NarrativeFormData>(initialFormData);
  
  // Load saved draft or preset
  useEffect(() => {
    if (loadPreset) {
      setFormData(loadPreset);
    } else {
      const savedDraft = localStorage.getItem('narrative_draft');
      if (savedDraft) {
        try {
          setFormData(JSON.parse(savedDraft));
        } catch (error) {
          console.error("Failed to parse saved draft", error);
        }
      }
    }
  }, [loadPreset]);
  
  // Save draft on form change
  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem('narrative_draft', JSON.stringify(formData));
    }, 400);
    return () => clearTimeout(handler);
  }, [formData]);

  useEffect(() => {
    // Set unit from default if empty
    if (!formData.unit && formData.default_unit) {
      setFormData(prev => ({ ...prev, unit: prev.default_unit }));
    }
    
    // Set transport destination from default if empty
    if (!formData.transport_destination && formData.default_hospital) {
      setFormData(prev => ({ ...prev, transport_destination: prev.default_hospital }));
    }
  }, [formData.default_unit, formData.default_hospital]);
  
  const handleInputChange = (field: keyof NarrativeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const setNormalAssessment = () => {
    handleInputChange('general_assessment', 'Patient was AAOx4, GCS-15, PERRL, -LOC.');
    handleInputChange('denied_symptoms', true);
    handleInputChange('dcap_btls', true);
    handleInputChange('vitals_normal', true);
  };
  
  const handleGenerateNarrative = () => {
    onGenerateNarrative(formData);
  };
  
  const handleSavePreset = () => {
    onSavePreset(formData);
    toast.success("Preset saved successfully");
  };
  
  const handleTabChange = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="space-y-2">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full justify-start overflow-auto">
          <TabsTrigger value="dispatch">Dispatch</TabsTrigger>
          <TabsTrigger value="response">Response</TabsTrigger>
          <TabsTrigger value="arrival">Arrival</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="treatment">Treatment</TabsTrigger>
          <TabsTrigger value="transport">Transport</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dispatch" className="pt-2 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="unit">🔹 Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {unitOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="dispatch_location">🔹 Dispatched to</Label>
              <Input 
                id="dispatch_location" 
                placeholder="Enter location"
                value={formData.dispatch_location}
                onChange={(e) => handleInputChange('dispatch_location', e.target.value)}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="response" className="pt-2 space-y-3">
          <div className="flex items-center space-x-2 mb-2">
            <Checkbox 
              id="response_delay" 
              checked={formData.response_delay}
              onCheckedChange={(checked) => handleInputChange('response_delay', checked)}
            />
            <Label htmlFor="response_delay">🔹 Any response delays?</Label>
          </div>
          
          {formData.response_delay && (
            <div className="space-y-1">
              <Label htmlFor="response_delay_reason">Specify reason</Label>
              <Textarea 
                id="response_delay_reason"
                placeholder="Enter the reason for the response delay"
                value={formData.response_delay_reason}
                onChange={(e) => handleInputChange('response_delay_reason', e.target.value)}
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="arrival" className="pt-2 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="patient_sex">🔹 Patient Sex</Label>
              <Select value={formData.patient_sex} onValueChange={(value) => handleInputChange('patient_sex', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  {sexOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="patient_age">🔹 Patient Age</Label>
              <Input 
                id="patient_age" 
                placeholder="Enter age"
                value={formData.patient_age}
                onChange={(e) => handleInputChange('patient_age', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="chief_complaint">🔹 Chief Complaint / Presenting Problem</Label>
            <Select value={formData.chief_complaint} onValueChange={(value) => handleInputChange('chief_complaint', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select or type chief complaint" />
              </SelectTrigger>
              <SelectContent>
                {chiefComplaintOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input 
              className="mt-1"
              placeholder="Or type custom chief complaint"
              value={formData.chief_complaint}
              onChange={(e) => handleInputChange('chief_complaint', e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="duration">🔹 Duration of symptoms prior to arrival</Label>
            <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="patient_presentation">🔹 Relevant Patient Information</Label>
            <Textarea 
              id="patient_presentation"
              placeholder="Describe presentation, statements made by the patient, or any observations that help paint the picture."
              value={formData.patient_presentation}
              onChange={(e) => handleInputChange('patient_presentation', e.target.value)}
              rows={3}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="assessment" className="pt-2 space-y-3">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="general_assessment">🔹 General</Label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={setNormalAssessment}
            >
              Set Normal Findings
            </Button>
          </div>
          <Textarea 
            id="general_assessment"
            placeholder="General assessment findings"
            value={formData.general_assessment}
            onChange={(e) => handleInputChange('general_assessment', e.target.value)}
            rows={2}
          />
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="denied_symptoms" 
                checked={formData.denied_symptoms}
                onCheckedChange={(checked) => handleInputChange('denied_symptoms', checked)}
              />
              <Label htmlFor="denied_symptoms">
                🔹 Patient denied: headache, nausea, vomiting, abdominal pain, diarrhea, chest pain, stroke-like symptoms, or any other pain/medical complaints.
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="dcap_btls" 
                checked={formData.dcap_btls}
                onCheckedChange={(checked) => handleInputChange('dcap_btls', checked)}
              />
              <Label htmlFor="dcap_btls">
                🔹 Full assessment performed; no DCAP-BTLS noted throughout the body.
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="vitals_normal" 
                checked={formData.vitals_normal}
                onCheckedChange={(checked) => handleInputChange('vitals_normal', checked)}
              />
              <Label htmlFor="vitals_normal">
                🔹 Vital signs checked and within normal limits for the patient.
              </Label>
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="additional_assessment">🔹 Additional assessment findings (if any)</Label>
            <Textarea 
              id="additional_assessment"
              placeholder="Optional—add any pertinent details"
              value={formData.additional_assessment}
              onChange={(e) => handleInputChange('additional_assessment', e.target.value)}
              rows={2}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="treatment" className="pt-2 space-y-3">
          <div className="space-y-1">
            <Label htmlFor="treatment_provided">🔹 Treatment provided</Label>
            <Textarea 
              id="treatment_provided"
              placeholder="Briefly describe any treatments provided; AI will enhance the details for clarity and completeness."
              value={formData.treatment_provided}
              onChange={(e) => handleInputChange('treatment_provided', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox 
              id="add_protocol_treatments" 
              checked={formData.add_protocol_treatments}
              onCheckedChange={(checked) => handleInputChange('add_protocol_treatments', checked)}
            />
            <Label htmlFor="add_protocol_treatments">
              Add medications and dosages along with any other recommended treatments per protocol
            </Label>
          </div>
          
          {formData.add_protocol_treatments && (
            <div className="space-y-1">
              <Label htmlFor="protocol_exclusions">Specific treatments to exclude</Label>
              <Textarea 
                id="protocol_exclusions"
                placeholder="List any protocol treatments that were not performed and why (e.g., criteria not met)"
                value={formData.protocol_exclusions}
                onChange={(e) => handleInputChange('protocol_exclusions', e.target.value)}
                rows={2}
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="transport" className="pt-2 space-y-3">
          <div className="flex items-center space-x-2 mb-3">
            <Checkbox 
              id="refused_transport" 
              checked={formData.refused_transport}
              onCheckedChange={(checked) => handleInputChange('refused_transport', checked)}
            />
            <Label htmlFor="refused_transport" className="text-red-500 font-medium">
              🛑 Did the patient refuse transport?
            </Label>
          </div>
          
          {formData.refused_transport ? (
            <div className="space-y-1">
              <Label htmlFor="refusal_details">🔹 Refusal details (optional)</Label>
              <Textarea 
                id="refusal_details"
                placeholder="Add any specific details about the refusal (AI will generate a full refusal summary)"
                value={formData.refusal_details}
                onChange={(e) => handleInputChange('refusal_details', e.target.value)}
                rows={3}
              />
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <Label htmlFor="transport_destination">🔹 Transported to</Label>
                <Select value={formData.transport_destination} onValueChange={(value) => handleInputChange('transport_destination', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitalOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input 
                  className="mt-1"
                  placeholder="Or type custom destination"
                  value={formData.transport_destination}
                  onChange={(e) => handleInputChange('transport_destination', e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="transport_position">🔹 Transport Position</Label>
                <Select value={formData.transport_position} onValueChange={(value) => handleInputChange('transport_position', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {transportPositionOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="monitored" 
                  checked={true}
                  disabled
                />
                <Label htmlFor="monitored">
                  🔹 Patient monitored en route with vitals reassessed.
                </Label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="room_number">🔹 Patient left in Room #</Label>
                  <Input 
                    id="room_number" 
                    placeholder="Enter room number"
                    value={formData.room_number}
                    onChange={(e) => handleInputChange('room_number', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="nurse_name">🔹 Patient turned over to RN</Label>
                  <Input 
                    id="nurse_name" 
                    placeholder="Enter nurse name"
                    value={formData.nurse_name}
                    onChange={(e) => handleInputChange('nurse_name', e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
          
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox 
              id="unit_in_service" 
              checked={formData.unit_in_service}
              onCheckedChange={(checked) => handleInputChange('unit_in_service', checked)}
            />
            <Label htmlFor="unit_in_service">
              🔹 Unit {formData.unit || formData.default_unit} returned in service.
            </Label>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="pt-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="default_unit">Default Unit</Label>
                <Select value={formData.default_unit} onValueChange={(value) => handleInputChange('default_unit', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select default unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="default_hospital">Default Hospital</Label>
                <Select value={formData.default_hospital} onValueChange={(value) => handleInputChange('default_hospital', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select default hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitalOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="format_type">Narrative Format</Label>
                <Select value={formData.format_type} onValueChange={(value) => handleInputChange('format_type', value)}>
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
                
                {formData.format_type === 'custom' && (
                  <Input 
                    className="mt-1"
                    placeholder="Enter custom format name"
                    value={formData.custom_format}
                    onChange={(e) => handleInputChange('custom_format', e.target.value)}
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="abbreviations"
                    checked={formData.use_abbreviations}
                    onCheckedChange={(checked) => handleInputChange('use_abbreviations', checked)}
                  />
                  <Label htmlFor="abbreviations">Use EMS Abbreviations</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="headers"
                    checked={formData.include_headers}
                    onCheckedChange={(checked) => handleInputChange('include_headers', checked)}
                  />
                  <Label htmlFor="headers">Include Section Headers</Label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={handleSavePreset}
            >
              Save as Preset
            </Button>
            <Button onClick={handleGenerateNarrative}>
              Generate Narrative
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedNarrativeForm;
