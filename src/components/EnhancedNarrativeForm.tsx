import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from "sonner";
import { ChevronDown } from 'lucide-react';

// Response delay options
const responseDelayOptions = [
  "No response delays",
  "Traffic",
  "Weather conditions",
  "Distance",
  "Scene not secured",
  "Change of location",
  "Multiple calls",
  "Vehicle issues",
  "Staffing issues",
  "Delayed notification",
  "Other"
];

// Sex options
const sexOptions = ["Male", "Female", "Other", "Unknown"];

// Chief complaint options
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

// Duration options
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

// Transport position options
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

// Narrative format options
const narrativeFormatOptions = ["D.R.A.T.T.", "S.O.A.P.", "C.H.A.R.T."];

// Pertinent negatives list
const pertinentNegatives = [
  "Headache",
  "Nausea",
  "Vomiting",
  "Abdominal pain",
  "Diarrhea",
  "Chest pain",
  "Stroke-like symptoms",
  "Dizziness",
  "Vision changes",
  "Shortness of breath",
  "Fever",
  "Chills",
  "Back pain",
  "Joint pain",
  "Rash",
  "Swelling",
  "Bleeding",
  "Syncope",
  "Weakness",
  "Numbness/tingling",
  "Other medical complaints"
];

// Abnormal vital signs options
const abnormalVitalSigns = [
  "Hypertensive",
  "Hypotensive",
  "Tachycardic",
  "Bradycardic",
  "Tachypneic",
  "Bradypneic",
  "Febrile",
  "Hypothermic",
  "Hypoxic",
  "Hyperglycemic",
  "Hypoglycemic"
];

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

const initialFormData: NarrativeFormData = {
  unit: '',
  dispatch_reason: '',
  response_delay: 'No response delays',
  response_delay_custom: '',
  patient_sex: '',
  patient_age: '',
  chief_complaint: '',
  duration: '',
  patient_presentation: '',
  aao_person: true,
  aao_place: true,
  aao_time: true,
  aao_event: true,
  is_unresponsive: false,
  gcs_score: '15',
  pupils: 'PERRL',
  selected_pertinent_negatives: [],
  unable_to_obtain_negatives: false,
  vital_signs_normal: true,
  selected_abnormal_vitals: [],
  all_other_vitals_normal: true,
  dcap_btls: true,
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
  default_unit: '',
  default_hospital: '',
  custom_format: ''
};

interface EnhancedNarrativeFormProps {
  onGenerateNarrative: (data: NarrativeFormData) => void;
  onSavePreset: (data: NarrativeFormData) => void;
  loadPreset?: NarrativeFormData;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  settings?: {
    format_type: string;
    use_abbreviations: boolean;
    include_headers: boolean;
    default_unit: string;
    default_hospital: string;
    custom_format: string;
  };
}

