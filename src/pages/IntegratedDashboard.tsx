
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from "sonner";
import { 
  Send, 
  PlusCircle, 
  Mic, 
  MicOff, 
  Sparkles, 
  HelpCircle, 
  Maximize, 
  ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import ChatSession from '@/components/ChatSession';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import NarrativeSettingsDialog from '@/components/NarrativeSettingsDialog';
import { TouchFeedback } from '@/components/ui/ios-feedback';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';
import NarrativeFormSidebar from '@/components/NarrativeFormSidebar';

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

const IntegratedDashboard = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // State management
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [leftSidebarVisible, setLeftSidebarVisible] = useState(true);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("dispatch");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [narrativeSettings, setNarrativeSettings] = useState({
    format_type: 'D.R.A.T.T.',
    use_abbreviations: true,
    include_headers: true,
    default_unit: '',
    default_hospital: '',
    custom_format: '',
  });
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [transcript, setTranscript] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Create initial session
  useEffect(() => {
    if (sessions.length === 0) {
      handleNewSession();
    }
    
    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    // Scroll to bottom when messages change
    scrollToBottom();
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  
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
    setShowWelcome(true);
  };
  
  const handleSelectSession = (id: string) => {
    setActiveSession(id);
    setSessions(prev => 
      prev.map(s => ({
        ...s,
        active: s.id === id
      }))
    );
    setShowWelcome(false);
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
    setShowWelcome(false);
    
    setIsGenerating(true);
    setTimeout(() => {
      generateResponse(userInput);
      setIsGenerating(false);
    }, 1500);
    
    // Scroll to bottom after sending message
    setTimeout(scrollToBottom, 100);
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
    
    // Scroll to bottom after receiving response
    setTimeout(scrollToBottom, 100);
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
    
    // Scroll to bottom after generating narrative
    setTimeout(scrollToBottom, 100);
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
  
  const handleGenerateFromForm = () => {
    generateNarrative({...defaultFormData, ...narrativeSettings});
  };
  
  const activeSessionData = sessions.find(s => s.id === activeSession);
  const welcomeMessage = {
    type: 'assistant' as const,
    content: `# Welcome to NarrativeIQ
    
I'm your AI narrative assistant, designed to help EMS professionals create detailed, accurate PCR narratives quickly and efficiently.

## How to Use
- **Type directly** in the input below to ask questions or create a narrative
- **Click the mic button** to use voice input
- **Use the form** on the right to enter patient details
- **Access sessions** from the left panel to continue previous work

## Quick Actions
- Type "Generate narrative" to create a new narrative
- Click on past sessions to view and edit previous reports
- Use the settings icon to customize narrative formatting

Need help? Just ask me anything about EMS narratives, protocols, or how to use this application.`,
    timestamp: format(new Date(), 'hh:mm a')
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <DashboardHeader 
        toggleSidebar={() => setLeftSidebarVisible(!leftSidebarVisible)}
        toggleSettings={() => setIsSettingsOpen(true)}
        sidebarVisible={leftSidebarVisible}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        userName="John"
      />
      
      <DashboardSidebar 
        visible={leftSidebarVisible}
        sessions={sessions}
        activeSession={activeSession}
        onNewSession={handleNewSession}
        onSelectSession={handleSelectSession}
        onRenameSession={handleRenameSession}
        onDeleteSession={handleDeleteSession}
      />
      
      <NarrativeFormSidebar 
        visible={rightSidebarVisible}
        toggleSidebar={() => setRightSidebarVisible(!rightSidebarVisible)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSubmit={handleGenerateFromForm}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      
      <main className={`flex-1 pt-16 transition-all duration-300 ease-in-out ${
        leftSidebarVisible ? 'ml-64' : 'ml-0'
      } ${
        rightSidebarVisible ? 'mr-80' : 'mr-0'
      }`}>
        <div className="container mx-auto p-4 max-w-5xl h-[calc(100vh-64px)]">
          <Card className="h-full flex flex-col overflow-hidden shadow-md">
            <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4">
                {!showWelcome && activeSessionData?.messages && activeSessionData.messages.length > 0 ? (
                  <ChatSession 
                    messages={activeSessionData.messages} 
                    onSavePreset={() => {}}
                  />
                ) : (
                  <ChatSession 
                    messages={[welcomeMessage]} 
                    onSavePreset={() => {}}
                  />
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={isRecording ? 'Listening...' : 'Type your message here or ask for help...'}
                    className={`min-h-[60px] pr-24 ${isRecording ? 'bg-red-50 dark:bg-red-900/10' : ''}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  {transcript && (
                    <div className="absolute bottom-full left-0 right-0 mb-1 bg-gray-100 dark:bg-gray-800 p-2 rounded-md text-sm">
                      {transcript}
                    </div>
                  )}
                  
                  <div className="absolute right-2 bottom-2 flex items-center gap-1">
                    <TouchFeedback feedbackColor="#6366f1">
                      <Button
                        onClick={toggleSpeechRecognition}
                        variant={isRecording ? "destructive" : "secondary"}
                        size="icon"
                        className="h-8 w-8"
                        title={isRecording ? 'Stop recording' : 'Start voice recording'}
                        aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
                      >
                        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                    </TouchFeedback>
                    
                    <TouchFeedback feedbackColor="#6366f1">
                      <Button
                        onClick={() => setRightSidebarVisible(!rightSidebarVisible)}
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8"
                        title="Toggle form sidebar"
                        aria-label="Toggle form sidebar"
                      >
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </TouchFeedback>
                    
                    <TouchFeedback feedbackColor="#4f46e5">
                      <Button
                        onClick={handleSendMessage}
                        disabled={isGenerating || !userInput.trim()}
                        className="h-8 w-8 button-gradient"
                        aria-label="Send message"
                      >
                        {isGenerating ? 
                          <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : 
                          <ArrowUp className="h-4 w-4" />
                        }
                      </Button>
                    </TouchFeedback>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <div>
                    <span>
                      Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700">Enter</kbd> to send
                    </span>
                  </div>
                  <div>
                    <button 
                      className="text-ems-600 dark:text-ems-400 hover:underline flex items-center"
                      onClick={() => {
                        generateNarrative({...defaultFormData, ...narrativeSettings});
                      }}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      <span>Generate Full Narrative</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Narrative Settings</h2>
            <NarrativeSettingsDialog 
              initialSettings={narrativeSettings} 
              onSave={(settings) => {
                handleUpdateSettings(settings);
                setIsSettingsOpen(false);
              }}
              onClose={() => setIsSettingsOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegratedDashboard;
