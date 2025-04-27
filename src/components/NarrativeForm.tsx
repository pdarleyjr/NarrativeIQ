import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from "sonner";
import { AlertCircle, Save, Copy } from 'lucide-react';
import { generateEmsNarrative, saveNarrative } from '@/lib/narrativeService';
import { useAuth } from '@/contexts/AuthContext';

interface NarrativeFormData {
  title: string;
  dispatch: string;
  response: string;
  arrival: string;
  assessment: string;
  treatment: string;
  transport: string;
  format_type: 'standard' | 'soap' | 'chart';
  use_abbreviations: boolean;
  include_headers: boolean;
}

const initialFormData: NarrativeFormData = {
  title: '',
  dispatch: '',
  response: '',
  arrival: '',
  assessment: '',
  treatment: '',
  transport: '',
  format_type: 'standard',
  use_abbreviations: true,
  include_headers: true
};

const defaultAssessment = `Patient is AAOx4, GCS-15, PERRL, no LOC.\nLung sounds clear bilaterally.\nVitals within normal limits.\nNo signs of DCAP-BTLS.`;

const NarrativeForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<NarrativeFormData>(initialFormData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedNarrative, setGeneratedNarrative] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dispatch");
  
  useEffect(() => {
    const savedDraft = localStorage.getItem('narrative_draft');
    if (savedDraft) {
      try {
        setFormData(JSON.parse(savedDraft));
      } catch (error) {
        console.error("Failed to parse saved draft", error);
      }
    }
  }, []);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem('narrative_draft', JSON.stringify(formData));
    }, 400);
    return () => clearTimeout(handler);
  }, [formData]);
  
  const handleInputChange = (field: keyof NarrativeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const setNormalAssessment = () => {
    handleInputChange('assessment', defaultAssessment);
  };
  
  const generateNarrative = async () => {
    if (!user) {
      toast.error("You must be logged in to generate narratives");
      return;
    }
    
    try {
      setIsGenerating(true);
      
      const runData = {
        chiefComplaint: formData.dispatch,
        assessment: formData.assessment,
        transport: {
          destination: formData.transport,
        },
      };
      
      const narrative = await generateEmsNarrative({
        userId: user.id,
        runData,
        format: formData.format_type,
      });
      
      setGeneratedNarrative(narrative);
    } catch (error) {
      console.error("Error generating narrative:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const saveGeneratedNarrative = async () => {
    if (!user || !generatedNarrative) return;
    
    if (!formData.title.trim()) {
      toast.error("Please enter a title for your narrative");
      return;
    }
    
    try {
      setIsSaving(true);
      await saveNarrative(
        user.id,
        formData.title,
        generatedNarrative,
        formData.format_type
      );
    } catch (error) {
      console.error("Error saving narrative:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const copyToClipboard = () => {
    if (generatedNarrative) {
      navigator.clipboard.writeText(generatedNarrative);
      toast.success("Copied to clipboard");
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Narrative Title</Label>
          <Input
            id="title"
            placeholder="Enter a title for your narrative"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          <Card className="flex-1 w-full">
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start overflow-auto">
                  <TabsTrigger value="dispatch">Dispatch</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                  <TabsTrigger value="arrival">Arrival</TabsTrigger>
                  <TabsTrigger value="assessment">Assessment</TabsTrigger>
                  <TabsTrigger value="treatment">Treatment</TabsTrigger>
                  <TabsTrigger value="transport">Transport</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="dispatch" className="pt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dispatch">Dispatch Information</Label>
                    <Textarea 
                      id="dispatch" 
                      placeholder="Enter dispatch details, location, nature of call..."
                      value={formData.dispatch}
                      onChange={(e) => handleInputChange('dispatch', e.target.value)}
                      rows={5}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="response" className="pt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="response">Response Details</Label>
                    <Textarea 
                      id="response"
                      placeholder="Describe your response, any delays, etc..."
                      value={formData.response}
                      onChange={(e) => handleInputChange('response', e.target.value)}
                      rows={5}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="arrival" className="pt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="arrival">Arrival Information</Label>
                    <Textarea 
                      id="arrival"
                      placeholder="Describe scene on arrival, patient's initial condition..."
                      value={formData.arrival}
                      onChange={(e) => handleInputChange('arrival', e.target.value)}
                      rows={5}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="assessment" className="pt-4 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 mb-2">
                    <Label htmlFor="assessment">Patient Assessment</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={setNormalAssessment}
                    >
                      Set Normal Findings
                    </Button>
                  </div>
                  <Textarea 
                    id="assessment"
                    placeholder="Describe assessment findings, vitals, observations..."
                    value={formData.assessment}
                    onChange={(e) => handleInputChange('assessment', e.target.value)}
                    rows={5}
                  />
                </TabsContent>
                
                <TabsContent value="treatment" className="pt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="treatment">Treatment Provided</Label>
                    <Textarea 
                      id="treatment"
                      placeholder="Describe interventions, medications, procedures..."
                      value={formData.treatment}
                      onChange={(e) => handleInputChange('treatment', e.target.value)}
                      rows={5}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="transport" className="pt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="transport">Transport Information</Label>
                    <Textarea 
                      id="transport"
                      placeholder="Describe transport destination, any incidents en route..."
                      value={formData.transport}
                      onChange={(e) => handleInputChange('transport', e.target.value)}
                      rows={5}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="pt-4 space-y-4">
                  <div className="space-y-4">
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="format">Narrative Format</Label>
                      <div className="flex flex-wrap gap-2">
                        {(['standard', 'soap', 'chart'] as const).map((format) => (
                          <Button 
                            key={format}
                            variant={formData.format_type === format ? "default" : "outline"}
                            onClick={() => handleInputChange('format_type', format)}
                          >
                            {format.charAt(0).toUpperCase() + format.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {generatedNarrative && (
            <Card className="flex-1 w-full">
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Generated Narrative</h3>
                  <div className="flex gap-2">
                    <Button onClick={copyToClipboard} variant="outline" size="sm" className="flex items-center gap-1">
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </Button>
                    <Button 
                      onClick={saveGeneratedNarrative} 
                      variant="outline" 
                      size="sm"
                      disabled={isSaving}
                      className="flex items-center gap-1"
                    >
                      <Save className="h-3.5 w-3.5" />
                      Save
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                  {generatedNarrative}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setFormData(initialFormData);
              setGeneratedNarrative(null);
              localStorage.removeItem('narrative_draft');
            }}
          >
            Clear Form
          </Button>
          <Button 
            onClick={generateNarrative} 
            disabled={isGenerating}
            className="button-gradient"
          >
            {isGenerating ? "Generating..." : "Generate Narrative"}
          </Button>
        </div>
        
        <div className="text-sm text-gray-500 p-2 rounded-md flex items-center gap-2 bg-gray-50 dark:bg-gray-900">
          <AlertCircle className="h-4 w-4" />
          <span>
            Narrative generation uses both the provided knowledge base and OpenAI to create the most accurate and compliant narratives.
          </span>
        </div>
      </div>
    </div>
  );
};

export default NarrativeForm;
