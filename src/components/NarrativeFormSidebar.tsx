
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  Clipboard,
  Settings
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
      
      <div className="flex items-center justify-between px-4 mb-2">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Narrative Details
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSettings}
          aria-label="Form settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full px-2">
        <TabsList className="grid grid-cols-4 w-full mb-4">
          <TabsTrigger value="dispatch" aria-label="Dispatch tab">Dispatch</TabsTrigger>
          <TabsTrigger value="patient" aria-label="Patient tab">Patient</TabsTrigger>
          <TabsTrigger value="assessment" aria-label="Assessment tab">Assessment</TabsTrigger>
          <TabsTrigger value="transport" aria-label="Transport tab">Transport</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[calc(100vh-170px)]">
          <div className="px-2 space-y-6">
            <TabsContent value="dispatch" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unit">Unit Number</Label>
                <Input id="unit" placeholder="e.g., M42, E15" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dispatch_reason">Dispatch Reason</Label>
                <Textarea 
                  id="dispatch_reason" 
                  placeholder="Enter dispatch details, location, nature of call..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="response_delay">Response Delay</Label>
                <select id="response_delay" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                  <option value="No response delays">No response delays</option>
                  <option value="Traffic congestion">Traffic congestion</option>
                  <option value="Weather conditions">Weather conditions</option>
                  <option value="Multiple calls">Multiple calls</option>
                  <option value="Custom">Custom reason</option>
                </select>
              </div>
            </TabsContent>
            
            <TabsContent value="patient" className="mt-0 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient_sex">Patient Sex</Label>
                  <select id="patient_sex" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="patient_age">Patient Age</Label>
                  <Input id="patient_age" placeholder="Age" type="number" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="chief_complaint">Chief Complaint</Label>
                <Textarea 
                  id="chief_complaint" 
                  placeholder="Patient's primary complaint..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" placeholder="e.g., 2 hours, 3 days" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="patient_presentation">Presentation</Label>
                <Textarea 
                  id="patient_presentation" 
                  placeholder="Describe how the patient presented..."
                  rows={3}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="assessment" className="mt-0 space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md text-amber-800 dark:text-amber-200 text-sm flex items-start gap-2">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  Complete the assessment fields to generate a detailed narrative. Fields marked with * are required.
                </div>
              </div>
              
              <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                <Label>Mental Status</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="aao_person" defaultChecked />
                    <Label htmlFor="aao_person">Alert to Person</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="aao_place" defaultChecked />
                    <Label htmlFor="aao_place">Alert to Place</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="aao_time" defaultChecked />
                    <Label htmlFor="aao_time">Alert to Time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="aao_event" defaultChecked />
                    <Label htmlFor="aao_event">Alert to Event</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="is_unresponsive" />
                  <Label htmlFor="is_unresponsive">Patient is unresponsive</Label>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gcs_score">GCS Score</Label>
                  <Input id="gcs_score" defaultValue="15" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pupils">Pupils</Label>
                  <Input id="pupils" defaultValue="PERRL" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additional_assessment">Additional Assessment Notes</Label>
                <Textarea 
                  id="additional_assessment" 
                  placeholder="Any additional assessment findings..."
                  rows={3}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="transport" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="treatment_provided">Treatment Provided</Label>
                <Textarea 
                  id="treatment_provided" 
                  placeholder="Describe interventions, medications, procedures..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="refused_transport" />
                  <Label htmlFor="refused_transport">Patient refused transport</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transport_destination">Transport Destination</Label>
                <Input id="transport_destination" placeholder="Hospital name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transport_position">Transport Position</Label>
                <select id="transport_position" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                  <option value="Position of comfort">Position of comfort</option>
                  <option value="Supine">Supine</option>
                  <option value="Fowlers">Fowlers</option>
                  <option value="Left lateral recumbent">Left lateral recumbent</option>
                  <option value="Right lateral recumbent">Right lateral recumbent</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="room_number">Room #</Label>
                  <Input id="room_number" placeholder="Room number" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nurse_name">RN Name</Label>
                  <Input id="nurse_name" placeholder="Nurse name" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="unit_in_service" defaultChecked />
                  <Label htmlFor="unit_in_service">Unit returned to service</Label>
                </div>
              </div>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <Button 
          className="w-full button-gradient"
          onClick={onSubmit}
          aria-label="Generate narrative"
        >
          Generate Narrative
        </Button>
      </div>
    </div>
  );
};

export default NarrativeFormSidebar;
