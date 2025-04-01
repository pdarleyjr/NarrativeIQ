import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { toast } from "sonner";
import { format } from 'date-fns';
import ChatSession from '@/components/ChatSession';
import SessionList from '@/components/SessionList';
import NarrativeOptionsPanel from '@/components/NarrativeOptionsPanel';

interface Message {
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Session {
  id: string;
  name: string;
  date: string;
  messages: Message[];
  active?: boolean;
}

interface NarrativeFormData {
  dispatch: string;
  response: string;
  arrival: string;
  assessment: string;
  treatment: string;
  transport: string;
}

interface NarrativeOptions {
  format: 'standard' | 'chronological' | 'soap';
  useAbbreviations: boolean;
  includeHeaders: boolean;
}

const initialFormData: NarrativeFormData = {
  dispatch: '',
  response: '',
  arrival: '',
  assessment: '',
  treatment: '',
  transport: ''
};

const initialOptions: NarrativeOptions = {
  format: 'standard',
  useAbbreviations: true,
  includeHeaders: true
};

const defaultAssessment = `Patient is AAOx4, GCS-15, PERRL, no LOC.\nLung sounds clear bilaterally.\nVitals within normal limits.\nNo signs of DCAP-BTLS.`;

const CreateNarrative = () => {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState('');
  const [formData, setFormData] = useState<NarrativeFormData>(initialFormData);
  const [options, setOptions] = useState<NarrativeOptions>(initialOptions);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dispatch");
  
  useEffect(() => {
    const newSessionId = createNewSession();
    setActiveSession(newSessionId);
    
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
  
  const createNewSession = () => {
    const id = `session-${Date.now()}`;
    const date = new Date();
    const newSession: Session = {
      id,
      name: `Session ${format(date, 'MMM d, yyyy hh:mm a')}`,
      date: format(date, 'MMM d, yyyy'),
      messages: [],
      active: true,
    };
    
    setSessions(prev => {
      const updatedSessions = prev.map(s => ({...s, active: false}));
      return [...updatedSessions, newSession];
    });
    
    return id;
  };
  
  const handleNewSession = () => {
    const newSessionId = createNewSession();
    setActiveSession(newSessionId);
    setFormData(initialFormData);
    setUserInput('');
    setSidebarOpen(false);
  };
  
  const handleSelectSession = (id: string) => {
    setActiveSession(id);
    setSessions(prev => 
      prev.map(s => ({
        ...s,
        active: s.id === id
      }))
    );
    setSidebarOpen(false);
  };
  
  const handleRenameSession = (id: string) => {
    const newName = prompt("Enter a new name for this session");
    if (newName) {
      setSessions(prev => 
        prev.map(s => s.id === id ? {...s, name: newName} : s)
      );
    }
  };
  
  const handleDeleteSession = (id: string) => {
    if (confirm("Are you sure you want to delete this session?")) {
      setSessions(prev => prev.filter(s => s.id !== id));
      
      if (activeSession === id) {
        if (sessions.length > 1) {
          const remaining = sessions.filter(s => s.id !== id);
          setActiveSession(remaining[0].id);
        } else {
          handleNewSession();
        }
      }
    }
  };
  
  const handleInputChange = (field: keyof NarrativeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const setNormalAssessment = () => {
    handleInputChange('assessment', defaultAssessment);
  };
  
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    const currentTime = format(new Date(), 'hh:mm a');
    const userMessage: Message = {
      type: 'user',
      content: userInput,
      timestamp: currentTime
    };
    
    addMessageToSession(userMessage);
    setUserInput('');
    
    setIsGenerating(true);
    setTimeout(() => {
      generateResponse(userInput);
      setIsGenerating(false);
    }, 1500);
  };
  
  const addMessageToSession = (message: Message) => {
    if (!activeSession) return;
    
    setSessions(prev => prev.map(s => {
      if (s.id === activeSession) {
        return {
          ...s,
          messages: [...s.messages, message]
        };
      }
      return s;
    }));
  };
  
  const generateResponse = (input: string) => {
    const currentTime = format(new Date(), 'hh:mm a');
    
    if (input.toLowerCase().includes('generate') || 
        input.toLowerCase().includes('create narrative') || 
        input.toLowerCase().includes('new narrative')) {
      generateNarrative();
      return;
    }
    
    const assistantMessage: Message = {
      type: 'assistant',
      content: `I've received your message: "${input}". How can I help with your EMS narrative?`,
      timestamp: currentTime
    };
    
    addMessageToSession(assistantMessage);
  };
  
  const generateNarrative = () => {
    if (!activeSession) return;
    
    if (!formData.dispatch || !formData.assessment) {
      toast.error("Please fill in at least the Dispatch and Assessment fields");
      return;
    }
    
    const currentTime = format(new Date(), 'hh:mm a');
    
    const mockResponse = `
EMS NARRATIVE REPORT
${options.includeHeaders ? '=== DISPATCH ===\n' : ''}
Dispatched to ${formData.dispatch || '[location]'} for a medical emergency.

${options.includeHeaders ? '=== RESPONSE ===\n' : ''}
${formData.response || 'Unit responded without delay.'}

${options.includeHeaders ? '=== ARRIVAL ===\n' : ''}
Upon arrival, ${formData.arrival || 'found patient with the following complaints.'}

${options.includeHeaders ? '=== ASSESSMENT ===\n' : ''}
${formData.assessment || 'Patient assessment revealed...'}

${options.includeHeaders ? '=== TREATMENT ===\n' : ''}
${formData.treatment || 'Treatment provided according to protocol.'}

${options.includeHeaders ? '=== TRANSPORT ===\n' : ''}
${formData.transport || 'Patient transported to nearest appropriate facility.'}`;

    const assistantMessage: Message = {
      type: 'assistant',
      content: mockResponse,
      timestamp: currentTime
    };
    
    addMessageToSession(assistantMessage);
    toast.success("Narrative generated successfully");
  };
  
  const activeSessionData = sessions.find(s => s.id === activeSession);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <line x1="3" x2="21" y1="6" y2="6" />
                    <line x1="3" x2="21" y1="12" y2="12" />
                    <line x1="3" x2="21" y1="18" y2="18" />
                  </svg>
                  <span className="sr-only">Toggle sessions</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0">
                <SessionList 
                  sessions={sessions}
                  onNewSession={handleNewSession}
                  onSelectSession={handleSelectSession}
                  onRenameSession={handleRenameSession}
                  onDeleteSession={handleDeleteSession}
                />
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold text-ems-600 dark:text-ems-400">
              {activeSessionData?.name || "Narrative Generator"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              onClick={handleNewSession}
            >
              <PlusCircle className="h-4 w-4" />
              New Session
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-6 flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 h-full">
          <div className="flex flex-col h-full">
            <Card className="mb-4 flex-1 flex flex-col">
              <CardContent className="p-0 overflow-hidden flex flex-col h-full">
                <ChatSession 
                  messages={activeSessionData?.messages || []}
                />
                
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Type your message here..."
                      className="min-h-[80px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      className="self-end"
                      onClick={handleSendMessage}
                      disabled={isGenerating || !userInput.trim()}
                    >
                      {isGenerating ? "Generating..." : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              onClick={generateNarrative}
              disabled={isGenerating}
              className="w-full mb-4"
            >
              Generate Narrative
            </Button>
          </div>
          
          <div className="space-y-4">
            <NarrativeOptionsPanel 
              format={options.format}
              useAbbreviations={options.useAbbreviations}
              includeHeaders={options.includeHeaders}
              onUpdateOptions={setOptions}
            />
            
            <Card>
              <CardContent className="p-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full justify-start overflow-auto">
                    <TabsTrigger value="dispatch">Dispatch</TabsTrigger>
                    <TabsTrigger value="response">Response</TabsTrigger>
                    <TabsTrigger value="arrival">Arrival</TabsTrigger>
                    <TabsTrigger value="assessment">Assessment</TabsTrigger>
                    <TabsTrigger value="treatment">Treatment</TabsTrigger>
                    <TabsTrigger value="transport">Transport</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="dispatch" className="pt-4 space-y-4">
                    <Textarea 
                      placeholder="Enter dispatch details, location, nature of call..."
                      value={formData.dispatch}
                      onChange={(e) => handleInputChange('dispatch', e.target.value)}
                      rows={5}
                    />
                  </TabsContent>
                  
                  <TabsContent value="response" className="pt-4 space-y-4">
                    <Textarea 
                      placeholder="Describe your response, any delays, etc..."
                      value={formData.response}
                      onChange={(e) => handleInputChange('response', e.target.value)}
                      rows={5}
                    />
                  </TabsContent>
                  
                  <TabsContent value="arrival" className="pt-4 space-y-4">
                    <Textarea 
                      placeholder="Describe scene on arrival, patient's initial condition..."
                      value={formData.arrival}
                      onChange={(e) => handleInputChange('arrival', e.target.value)}
                      rows={5}
                    />
                  </TabsContent>
                  
                  <TabsContent value="assessment" className="pt-4 space-y-4">
                    <div className="flex justify-end mb-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={setNormalAssessment}
                      >
                        Set Normal Findings
                      </Button>
                    </div>
                    <Textarea 
                      placeholder="Describe assessment findings, vitals, observations..."
                      value={formData.assessment}
                      onChange={(e) => handleInputChange('assessment', e.target.value)}
                      rows={5}
                    />
                  </TabsContent>
                  
                  <TabsContent value="treatment" className="pt-4 space-y-4">
                    <Textarea 
                      placeholder="Describe interventions, medications, procedures..."
                      value={formData.treatment}
                      onChange={(e) => handleInputChange('treatment', e.target.value)}
                      rows={5}
                    />
                  </TabsContent>
                  
                  <TabsContent value="transport" className="pt-4 space-y-4">
                    <Textarea 
                      placeholder="Describe transport destination, any incidents en route..."
                      value={formData.transport}
                      onChange={(e) => handleInputChange('transport', e.target.value)}
                      rows={5}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateNarrative;
