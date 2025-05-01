import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Bell, Heart, Search, Pill, Ambulance } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NarrativeFormData } from './types';

import DispatchForm from './DispatchForm';
import ArrivalForm from './ArrivalForm';
import AssessmentForm from './AssessmentForm';
import TreatmentForm from './TreatmentForm';
import TransportForm from './TransportForm';
import FormatOptionsForm from './FormatOptionsForm';

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
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);
  const [activePhase, setActivePhase] = useState("dispatch");
  const { control, handleSubmit, watch } = useForm<NarrativeFormData>({
    defaultValues: defaultFormData
  });

  const responseDelay = watch('response_delay');
  const isUnresponsive = watch('is_unresponsive');
  const vitalSignsNormal = watch('vital_signs_normal');
  const addProtocolTreatments = watch('add_protocol_treatments');
  const refusedTransport = watch('refused_transport');

  const onSubmit = (data: NarrativeFormData) => {
    onGenerateNarrative(data);
  };

  return (
    <motion.div
      className="flex flex-col h-full space-y-4 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 15 }}
    >
      <Card className="h-2/5 rounded-lg shadow-md w-full border-0 bg-white dark:bg-gray-800">
        <CardContent className="p-4 h-full">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Generated Narrative</h3>
            <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
              <svg className="h-3.5 w-3.5 mr-1" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00002H5.5C4.67158 4.00002 4 4.67159 4 5.50002V12.5C4 13.3284 4.67158 14 5.5 14H12.5C13.3284 14 14 13.3284 14 12.5V5.50002C14 4.67159 13.3284 4.00002 12.5 4.00002H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006H2.5C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50002C5 5.22388 5.22386 5.00002 5.5 5.00002H12.5C12.7761 5.00002 13 5.22388 13 5.50002V12.5C13 12.7762 12.7761 13 12.5 13H5.5C5.22386 13 5 12.7762 5 12.5V5.50002Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
              Copy
            </Button>
          </div>
          <ScrollArea className="h-[calc(100%-2.5rem)] rounded-md border p-3 bg-gray-50 dark:bg-gray-900">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {narrativeText}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      <Card className="h-3/5 rounded-lg shadow-md w-full overflow-hidden border-0 bg-white dark:bg-gray-800">
        <Collapsible
          open={isAdvancedOpen}
          onOpenChange={setIsAdvancedOpen}
          className="flex-1 overflow-hidden flex flex-col h-full"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="text-lg font-semibold">EMS Narrative Form</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2">
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
            <div className="h-full overflow-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4 h-full">
                <Tabs
                  defaultValue="dispatch"
                  value={activePhase}
                  onValueChange={setActivePhase}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-5 mb-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <TabsTrigger value="dispatch" className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-md">
                      <Bell className="h-4 w-4" />
                      <span className="text-xs">Dispatch</span>
                    </TabsTrigger>
                    <TabsTrigger value="arrival" className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-md">
                      <Heart className="h-4 w-4" />
                      <span className="text-xs">Arrival</span>
                    </TabsTrigger>
                    <TabsTrigger value="assessment" className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-md">
                      <Search className="h-4 w-4" />
                      <span className="text-xs">Assessment</span>
                    </TabsTrigger>
                    <TabsTrigger value="treatment" className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-md">
                      <Pill className="h-4 w-4" />
                      <span className="text-xs">Treatment</span>
                    </TabsTrigger>
                    <TabsTrigger value="transport" className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-md">
                      <Ambulance className="h-4 w-4" />
                      <span className="text-xs">Transport</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="dispatch" className="mt-0">
                    <fieldset className="border rounded-md p-3" style={{ padding: '8px' }}>
                      <legend className="px-2 font-semibold text-sm">Dispatch</legend>
                      <div className="w-full" style={{ maxHeight: 'calc(100% - 30px)', overflow: 'visible' }}>
                        <DispatchForm
                          control={control}
                          responseDelay={responseDelay}
                        />
                      </div>
                    </fieldset>
                  </TabsContent>
                  
                  <TabsContent value="arrival" className="mt-0">
                    <fieldset className="border rounded-md p-3" style={{ padding: '8px' }}>
                      <legend className="px-2 font-semibold text-sm">Patient Information</legend>
                      <div className="w-full" style={{ maxHeight: 'calc(100% - 30px)', overflow: 'visible' }}>
                        <ArrivalForm control={control} />
                      </div>
                    </fieldset>
                  </TabsContent>
                  
                  <TabsContent value="assessment" className="mt-0">
                    <fieldset className="border rounded-md p-3" style={{ padding: '8px' }}>
                      <legend className="px-2 font-semibold text-sm">Assessment</legend>
                      <div className="w-full" style={{ maxHeight: 'calc(100% - 30px)', overflow: 'visible' }}>
                        <AssessmentForm
                          control={control}
                          isUnresponsive={isUnresponsive}
                          vitalSignsNormal={vitalSignsNormal}
                        />
                      </div>
                    </fieldset>
                  </TabsContent>
                  
                  <TabsContent value="treatment" className="mt-0">
                    <fieldset className="border rounded-md p-3" style={{ padding: '8px' }}>
                      <legend className="px-2 font-semibold text-sm">Treatment</legend>
                      <div className="w-full" style={{ maxHeight: 'calc(100% - 30px)', overflow: 'visible' }}>
                        <TreatmentForm
                          control={control}
                          addProtocolTreatments={addProtocolTreatments}
                        />
                      </div>
                    </fieldset>
                  </TabsContent>
                  
                  <TabsContent value="transport" className="mt-0">
                    <fieldset className="border rounded-md p-3" style={{ padding: '8px' }}>
                      <legend className="px-2 font-semibold text-sm">Transport</legend>
                      <div className="w-full" style={{ maxHeight: 'calc(100% - 30px)', overflow: 'visible' }}>
                        <TransportForm
                          control={control}
                          refusedTransport={refusedTransport}
                        />
                      </div>
                    </fieldset>
                  </TabsContent>
                </Tabs>
                
                <fieldset className="border rounded-md p-3" style={{ padding: '8px' }}>
                  <legend className="px-2 font-semibold text-sm">Format Options</legend>
                  <FormatOptionsForm control={control} watch={watch} />
                </fieldset>
                
                <Button type="submit" className="w-full bg-ems-600 hover:bg-ems-700 text-white py-6 text-base font-medium">
                  Generate EMS Narrative
                </Button>
              </form>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {!isAdvancedOpen && (
          <div className="p-4 space-y-3">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border">
              <Textarea
                placeholder="Enter your narrative text here..."
                className="min-h-[150px] bg-transparent border-0 focus-visible:ring-0 p-0 resize-none"
                value={narrativeText}
                readOnly
              />
            </div>
            <Button
              onClick={() => setIsAdvancedOpen(true)}
              variant="outline"
              className="mt-2 w-full py-6 text-base"
            >
              Show Advanced Options
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default EMSPanel;