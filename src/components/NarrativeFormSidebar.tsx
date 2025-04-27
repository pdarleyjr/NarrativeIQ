
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  Clipboard,
  Settings,
  Info,
  Heart,
  Activity,
  Thermometer,
  Pill,
  Ambulance,
  FileText,
  PlusCircle
} from 'lucide-react';

interface NarrativeFormSidebarProps {
  visible: boolean;
  toggleSidebar: () => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  onSubmit: () => void;
  onOpenSettings: () => void;
}

const NarrativeFormSidebar = ({
  visible,
  toggleSidebar,
  activeTab,
  onTabChange,
  onSubmit,
  onOpenSettings
}: NarrativeFormSidebarProps) => {
  const [autoSave, setAutoSave] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 pt-16 pb-4 z-10 transform transition-transform duration-300 ease-in-out ${
        visible ? 'translate-x-0' : 'translate-x-full'
      }`}
      aria-label="Narrative form sidebar"
      aria-hidden={!visible}
    >
      <div className="absolute -left-8 top-1/2 -translate-y-1/2">
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-8 w-8 rounded-full shadow-md"
          onClick={toggleSidebar}
          aria-label={visible ? "Hide form sidebar" : "Show form sidebar"}
        >
          {visible ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Patient Care Report
        </h2>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  aria-label="Toggle advanced fields"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle advanced fields</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={onOpenSettings}
                  aria-label="Form settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Narrative settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full px-2">
        <TabsList className="grid grid-cols-5 w-full mb-4">
          <TabsTrigger value="dispatch" aria-label="Dispatch tab" className="flex flex-col items-center p-2 text-xs">
            <Ambulance className="h-4 w-4 mb-1" />
            <span>Dispatch</span>
          </TabsTrigger>
          <TabsTrigger value="patient" aria-label="Patient tab" className="flex flex-col items-center p-2 text-xs">
            <Heart className="h-4 w-4 mb-1" />
            <span>Patient</span>
          </TabsTrigger>
          <TabsTrigger value="assessment" aria-label="Assessment tab" className="flex flex-col items-center p-2 text-xs">
            <Activity className="h-4 w-4 mb-1" />
            <span>Assessment</span>
          </TabsTrigger>
          <TabsTrigger value="treatment" aria-label="Treatment tab" className="flex flex-col items-center p-2 text-xs">
            <Pill className="h-4 w-4 mb-1" />
            <span>Treatment</span>
          </TabsTrigger>
          <TabsTrigger value="transport" aria-label="Transport tab" className="flex flex-col items-center p-2 text-xs">
            <FileText className="h-4 w-4 mb-1" />
            <span>Transport</span>
          </TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[calc(100vh-170px)]">
          <div className="px-2 space-y-6">
            <TabsContent value="dispatch" className="mt-0 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="unit" className="text-sm font-medium">Unit Number</Label>
                  <Badge variant="outline" className="text-xs bg-ems-50 text-ems-700 dark:bg-ems-900/20 dark:text-ems-400">Required</Badge>
                </div>
                <Input id="unit" placeholder="e.g., M42, E15" className="h-9" />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dispatch_reason" className="text-sm font-medium">Dispatch Reason</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-500">
                          <Info className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">Include the dispatch reason, location, and nature of the call</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Textarea 
                  id="dispatch_reason" 
                  placeholder="Enter dispatch details, location, nature of call..."
                  rows={3}
                  className="resize-none"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="response_delay" className="text-sm font-medium">Response Delay</Label>
                <Select defaultValue="No response delays">
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select response delay" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No response delays">No response delays</SelectItem>
                    <SelectItem value="Traffic congestion">Traffic congestion</SelectItem>
                    <SelectItem value="Weather conditions">Weather conditions</SelectItem>
                    <SelectItem value="Multiple calls">Multiple calls</SelectItem>
                    <SelectItem value="Custom">Custom reason</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {showAdvanced && (
                <>
                  <div className="space-y-3">
                    <Label htmlFor="incident_number" className="text-sm font-medium">Incident Number</Label>
                    <Input id="incident_number" placeholder="e.g., 2023-12345" className="h-9" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="dispatch_priority" className="text-sm font-medium">Dispatch Priority</Label>
                    <Select defaultValue="2">
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Priority 1 - Emergent</SelectItem>
                        <SelectItem value="2">Priority 2 - Urgent</SelectItem>
                        <SelectItem value="3">Priority 3 - Non-urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="patient" className="mt-0 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="patient_sex" className="text-sm font-medium">Patient Sex</Label>
                  <Select>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="patient_age" className="text-sm font-medium">Patient Age</Label>
                  <Input id="patient_age" placeholder="Age" type="number" className="h-9" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="chief_complaint" className="text-sm font-medium">Chief Complaint</Label>
                  <Badge variant="outline" className="text-xs bg-ems-50 text-ems-700 dark:bg-ems-900/20 dark:text-ems-400">Required</Badge>
                </div>
                <Textarea 
                  id="chief_complaint" 
                  placeholder="Patient's primary complaint..."
                  rows={3}
                  className="resize-none"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="duration" className="text-sm font-medium">Duration</Label>
                <Input id="duration" placeholder="e.g., 2 hours, 3 days" className="h-9" />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="patient_presentation" className="text-sm font-medium">Presentation</Label>
                <Textarea 
                  id="patient_presentation" 
                  placeholder="Describe how the patient presented..."
                  rows={3}
                  className="resize-none"
                />
              </div>
              
              {showAdvanced && (
                <>
                  <div className="space-y-3">
                    <Label htmlFor="allergies" className="text-sm font-medium">Allergies</Label>
                    <Textarea
                      id="allergies" 
                      placeholder="Known allergies..."
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="medications" className="text-sm font-medium">Current Medications</Label>
                    <Textarea
                      id="medications" 
                      placeholder="Current medications..."
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="assessment" className="mt-0 space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md text-amber-800 dark:text-amber-200 text-sm flex items-start gap-2">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  Complete the assessment fields to generate a detailed narrative. Fields marked with <span className="text-ems-700 dark:text-ems-400">•</span> are required.
                </div>
              </div>
              
              <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                <Label className="text-sm font-medium">Mental Status</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="aao_person" defaultChecked />
                    <Label htmlFor="aao_person" className="text-sm">Alert to Person</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="aao_place" defaultChecked />
                    <Label htmlFor="aao_place" className="text-sm">Alert to Place</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="aao_time" defaultChecked />
                    <Label htmlFor="aao_time" className="text-sm">Alert to Time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="aao_event" defaultChecked />
                    <Label htmlFor="aao_event" className="text-sm">Alert to Event</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch id="is_unresponsive" />
                  <Label htmlFor="is_unresponsive" className="text-sm">Patient is unresponsive</Label>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="gcs_score" className="text-sm font-medium">GCS Score</Label>
                  <div className="relative">
                    <Input id="gcs_score" defaultValue="15" className="h-9 pr-8" />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 absolute right-1 top-2 text-gray-500">
                            <Info className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Glasgow Coma Scale (3-15)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="pupils" className="text-sm font-medium">Pupils</Label>
                  <Input id="pupils" defaultValue="PERRL" className="h-9" />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="vital_signs" className="text-sm font-medium">Vital Signs</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="bp" className="text-xs text-gray-500">Blood Pressure</Label>
                    <Input id="bp" placeholder="e.g., 120/80" className="h-8" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hr" className="text-xs text-gray-500">Heart Rate</Label>
                    <Input id="hr" placeholder="e.g., 72" className="h-8" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rr" className="text-xs text-gray-500">Resp Rate</Label>
                    <Input id="rr" placeholder="e.g., 16" className="h-8" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spo2" className="text-xs text-gray-500">SpO2</Label>
                    <Input id="spo2" placeholder="e.g., 98%" className="h-8" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="additional_assessment" className="text-sm font-medium">Additional Assessment Notes</Label>
                <Textarea 
                  id="additional_assessment" 
                  placeholder="Any additional assessment findings..."
                  rows={3}
                  className="resize-none"
                />
              </div>
              
              {showAdvanced && (
                <>
                  <div className="space-y-3">
                    <Label htmlFor="secondary_assessment" className="text-sm font-medium">Secondary Assessment</Label>
                    <Textarea 
                      id="secondary_assessment" 
                      placeholder="Secondary assessment findings..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">DCAP-BTLS Assessment</Label>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Switch id="dcap_head" defaultChecked />
                        <Label htmlFor="dcap_head" className="text-sm">Head</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="dcap_neck" defaultChecked />
                        <Label htmlFor="dcap_neck" className="text-sm">Neck</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="dcap_chest" defaultChecked />
                        <Label htmlFor="dcap_chest" className="text-sm">Chest</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="dcap_abdomen" defaultChecked />
                        <Label htmlFor="dcap_abdomen" className="text-sm">Abdomen</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="dcap_pelvis" defaultChecked />
                        <Label htmlFor="dcap_pelvis" className="text-sm">Pelvis</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="dcap_extremities" defaultChecked />
                        <Label htmlFor="dcap_extremities" className="text-sm">Extremities</Label>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="treatment" className="mt-0 space-y-4">
              <div className="space-y-3">
                <Label htmlFor="treatment_provided" className="text-sm font-medium">Treatment Provided</Label>
                <Textarea 
                  id="treatment_provided" 
                  placeholder="Describe interventions, medications, procedures..."
                  rows={3}
                  className="resize-none"
                />
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium">Medications Administered</Label>
                <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="med_name" className="text-xs text-gray-500">Medication</Label>
                      <Input id="med_name" placeholder="e.g., Epinephrine" className="h-8" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="med_dose" className="text-xs text-gray-500">Dose</Label>
                      <Input id="med_dose" placeholder="e.g., 1:10,000 1mg" className="h-8" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="med_route" className="text-xs text-gray-500">Route</Label>
                      <Select defaultValue="IV">
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select route" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IV">IV</SelectItem>
                          <SelectItem value="IM">IM</SelectItem>
                          <SelectItem value="IO">IO</SelectItem>
                          <SelectItem value="PO">PO</SelectItem>
                          <SelectItem value="SL">SL</SelectItem>
                          <SelectItem value="IN">IN</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="med_time" className="text-xs text-gray-500">Time</Label>
                      <Input id="med_time" placeholder="e.g., 14:30" className="h-8" />
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full h-7 mt-1">
                    <PlusCircle className="h-3.5 w-3.5 mr-1" />
                    Add Medication
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium">Procedures</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="proc_airway" />
                    <Label htmlFor="proc_airway" className="text-sm">Airway Management</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="proc_iv" />
                    <Label htmlFor="proc_iv" className="text-sm">IV Access</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="proc_cardiac" />
                    <Label htmlFor="proc_cardiac" className="text-sm">Cardiac Monitoring</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="proc_splinting" />
                    <Label htmlFor="proc_splinting" className="text-sm">Splinting</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch id="add_protocol_treatments" />
                  <Label htmlFor="add_protocol_treatments" className="text-sm">Treatment per protocol</Label>
                </div>
              </div>
              
              {showAdvanced && (
                <div className="space-y-3">
                  <Label htmlFor="treatment_response" className="text-sm font-medium">Patient Response to Treatment</Label>
                  <Textarea 
                    id="treatment_response" 
                    placeholder="Describe how the patient responded to treatments..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="transport" className="mt-0 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch id="refused_transport" />
                  <Label htmlFor="refused_transport" className="text-sm">Patient refused transport</Label>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="transport_destination" className="text-sm font-medium">Transport Destination</Label>
                <Input id="transport_destination" placeholder="Hospital name" className="h-9" />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="transport_position" className="text-sm font-medium">Transport Position</Label>
                <Select defaultValue="Position of comfort">
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Position of comfort">Position of comfort</SelectItem>
                    <SelectItem value="Supine">Supine</SelectItem>
                    <SelectItem value="Fowlers">Fowlers</SelectItem>
                    <SelectItem value="Left lateral recumbent">Left lateral recumbent</SelectItem>
                    <SelectItem value="Right lateral recumbent">Right lateral recumbent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="room_number" className="text-sm font-medium">Room #</Label>
                  <Input id="room_number" placeholder="Room number" className="h-9" />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="nurse_name" className="text-sm font-medium">RN Name</Label>
                  <Input id="nurse_name" placeholder="Nurse name" className="h-9" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch id="unit_in_service" defaultChecked />
                  <Label htmlFor="unit_in_service" className="text-sm">Unit returned to service</Label>
                </div>
              </div>
              
              {showAdvanced && (
                <>
                  <div className="space-y-3">
                    <Label htmlFor="transport_mode" className="text-sm font-medium">Transport Mode</Label>
                    <Select defaultValue="Emergent">
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Emergent">Emergent (Lights & Siren)</SelectItem>
                        <SelectItem value="Non-emergent">Non-emergent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="transport_time" className="text-sm font-medium">Transport Time (min)</Label>
                    <Input id="transport_time" placeholder="e.g., 12" type="number" className="h-9" />
                  </div>
                </>
              )}
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Switch id="auto_save" checked={autoSave} onCheckedChange={setAutoSave} />
            <Label htmlFor="auto_save" className="text-xs text-gray-500">Auto-save</Label>
          </div>
          <span className="text-xs text-gray-500">Last saved: 2 min ago</span>
        </div>
        <Button 
          className="w-full button-gradient"
          onClick={onSubmit}
          aria-label="Generate narrative"
        >
          <FileText className="h-4 w-4 mr-2" />
          Generate Narrative
        </Button>
      </div>
    </div>
  );
};

export default NarrativeFormSidebar;
