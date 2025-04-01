
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, PlusCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { toast } from "sonner";
import ChatSession from '@/components/ChatSession';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

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
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("dispatch");

  // Mobile drawer state for sessions list on small screens
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
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
    setIsDrawerOpen(false);
  };
  
  const handleSelectSession = (id: string) => {
    setActiveSession(id);
    setSessions(prev => 
      prev.map(s => ({
        ...s,
        active: s.id === id
      }))
    );
    setIsDrawerOpen(false);
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
  
  // Function to toggle sidebar visibility on desktop
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Organize sessions by date
  const groupedSessions = sessions.reduce((groups, session) => {
    const date = session.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(session);
    return groups;
  }, {} as Record<string, Session[]>);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 md:hidden"
              onClick={() => setIsDrawerOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only">Sessions</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 hidden md:flex"
              onClick={toggleSidebar}
            >
              {sidebarVisible ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            <h1 className="text-xl font-bold text-ems-600 dark:text-ems-400 truncate">
              {activeSessionData?.name || "New Narrative"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="hidden sm:flex items-center gap-1"
              onClick={handleNewSession}
            >
              <PlusCircle className="h-4 w-4" />
              New Session
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Sessions Sidebar - Desktop */}
        <div className={`hidden md:block ${sidebarVisible ? 'w-64' : 'w-0'} flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ease-in-out`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="font-medium">Sessions</h2>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={handleNewSession}
            >
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only">New Session</span>
            </Button>
          </div>
          <div className="overflow-y-auto h-full">
            {Object.entries(groupedSessions).map(([date, dateSessions]) => (
              <div key={date} className="mb-4">
                <div className="px-4 py-1 text-xs font-medium text-gray-500">
                  {date}
                </div>
                {dateSessions.map(session => (
                  <div 
                    key={session.id}
                    className={`mx-2 px-3 py-2 rounded-md cursor-pointer flex justify-between items-center ${
                      session.active ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                    onClick={() => handleSelectSession(session.id)}
                  >
                    <div className="truncate flex-1">
                      {session.name}
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRenameSession(session.id);
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                        </svg>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(session.id);
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H3.5C3.22386 4 3 3.77614 3 3.5ZM3 5.5C3 5.22386 3.22386 5 3.5 5H11.5C11.7761 5 12 5.22386 12 5.5C12 5.77614 11.7761 6 11.5 6H3.5C3.22386 6 3 5.77614 3 5.5ZM3 7.5C3 7.22386 3.22386 7 3.5 7H11.5C11.7761 7 12 7.22386 12 7.5C12 7.77614 11.7761 8 11.5 8H3.5C3.22386 8 3 7.77614 3 7.5ZM3 9.5C3 9.22386 3.22386 9 3.5 9H11.5C11.7761 9 12 9.22386 12 9.5C12 9.77614 11.7761 10 11.5 10H3.5C3.22386 10 3 9.77614 3 9.5ZM3 11.5C3 11.2239 3.22386 11 3.5 11H11.5C11.7761 11 12 11.2239 12 11.5C12 11.7761 11.7761 12 11.5 12H3.5C3.22386 12 3 11.7761 3 11.5ZM3 13.5C3 13.2239 3.22386 13 3.5 13H11.5C11.7761 13 12 13.2239 12 13.5C12 13.7761 11.7761 14 11.5 14H3.5C3.22386 14 3 13.7761 3 13.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                        </svg>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden p-4">
            {/* Chat Window */}
            <Card className="flex-1 flex flex-col mb-4 overflow-hidden">
              <CardContent className="p-0 flex-1 flex flex-col">
                <div className="flex-1 overflow-hidden">
                  <ChatSession 
                    messages={activeSessionData?.messages || []}
                  />
                </div>
                {/* Collapsible Narrative Form */}
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <Collapsible className="w-full">
                    <div className="p-4 pb-0">
                      <div className="flex justify-between items-center mb-2">
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                            Narrative Settings & Fields
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </CollapsibleTrigger>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setOptions({
                              ...options,
                              useAbbreviations: !options.useAbbreviations
                            })}
                            variant={options.useAbbreviations ? "default" : "outline"}
                            size="sm"
                            className="h-7 text-xs"
                          >
                            Abbreviations: {options.useAbbreviations ? "On" : "Off"}
                          </Button>
                          <Button
                            onClick={() => setOptions({
                              ...options,
                              includeHeaders: !options.includeHeaders
                            })}
                            variant={options.includeHeaders ? "default" : "outline"}
                            size="sm"
                            className="h-7 text-xs"
                          >
                            Headers: {options.includeHeaders ? "On" : "Off"}
                          </Button>
                          <div className="flex gap-1">
                            {(['standard', 'chronological', 'soap'] as const).map((format) => (
                              <Button 
                                key={format}
                                variant={options.format === format ? "default" : "outline"}
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => setOptions({...options, format})}
                              >
                                {format.charAt(0).toUpperCase()}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <CollapsibleContent>
                      <div className="p-4 pt-0">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                          <TabsList className="w-full justify-start overflow-auto mb-2">
                            <TabsTrigger value="dispatch">Dispatch</TabsTrigger>
                            <TabsTrigger value="response">Response</TabsTrigger>
                            <TabsTrigger value="arrival">Arrival</TabsTrigger>
                            <TabsTrigger value="assessment">Assessment</TabsTrigger>
                            <TabsTrigger value="treatment">Treatment</TabsTrigger>
                            <TabsTrigger value="transport">Transport</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="dispatch">
                            <Textarea 
                              placeholder="Enter dispatch details, location, nature of call..."
                              value={formData.dispatch}
                              onChange={(e) => handleInputChange('dispatch', e.target.value)}
                              className="min-h-[100px]"
                            />
                          </TabsContent>
                          
                          <TabsContent value="response">
                            <Textarea 
                              placeholder="Describe your response, any delays, etc..."
                              value={formData.response}
                              onChange={(e) => handleInputChange('response', e.target.value)}
                              className="min-h-[100px]"
                            />
                          </TabsContent>
                          
                          <TabsContent value="arrival">
                            <Textarea 
                              placeholder="Describe scene on arrival, patient's initial condition..."
                              value={formData.arrival}
                              onChange={(e) => handleInputChange('arrival', e.target.value)}
                              className="min-h-[100px]"
                            />
                          </TabsContent>
                          
                          <TabsContent value="assessment">
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
                              className="min-h-[100px]"
                            />
                          </TabsContent>
                          
                          <TabsContent value="treatment">
                            <Textarea 
                              placeholder="Describe interventions, medications, procedures..."
                              value={formData.treatment}
                              onChange={(e) => handleInputChange('treatment', e.target.value)}
                              className="min-h-[100px]"
                            />
                          </TabsContent>
                          
                          <TabsContent value="transport">
                            <Textarea 
                              placeholder="Describe transport destination, any incidents en route..."
                              value={formData.transport}
                              onChange={(e) => handleInputChange('transport', e.target.value)}
                              className="min-h-[100px]"
                            />
                          </TabsContent>
                        </Tabs>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <div className="flex p-4 gap-2">
                    <Textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Type your message here..."
                      className="min-h-[60px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={handleSendMessage}
                        disabled={isGenerating || !userInput.trim()}
                        className="flex-1"
                      >
                        {isGenerating ? "..." : <Send className="h-4 w-4" />}
                      </Button>
                      <Button
                        onClick={generateNarrative}
                        variant="outline"
                        className="flex-1"
                        disabled={isGenerating}
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Mobile Sessions Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[90vh]">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Sessions</h2>
              <Button 
                size="sm"
                onClick={handleNewSession}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New Session
              </Button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {Object.entries(groupedSessions).map(([date, dateSessions]) => (
                <div key={date} className="mb-4">
                  <div className="py-1 text-xs font-medium text-gray-500">
                    {date}
                  </div>
                  {dateSessions.map(session => (
                    <div 
                      key={session.id}
                      className={`py-3 px-3 rounded-md cursor-pointer flex justify-between items-center mb-1 ${
                        session.active ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                      onClick={() => handleSelectSession(session.id)}
                    >
                      <div className="truncate flex-1">
                        {session.name}
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRenameSession(session.id);
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                          </svg>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(session.id);
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H3.5C3.22386 4 3 3.77614 3 3.5ZM3 5.5C3 5.22386 3.22386 5 3.5 5H11.5C11.7761 5 12 5.22386 12 5.5C12 5.77614 11.7761 6 11.5 6H3.5C3.22386 6 3 5.77614 3 5.5ZM3 7.5C3 7.22386 3.22386 7 3.5 7H11.5C11.7761 7 12 7.22386 12 7.5C12 7.77614 11.7761 8 11.5 8H3.5C3.22386 8 3 7.77614 3 7.5ZM3 9.5C3 9.22386 3.22386 9 3.5 9H11.5C11.7761 9 12 9.22386 12 9.5C12 9.77614 11.7761 10 11.5 10H3.5C3.22386 10 3 9.77614 3 9.5ZM3 11.5C3 11.2239 3.22386 11 3.5 11H11.5C11.7761 11 12 11.2239 12 11.5C12 11.7761 11.7761 12 11.5 12H3.5C3.22386 12 3 11.7761 3 11.5ZM3 13.5C3 13.2239 3.22386 13 3.5 13H11.5C11.7761 13 12 13.2239 12 13.5C12 13.7761 11.7761 14 11.5 14H3.5C3.22386 14 3 13.7761 3 13.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                          </svg>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default CreateNarrative;
