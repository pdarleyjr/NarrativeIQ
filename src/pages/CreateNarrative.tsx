
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, PlusCircle, ChevronRight, ChevronLeft, Settings, Mic, MicOff } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from "sonner";
import ChatSession from '@/components/ChatSession';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import EnhancedNarrativeForm from '@/components/EnhancedNarrativeForm';
import NarrativeSettingsDialog from '@/components/NarrativeSettingsDialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ProtocolSidebar from '@/components/ProtocolSidebar';

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

interface Preset {
  id: string;
  name: string;
  data: NarrativeFormData;
}

const defaultFormData: NarrativeFormData = {
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

const CreateNarrative = () => {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("dispatch");
  const [presets, setPresets] = useState<Preset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<NarrativeFormData | undefined>(undefined);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [narrativeSettings, setNarrativeSettings] = useState({
    format_type: 'D.R.A.T.T.',
    use_abbreviations: true,
    include_headers: true,
    default_unit: '',
    default_hospital: '',
    custom_format: '',
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [transcript, setTranscript] = useState('');
  
  // Create initial session
  useEffect(() => {
    if (sessions.length === 0) {
      handleNewSession();
    }
  }, []);

  // Setup speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setUserInput((prev) => prev + ' ' + finalTranscript);
          setTranscript('');
        } else {
          setTranscript(event.results[event.resultIndex][0].transcript);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        toast.error('Speech recognition error: ' + event.error);
      };
      
      recognition.onend = () => {
        if (isRecording) {
          recognition.start();
        }
      };
      
      setRecognition(recognition);
    } else {
      toast.error('Speech recognition is not supported in this browser');
    }
    
    return () => {
      if (recognition) {
        recognition.onend = null;
        recognition.abort();
      }
    };
  }, [isRecording]);
  
  const toggleSpeechRecognition = () => {
    if (!recognition) return;
    
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
      setTranscript('');
      toast.success('Voice input stopped');
    } else {
      recognition.start();
      setIsRecording(true);
      toast.success('Voice input started');
    }
  };

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
    setUserInput('');
    setIsDrawerOpen(false);
    setSelectedPreset(undefined);
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
      generateNarrative({...defaultFormData, ...narrativeSettings});
      return;
    }
    
    const assistantMessage: Message = {
      type: 'assistant',
      content: `I've received your message: "${input}". How can I help with your EMS narrative?`,
      timestamp: currentTime
    };
    
    addMessageToSession(assistantMessage);
  };
  
  const generateNarrative = (formData: NarrativeFormData) => {
    if (!activeSession) return;
    
    const currentTime = format(new Date(), 'hh:mm a');
    
    let mockResponse = "EMS NARRATIVE REPORT\n\n";
    
    if (formData) {
      if (formData.include_headers) mockResponse += "=== DISPATCH ===\n";
      mockResponse += `${formData.unit || 'Unit'} dispatched to ${formData.dispatch_reason || '[location]'} for a medical emergency.\n\n`;
      
      if (formData.include_headers) mockResponse += "=== RESPONSE ===\n";
      mockResponse += `${formData.response_delay !== 'No response delays' ? 
        `Unit responded with delay due to ${formData.response_delay_custom || formData.response_delay || 'unspecified reason'}.` : 
        'Unit responded without delay.'}\n\n`;
      
      if (formData.include_headers) mockResponse += "=== ARRIVAL ===\n";
      mockResponse += `Upon arrival, found ${formData.patient_sex || ''} ${formData.patient_age || ''} patient with chief complaint of ${formData.chief_complaint || '[complaint]'} for ${formData.duration || 'unknown duration'}. ${formData.patient_presentation || ''}\n\n`;
      
      if (formData.include_headers) mockResponse += "=== ASSESSMENT ===\n";
      
      let aaoStatus = '';
      if (formData.is_unresponsive) {
        aaoStatus = 'Patient unresponsive. ';
      } else {
        const aaoCount = [formData.aao_person, formData.aao_place, formData.aao_time, formData.aao_event].filter(Boolean).length;
        aaoStatus = `Patient was AAOx${aaoCount}`;
        if (aaoCount < 4) {
          const missing = [];
          if (!formData.aao_person) missing.push('person');
          if (!formData.aao_place) missing.push('place');
          if (!formData.aao_time) missing.push('time');
          if (!formData.aao_event) missing.push('event');
          aaoStatus += ` (could not answer ${missing.join(', ')} questions appropriately)`;
        }
        aaoStatus += `, GCS-${formData.gcs_score}, ${formData.pupils}. `;
      }
      
      mockResponse += aaoStatus;
      
      if (formData.unable_to_obtain_negatives) {
        mockResponse += "Unable to obtain pertinent negatives due to patient's condition. ";
      } else if (formData.selected_pertinent_negatives && formData.selected_pertinent_negatives.length > 0) {
        mockResponse += `Patient denied: ${formData.selected_pertinent_negatives.join(', ')}. `;
      }
      
      if (formData.vital_signs_normal) {
        mockResponse += "Vital signs checked and within normal limits for the patient. ";
      } else if (formData.selected_abnormal_vitals && formData.selected_abnormal_vitals.length > 0) {
        mockResponse += `Vital signs: Patient was ${formData.selected_abnormal_vitals.join(', ')}. `;
        if (formData.all_other_vitals_normal) {
          mockResponse += "All other vital signs within normal limits. ";
        }
      }
      
      if (formData.dcap_btls) {
        mockResponse += "Full assessment performed; no DCAP-BTLS noted throughout the body. ";
      }
      
      if (formData.additional_assessment) {
        mockResponse += `${formData.additional_assessment}\n\n`;
      } else {
        mockResponse += "\n\n";
      }
      
      if (formData.include_headers) mockResponse += "=== TREATMENT ===\n";
      mockResponse += `${formData.treatment_provided || 'No interventions required.'}\n\n`;
      
      if (formData.add_protocol_treatments) {
        mockResponse += "Additional treatments per protocol administered. ";
        if (formData.protocol_exclusions) {
          mockResponse += `Protocol exclusions: ${formData.protocol_exclusions}.\n\n`;
        } else {
          mockResponse += "\n\n";
        }
      }
      
      if (formData.include_headers) mockResponse += "=== TRANSPORT ===\n";
      if (formData.refused_transport) {
        mockResponse += `Patient refused transport. ${formData.refusal_details || 'Risks of refusal explained to patient who demonstrated understanding and signed refusal form.'}\n\n`;
      } else {
        mockResponse += `Patient transported to ${formData.transport_destination || '[hospital]'} in ${formData.transport_position || 'position of comfort'}. Patient monitored en route with vitals reassessed. Patient left in Room #${formData.room_number || '[room]'} and care transferred to RN ${formData.nurse_name || '[name]'}.\n\n`;
      }
      
      if (formData.unit_in_service) {
        mockResponse += `${formData.unit || 'Unit'} returned to service.`;
      }
    } else {
      mockResponse += "This is a sample narrative. To generate a custom narrative, please fill out the form fields below.";
    }

    const assistantMessage: Message = {
      type: 'assistant',
      content: mockResponse,
      timestamp: currentTime
    };
    
    addMessageToSession(assistantMessage);
    toast.success("Narrative generated successfully");
  };
  
  const handleSavePreset = (formData: NarrativeFormData) => {
    const presetId = `preset-${Date.now()}`;
    const newPreset: Preset = {
      id: presetId,
      name: `Preset ${format(new Date(), 'MMM d, yyyy hh:mm a')}`,
      data: formData
    };
    
    setPresets(prev => [...prev, newPreset]);
    localStorage.setItem('narrative_presets', JSON.stringify([...presets, newPreset]));
    toast.success("Preset saved successfully");
  };
  
  const handleLoadPreset = () => {
    if (presets.length === 0) {
      toast.error("No presets available");
      return;
    }
    
    setSelectedPreset(presets[presets.length - 1].data);
    toast.success("Preset loaded");
  };
  
  const handleUpdateSettings = (newSettings: any) => {
    setNarrativeSettings(prev => ({
      ...prev,
      ...newSettings
    }));
    localStorage.setItem('narrative_settings', JSON.stringify({
      ...narrativeSettings,
      ...newSettings
    }));
    toast.success("Settings updated");
  };
  
  const activeSessionData = sessions.find(s => s.id === activeSession);
  
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

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
            <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <NarrativeSettingsDialog 
                  initialSettings={narrativeSettings} 
                  onSave={handleUpdateSettings}
                  onClose={() => setIsSettingsOpen(false)}
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
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
          <div className="overflow-y-auto max-h-[50vh]">
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
                          <path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
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
                          <path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H3.5C3.22386 4 3 3.77614 3 3.5ZM3 5.5C3 5.22386 3.22386 5 3.5 5H11.5C11.7761 5 12 5.22386 12 5.5C12 5.77614 11.7761 6 11.5 6H3.5C3.22386 6 3 5.77614 3 5.5ZM3 7.5C3 7.22386 3.22386 7 3.5 7H11.5C11.7761 7 12 7.22386 12 7.5C12 7.77614 11.7761 8 11.5 8H3.5C3.22386 8 3 7.77614 3 7.5ZM3 9.5C3 9.22386 3.22386 9 3.5 9H11.5C11.7761 9 12 9.22386 12 9.5C12 9.77614 11.7761 10 11.5 10H3.5C3.22386 10 3 9.77614 3 9.5ZM3 11.5C3 11.2239 3.22386 11 3.5 11H11.5C11.7761 11 12 11.2239 12 11.5C12 11.7761 11.7761 12 11.5 12H3.5C3.22386 12 3 11.7761 3 11.5ZM3 13.5C3 13.2239 3.22386 13 3.5 13H11.5C11.7761 13 12 13.2239 12 13.5C12 13.7761 11.7761 14 11.5 14H3.5C3.22386 14 3 13.7761 3 13.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h2 className="font-medium mb-2">Related Protocols</h2>
            <ProtocolSidebar chiefComplaint={activeSessionData?.messages.find(m => m.type === 'assistant')?.content || ''} />
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden p-4">
            <Card className="flex-1 flex flex-col mb-4 overflow-hidden">
              <CardContent className="p-0 flex-1 flex flex-col">
                <div className="flex-1 overflow-hidden">
                  <ChatSession 
                    messages={activeSessionData?.messages || []}
                    onSavePreset={handleLoadPreset}
                  />
                </div>
                <Collapsible className="w-full">
                  <div className="p-4 pb-0">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        Narrative Settings & Fields
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <div className="p-4 pt-0">
                      <EnhancedNarrativeForm
                        onGenerateNarrative={generateNarrative}
                        onSavePreset={handleSavePreset}
                        loadPreset={selectedPreset}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        settings={narrativeSettings}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                
                <div className="flex p-4 gap-2">
                  <div className="relative flex-1">
                    <Textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder={isRecording ? 'Listening...' : 'Type your message here...'}
                      className={`min-h-[60px] ${isRecording ? 'pr-10' : ''}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    {transcript && (
                      <div className="absolute bottom-full left-0 right-0 bg-gray-100 dark:bg-gray-800 p-2 rounded-t-md text-sm">
                        {transcript}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={toggleSpeechRecognition}
                      variant={isRecording ? "default" : "outline"}
                      className={`flex-1 ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
                      title={isRecording ? 'Stop recording' : 'Start voice recording'}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={isGenerating || !userInput.trim()}
                      className="flex-1"
                    >
                      {isGenerating ? "..." : <Send className="h-4 w-4" />}
                    </Button>
                    <Button
                      onClick={() => generateNarrative({...defaultFormData, ...narrativeSettings})}
                      variant="outline"
                      className="flex-1"
                      disabled={isGenerating}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

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
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></svg>
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
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></svg>
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