const EnhancedNarrativeForm: React.FC<EnhancedNarrativeFormProps> = ({ 
  onGenerateNarrative,
  onSavePreset,
  loadPreset,
  activeTab = "dispatch",
  onTabChange,
  settings
}) => {
  const [formData, setFormData] = useState<NarrativeFormData>(initialFormData);
  
  useEffect(() => {
    if (loadPreset) {
      const safePreset = {
        ...initialFormData,
        ...loadPreset,
        selected_pertinent_negatives: loadPreset.selected_pertinent_negatives || [],
        selected_abnormal_vitals: loadPreset.selected_abnormal_vitals || []
      };
      setFormData(safePreset);
    } else {
      const savedDraft = localStorage.getItem('narrative_draft');
      if (savedDraft) {
        try {
          const parsedData = JSON.parse(savedDraft);
          const safeData = {
            ...initialFormData,
            ...parsedData,
            selected_pertinent_negatives: parsedData.selected_pertinent_negatives || [],
            selected_abnormal_vitals: parsedData.selected_abnormal_vitals || []
          };
          setFormData(safeData);
        } catch (error) {
          console.error("Failed to parse saved draft", error);
        }
      }
    }
  }, [loadPreset]);
  
  useEffect(() => {
    if (settings) {
      setFormData(prev => ({
        ...prev,
        format_type: settings.format_type,
        use_abbreviations: settings.use_abbreviations,
        include_headers: settings.include_headers,
        default_unit: settings.default_unit,
        default_hospital: settings.default_hospital,
        custom_format: settings.custom_format
      }));
    }
  }, [settings]);
  
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

  const togglePertinentNegative = (negative: string) => {
    setFormData(prev => {
      const currentNegatives = prev.selected_pertinent_negatives || [];
      if (currentNegatives.includes(negative)) {
        return {
          ...prev,
          selected_pertinent_negatives: currentNegatives.filter(n => n !== negative)
        };
      } else {
        return {
          ...prev,
          selected_pertinent_negatives: [...currentNegatives, negative]
        };
      }
    });
  };

  const toggleAllPertinentNegatives = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selected_pertinent_negatives: checked ? [...pertinentNegatives] : []
    }));
  };

  const toggleAbnormalVitalSign = (vitalSign: string) => {
    setFormData(prev => {
      const currentVitalSigns = prev.selected_abnormal_vitals || [];
      if (currentVitalSigns.includes(vitalSign)) {
        return {
          ...prev,
          selected_abnormal_vitals: currentVitalSigns.filter(v => v !== vitalSign)
        };
      } else {
        return {
          ...prev,
          selected_abnormal_vitals: [...currentVitalSigns, vitalSign]
        };
      }
    });
  };

  const setNormalAssessment = () => {
    setFormData(prev => ({
      ...prev,
      aao_person: true,
      aao_place: true,
      aao_time: true,
      aao_event: true,
      is_unresponsive: false,
      gcs_score: '15',
      pupils: 'PERRL',
      selected_pertinent_negatives: [...pertinentNegatives],
      unable_to_obtain_negatives: false,
      vital_signs_normal: true,
      selected_abnormal_vitals: [],
      all_other_vitals_normal: true,
      dcap_btls: true,
      additional_assessment: ''
    }));
  };

  const setWorstAssessment = () => {
    setFormData(prev => ({
      ...prev,
      aao_person: false,
      aao_place: false,
      aao_time: false,
      aao_event: false,
      is_unresponsive: true,
      gcs_score: '3',
      pupils: 'Unreactive',
      selected_pertinent_negatives: [],
      unable_to_obtain_negatives: true,
      vital_signs_normal: false,
      selected_abnormal_vitals: ['Hypotensive', 'Tachycardic', 'Tachypneic', 'Hypoxic'],
      all_other_vitals_normal: false,
      dcap_btls: false,
      additional_assessment: 'Patient in critical condition requiring immediate intervention.'
    }));
  };

  const toggleUnresponsiveState = (checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        is_unresponsive: true,
        aao_person: false,
        aao_place: false,
        aao_time: false,
        aao_event: false,
        unable_to_obtain_negatives: true
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        is_unresponsive: false,
        unable_to_obtain_negatives: false
      }));
    }
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
      <div className="flex justify-between items-center mb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Quick Prefill <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={setNormalAssessment}>
              Normal Findings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={setWorstAssessment}>
              Critical Findings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSavePreset}>
              Save Current as Preset
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          size="sm" 
          onClick={handleGenerateNarrative}
        >
          Generate Narrative
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full justify-start overflow-auto">
          <TabsTrigger value="dispatch">Dispatch</TabsTrigger>
          <TabsTrigger value="response">Response</TabsTrigger>
          <TabsTrigger value="arrival">Arrival</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="treatment">Treatment</TabsTrigger>
          <TabsTrigger value="transport">Transport</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dispatch" className="pt-2 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="unit">🔹 Unit</Label>
              <Input 
                id="unit" 
                placeholder="Enter unit designation"
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="dispatch_reason">🔹 Dispatched for</Label>
              <Input 
                id="dispatch_reason" 
                placeholder="Chief complaint from dispatch"
                value={formData.dispatch_reason}
                onChange={(e) => handleInputChange('dispatch_reason', e.target.value)}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="response" className="pt-2 space-y-3">
          <div className="space-y-1">
            <Label htmlFor="response_delay">🔹 Response Information</Label>
            <Select 
              value={formData.response_delay}
              onValueChange={(value) => handleInputChange('response_delay', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select response status" />
              </SelectTrigger>
              <SelectContent>
                {responseDelayOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {formData.response_delay === 'Other' && (
            <div className="space-y-1">
              <Label htmlFor="response_delay_custom">Specify reason</Label>
              <Textarea 
                id="response_delay_custom"
                placeholder="Enter the reason for the response delay"
                value={formData.response_delay_custom}
                onChange={(e) => handleInputChange('response_delay_custom', e.target.value)}
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
                <SelectValue placeholder="Select chief complaint" />
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
            <Label className="text-sm font-medium">🔹 Mental Status Assessment</Label>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={setNormalAssessment}
              >
                Set Normal Findings
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={setWorstAssessment}
                className="text-destructive border-destructive hover:bg-destructive/10"
              >
                Set Critical Findings
              </Button>
            </div>
          </div>
          
          <div className="p-3 border rounded-md space-y-3">
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox 
                id="unresponsive" 
                checked={formData.is_unresponsive}
                onCheckedChange={(checked) => toggleUnresponsiveState(checked === true)}
              />
              <Label htmlFor="unresponsive" className="font-medium text-destructive">
                Patient Unresponsive
              </Label>
            </div>
            
            {!formData.is_unresponsive && (
              <div className="space-y-2">
                <Label className="text-sm">Orientation Status (AAO)</Label>
                <div className="flex gap-2 flex-wrap">
                  <ToggleGroup type="multiple" className="justify-start">
                    <ToggleGroupItem 
                      value="person" 
                      aria-label="Toggle Person"
                      data-state={formData.aao_person ? "on" : "off"}
                      onClick={() => handleInputChange('aao_person', !formData.aao_person)}
                    >
                      Person
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="place" 
                      aria-label="Toggle Place"
                      data-state={formData.aao_place ? "on" : "off"}
                      onClick={() => handleInputChange('aao_place', !formData.aao_place)}
                    >
                      Place
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="time" 
                      aria-label="Toggle Time"
                      data-state={formData.aao_time ? "on" : "off"}
                      onClick={() => handleInputChange('aao_time', !formData.aao_time)}
                    >
                      Time
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="event" 
                      aria-label="Toggle Event"
                      data-state={formData.aao_event ? "on" : "off"}
                      onClick={() => handleInputChange('aao_event', !formData.aao_event)}
                    >
                      Event
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <div className="space-y-1">
                    <Label htmlFor="gcs_score">GCS Score</Label>
                    <Select 
                      value={formData.gcs_score}
                      onValueChange={(value) => handleInputChange('gcs_score', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select GCS" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 13}, (_, i) => (i + 3).toString()).map((score) => (
                          <SelectItem key={score} value={score}>{score}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="pupils">Pupils</Label>
                    <Select 
                      value={formData.pupils}
                      onValueChange={(value) => handleInputChange('pupils', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select pupil response" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERRL">PERRL</SelectItem>
                        <SelectItem value="PERRLA">PERRLA</SelectItem>
                        <SelectItem value="Sluggish">Sluggish</SelectItem>
                        <SelectItem value="Unreactive">Unreactive</SelectItem>
                        <SelectItem value="Unequal">Unequal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-3 border rounded-md space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">🔹 Pertinent Negatives</Label>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="select_all_negatives" 
                  checked={formData.selected_pertinent_negatives.length === pertinentNegatives.length}
                  onCheckedChange={(checked) => toggleAllPertinentNegatives(checked === true)}
                  disabled={formData.unable_to_obtain_negatives}
                />
                <Label htmlFor="select_all_negatives" className="text-xs">Select All</Label>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox 
                id="unable_obtain_negatives" 
                checked={formData.unable_to_obtain_negatives}
                onCheckedChange={(checked) => handleInputChange('unable_to_obtain_negatives', checked === true)}
              />
              <Label htmlFor="unable_obtain_negatives" className="text-sm">
                Unable to obtain (patient unresponsive/unable to communicate)
              </Label>
            </div>
            
            {!formData.unable_to_obtain_negatives && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1 mt-2">
                {pertinentNegatives.map((negative) => (
                  <div key={negative} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`negative-${negative}`} 
                      checked={formData.selected_pertinent_negatives.includes(negative)}
                      onCheckedChange={() => togglePertinentNegative(negative)}
                    />
                    <Label htmlFor={`negative-${negative}`} className="text-xs">{negative}</Label>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-3 border rounded-md space-y-3">
            <Label className="text-sm font-medium">🔹 Vital Signs</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="vitals_normal" 
                checked={formData.vital_signs_normal}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  handleInputChange('vital_signs_normal', isChecked);
                  if (isChecked) {
                    handleInputChange('selected_abnormal_vitals', []);
                  }
                }}
              />
              <Label htmlFor="vitals_normal" className="text-sm">
                Vital signs checked and within normal limits for the patient.
              </Label>
            </div>
            
            {!formData.vital_signs_normal && (
              <>
                <Label className="text-sm">Abnormal Vital Signs</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                  {abnormalVitalSigns.map((vitalSign) => (
                    <div key={vitalSign} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`vitals-${vitalSign}`} 
                        checked={formData.selected_abnormal_vitals.includes(vitalSign)}
                        onCheckedChange={() => toggleAbnormalVitalSign(vitalSign)}
                      />
                      <Label htmlFor={`vitals-${vitalSign}`} className="text-xs">{vitalSign}</Label>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox 
                    id="all_other_vitals_normal" 
                    checked={formData.all_other_vitals_normal}
                    onCheckedChange={(checked) => handleInputChange('all_other_vitals_normal', checked === true)}
                  />
                  <Label htmlFor="all_other_vitals_normal" className="text-sm">
                    All other vital signs within normal limits
                  </Label>
                </div>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="dcap_btls" 
              checked={formData.dcap_btls}
              onCheckedChange={(checked) => handleInputChange('dcap_btls', checked === true)}
            />
            <Label htmlFor="dcap_btls" className="text-sm">
              🔹 Full assessment performed; no DCAP-BTLS noted throughout the body.
            </Label>
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
              onCheckedChange={(checked) => handleInputChange('add_protocol_treatments', checked === true)}
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
              onCheckedChange={(checked) => handleInputChange('refused_transport', checked === true)}
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
                <Input 
                  id="transport_destination"
                  placeholder="Enter hospital or facility"
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
              onCheckedChange={(checked) => handleInputChange('unit_in_service', checked === true)}
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
                <Input 
                  id="default_unit"
                  placeholder="Enter default unit designation"
                  value={formData.default_unit}
                  onChange={(e) => handleInputChange('default_unit', e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="default_hospital">Default Hospital</Label>
                <Input 
                  id="default_hospital"
                  placeholder="Enter default hospital name"
                  value={formData.default_hospital}
                  onChange={(e) => handleInputChange('default_hospital', e.target.value)}
                />
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedNarrativeForm;
