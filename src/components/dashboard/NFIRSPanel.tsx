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
import nfirsData from '@/data/NFIRS.json';

interface NFIRSPanelProps {
  reportText?: string;
  onGenerateReport: (data: any) => void;
}

const NFIRSPanel: React.FC<NFIRSPanelProps> = ({ 
  reportText = "No NFIRS report generated yet. Fill out the form below and click 'Generate Report'.",
  onGenerateReport
}) => {
  const isMobile = useIsMobile();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);
  const { control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    onGenerateReport(data);
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
          <h3 className="text-lg font-semibold mb-2">Generated NFIRS Report</h3>
          <div className="whitespace-pre-wrap text-sm">
            {reportText}
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
            <h3 className="text-lg font-semibold">NFIRS Form</h3>
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
                {nfirsData.nfirs_guide.modules.map((module) => (
                  <fieldset key={module.module_code} className="border rounded-md p-4">
                    <legend className="px-2 font-semibold text-sm">{module.module_name}</legend>
                    <div className="space-y-4">
                      {module.sections.map((section) => (
                        <div key={section.section_name} className="space-y-2">
                          <h4 className="text-sm font-medium">{section.section_name}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {section.fields.map((field) => (
                              <div key={field.field_name} className="space-y-1">
                                <Label htmlFor={`${module.module_code}.${field.field_name}`} className="text-xs">
                                  {field.field_name} {field.required && <span className="text-red-500">*</span>}
                                </Label>
                                <Controller
                                  name={`${module.module_code}.${field.field_name}`}
                                  control={control}
                                  defaultValue=""
                                  rules={{ required: field.required }}
                                  render={({ field: formField }) => {
                                    switch (field.field_type) {
                                      case 'select':
                                        return (
                                          <Select
                                            onValueChange={formField.onChange}
                                            defaultValue={formField.value}
                                          >
                                            <SelectTrigger id={`${module.module_code}.${field.field_name}`}>
                                              <SelectValue placeholder={`Select ${field.field_name}`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="option1">Option 1</SelectItem>
                                              <SelectItem value="option2">Option 2</SelectItem>
                                              <SelectItem value="option3">Option 3</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        );
                                      case 'date':
                                        return (
                                          <Input
                                            type="date"
                                            id={`${module.module_code}.${field.field_name}`}
                                            {...formField}
                                          />
                                        );
                                      case 'time':
                                        return (
                                          <Input
                                            type="time"
                                            id={`${module.module_code}.${field.field_name}`}
                                            {...formField}
                                          />
                                        );
                                      case 'number':
                                        return (
                                          <Input
                                            type="number"
                                            id={`${module.module_code}.${field.field_name}`}
                                            {...formField}
                                          />
                                        );
                                      default:
                                        return (
                                          <Input
                                            type="text"
                                            id={`${module.module_code}.${field.field_name}`}
                                            {...formField}
                                          />
                                        );
                                    }
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                ))}
                
                <Button type="submit" className="w-full">Generate NFIRS Report</Button>
              </form>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
        
        {!isAdvancedOpen && (
          <div className="p-4">
            <Textarea 
              placeholder="Enter your NFIRS report text here..." 
              className="min-h-[150px]"
              value={reportText}
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

export default NFIRSPanel;