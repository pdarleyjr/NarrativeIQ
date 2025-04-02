
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, Download, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "sonner";

const ViewNarrative = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"view" | "analysis">("view");
  
  // Mock data that would come from an API in a real implementation
  const narrative = {
    title: `Narrative #${id}`,
    date: "June 15, 2023",
    content: `EMS NARRATIVE REPORT

=== DISPATCH ===
Dispatched to 123 Main St for a medical emergency involving a 45-year-old male with chest pain.

=== RESPONSE ===
Unit responded without delay. Arrived on scene at 14:35.

=== ARRIVAL ===
Upon arrival, found patient sitting upright in a chair, clutching his chest, visibly in distress. Patient states, "It feels like an elephant is sitting on my chest."

=== ASSESSMENT ===
Patient is AAOx4, GCS-15, PERRL, no LOC.
Lung sounds clear bilaterally.
Vitals: BP 165/95, HR 92, RR 22, SpO2 95% on RA, BGL 110 mg/dL.
12-lead ECG shows ST elevation in leads II, III, and aVF.
No signs of DCAP-BTLS.

=== TREATMENT ===
Administered 324mg ASA PO.
Established IV access, 18g in L AC.
Administered 0.4mg NTG SL x1 with BP reassessment.
Administered 4mg morphine IV for pain management.
Continuous cardiac monitoring during transport.

=== TRANSPORT ===
Patient transported to Memorial Hospital cardiac center with report called en route.
Patient remained stable throughout transport.
Care transferred to ED staff at 15:10.`,
    analysis: {
      completeness: "High",
      clarity: "Excellent",
      medicalTerms: 12,
      potentialIssues: "None detected",
      improvementSuggestions: "Consider adding more details about the patient's medical history if available."
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(narrative.content);
    toast.success("Copied to clipboard");
  };
  
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([narrative.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `narrative-${id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Narrative downloaded");
  };

  const handleSaveAsPreset = () => {
    // This would normally extract the data from the narrative 
    // and save it as a form preset
    localStorage.setItem('narrative_preset', JSON.stringify({
      title: narrative.title,
      date: new Date().toISOString(),
    }));
    toast.success("Saved as preset for future narratives");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-ems-600 dark:text-ems-400">
              {narrative.title}
            </h1>
          </div>
          <Button variant="outline" onClick={() => navigate('/create-narrative')} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Narratives
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-6">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{narrative.title}</CardTitle>
                <CardDescription>
                  Created on {narrative.date}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSaveAsPreset} className="flex items-center gap-1">
                  <Save className="h-4 w-4" />
                  Save As Preset
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopyToClipboard} className="flex items-center gap-1">
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload} className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "view" | "analysis")}>
              <TabsList>
                <TabsTrigger value="view">Narrative</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>
              <TabsContent value="view">
                <div className="whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-6 rounded-md font-mono text-sm">
                  {narrative.content}
                </div>
              </TabsContent>
              <TabsContent value="analysis">
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Completeness</h3>
                      <p className="text-sm">{narrative.analysis.completeness}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Clarity</h3>
                      <p className="text-sm">{narrative.analysis.clarity}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Medical Terms Used</h3>
                      <p className="text-sm">{narrative.analysis.medicalTerms}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Potential Issues</h3>
                      <p className="text-sm">{narrative.analysis.potentialIssues}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Suggestions for Improvement</h3>
                    <p className="text-sm">{narrative.analysis.improvementSuggestions}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ViewNarrative;
