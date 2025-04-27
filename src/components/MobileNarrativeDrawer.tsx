
import React from "react";
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Clipboard, 
  Car, 
  User, 
  Activity, 
  Stethoscope, 
  Pill, 
  Ambulance, 
  Settings,
  X  
} from "lucide-react";

interface MobileNarrativeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerateNarrative: () => void;
}

export function MobileNarrativeDrawer({
  open,
  onOpenChange,
  onGenerateNarrative
}: MobileNarrativeDrawerProps) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = React.useState("dispatch");

  if (!isMobile) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="max-h-[85vh] overflow-auto pb-8">
          <DrawerHeader className="sticky top-0 z-10 bg-background pb-2 pt-6">
            <div className="flex items-center justify-between">
              <DrawerTitle>Narrative Details</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-4 h-auto mt-2 bg-muted/50">
                <TabsTrigger value="dispatch" className="px-0 py-1.5">
                  <Clipboard className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Dispatch</span>
                </TabsTrigger>
                <TabsTrigger value="patient" className="px-0 py-1.5">
                  <User className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Patient</span>
                </TabsTrigger>
                <TabsTrigger value="assessment" className="px-0 py-1.5">
                  <Stethoscope className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Assessment</span>
                </TabsTrigger>
                <TabsTrigger value="treatment" className="px-0 py-1.5">
                  <Pill className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Treatment</span>
                </TabsTrigger>
              </TabsList>
              <TabsList className="w-full grid grid-cols-4 h-auto mt-1 bg-muted/50">
                <TabsTrigger value="transport" className="px-0 py-1.5">
                  <Ambulance className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Transport</span>
                </TabsTrigger>
                <TabsTrigger value="vitals" className="px-0 py-1.5">
                  <Activity className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Vitals</span>
                </TabsTrigger>
                <TabsTrigger value="unit" className="px-0 py-1.5">
                  <Car className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Unit</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="px-0 py-1.5">
                  <Settings className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Format</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </DrawerHeader>

          <div className="px-4 pt-4 pb-16">
            <TabsContent value="dispatch" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="unit">Unit Number</Label>
                <Input id="unit" placeholder="e.g. Medic 42" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dispatch_reason">Dispatch Reason</Label>
                <Input id="dispatch_reason" placeholder="e.g. Chest Pain" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g. 123 Main St" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delay">Response Delay</Label>
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="delay_switch">No response delays</Label>
                  </div>
                  <Switch id="delay_switch" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="patient" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="Age" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select 
                    id="gender" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="chief_complaint">Chief Complaint</Label>
                <Textarea 
                  id="chief_complaint" 
                  placeholder="Chief complaint as stated by patient"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration of Symptoms</Label>
                <Input id="duration" placeholder="e.g. 2 hours" />
              </div>
            </TabsContent>

            <TabsContent value="assessment" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label>Patient Status</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between rounded-md border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="conscious">Conscious</Label>
                    </div>
                    <Switch id="conscious" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="alert">Alert</Label>
                    </div>
                    <Switch id="alert" defaultChecked />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gcs">GCS Score</Label>
                <Input id="gcs" type="number" placeholder="15" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pupils">Pupils</Label>
                <select 
                  id="pupils" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="PERRL">PERRL</option>
                  <option value="sluggish">Sluggish</option>
                  <option value="dilated">Dilated</option>
                  <option value="constricted">Constricted</option>
                  <option value="unequal">Unequal</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assessment_notes">Additional Assessment</Label>
                <Textarea 
                  id="assessment_notes" 
                  placeholder="Additional assessment details"
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="treatment" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="treatment_provided">Treatment Provided</Label>
                <Textarea 
                  id="treatment_provided" 
                  placeholder="Describe interventions, medications, procedures..."
                  rows={5}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="protocol_treatments" />
                <Label htmlFor="protocol_treatments">Add protocol treatments</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="protocol_exclusions">Protocol Exclusions</Label>
                <Input id="protocol_exclusions" placeholder="Any protocol exclusions" />
              </div>
            </TabsContent>

            <TabsContent value="transport" className="space-y-4 mt-0">
              <div className="flex items-center space-x-2 pb-4">
                <Switch id="refused_transport" />
                <Label htmlFor="refused_transport">Patient refused transport</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Transport Destination</Label>
                <Input id="destination" placeholder="e.g. Memorial Hospital" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Transport Position</Label>
                <select 
                  id="position" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="position_of_comfort">Position of comfort</option>
                  <option value="supine">Supine</option>
                  <option value="semi_fowlers">Semi-Fowler's</option>
                  <option value="recovery">Recovery position</option>
                  <option value="trendelenburg">Trendelenburg</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="room">Room #</Label>
                  <Input id="room" placeholder="Room number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nurse">Nurse Name</Label>
                  <Input id="nurse" placeholder="Receiving nurse" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label>Narrative Format</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start">
                    D.R.A.T.T.
                  </Button>
                  <Button variant="outline" className="justify-start">
                    S.O.A.P.
                  </Button>
                  <Button variant="outline" className="justify-start">
                    C.H.A.R.T.
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Custom
                  </Button>
                </div>
              </div>
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Switch id="abbreviations" defaultChecked />
                  <Label htmlFor="abbreviations">Use EMS Abbreviations</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="headers" defaultChecked />
                  <Label htmlFor="headers">Include Section Headers</Label>
                </div>
              </div>
            </TabsContent>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t z-10">
            <Button 
              className="w-full" 
              onClick={() => {
                onGenerateNarrative();
                onOpenChange(false);
              }}
            >
              Generate Narrative
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
