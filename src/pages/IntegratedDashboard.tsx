import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusCircle,
  Mic,
  MicOff,
  Sparkles,
  HelpCircle,
  Zap,
  BriefcaseMedical,
  BookOpen,
  FileText,
  Menu,
  ArrowUp,
  Stethoscope,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import NarrativeSettingsDialog from '@/components/NarrativeSettingsDialog';
import ProtocolQueryDialog from '@/components/ProtocolQueryDialog';
import CustomInstructionsDialog from '@/components/CustomInstructionsDialog';
import { TouchFeedback } from '@/components/ui/ios-feedback';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileNarrativeDrawer } from '@/components/MobileNarrativeDrawer';
import { MobileSessionsDrawer } from '@/components/MobileSessionsDrawer';
import { NavigationBar } from '@/components/ios/NavigationBar';
import { TabBar } from '@/components/ios/TabBar';
import ChatSession from '@/components/ChatSession';
import EMSPanel from '@/components/EMSPanel';

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
  const isMobile = useIsMobile();
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [leftSidebarVisible, setLeftSidebarVisible] = useState(true);
  // Removed rightSidebarVisible as we don't need the right sidebar anymore
  const [activeTab, setActiveTab] = useState("chat");
  const [fireFormData, setFireFormData] = useState({
    unit: '',
    emergencyType: '',
    customEmergencyType: '',
    additionalInfo: ''
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProtocolQueryOpen, setIsProtocolQueryOpen] = useState(false);
  const [isCustomInstructionsOpen, setIsCustomInstructionsOpen] = useState(false);
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
  const [narrativeText, setNarrativeText] = useState('');
  
  const [mobileNarrativeDrawerOpen, setMobileNarrativeDrawerOpen] = useState(false);
  const [mobileSessionsDrawerOpen, setMobileSessionsDrawerOpen] = useState(false);
  const [quickActionsExpanded, setQuickActionsExpanded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    if (sessions.length === 0) {
      handleNewSession();
    }
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    scrollToBottom();
  }, []);
  
  useEffect(() => {
    if (isMobile) {
      setLeftSidebarVisible(false);
    }
  }, [isMobile]);
  
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
    
    if (input.toLowerCase().includes('protocol') &&
        (input.toLowerCase().includes('question') ||
         input.toLowerCase().includes('query') ||
         input.toLowerCase().includes('search'))) {
      setIsProtocolQueryOpen(true);
      return;
    }
    
    const assistantMessage: Message = {
      type: 'assistant',
      content: `I've received your message: "${input}". How can I help with your EMS narrative?`,
      timestamp: currentTime
    };
    
    addMessageToSession(assistantMessage);
    
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

    setNarrativeText(mockResponse);
    
    const assistantMessage: Message = {
      type: 'assistant',
      content: mockResponse,
      timestamp: currentTime
    };
    
    addMessageToSession(assistantMessage);
    toast.success("Narrative generated successfully");
    
    // Switch to the EMS tab after generating a narrative
    setActiveTab("ems");
    
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
  
  const activeSessionData = sessions.find(s => s.id === activeSession);
  const welcomeMessage = {
    type: 'assistant' as const,
    content: `# Welcome to EZ Narrative
    
I'm your AI narrative assistant, designed to help EMS professionals create detailed, accurate PCR narratives quickly and efficiently.

## How to Use
- **Type directly** in the input below to ask questions or create a narrative
- **Click the mic button** to use voice input
- **${isMobile ? 'Tap the form button' : 'Use the form on the right'}** to enter patient details
- **Access sessions** from the ${isMobile ? 'sessions drawer' : 'left panel'} to continue previous work

## Quick Actions
- Type "Generate narrative" to create a new narrative
- Click on past sessions to view and edit previous reports
- Use the settings icon to customize narrative formatting

Need help? Just ask me anything about EMS narratives, protocols, or how to use this application.`,
    timestamp: format(new Date(), 'hh:mm a')
  };

  return (
  <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
    {/* Mobile Drawer Sidebar */}
    {isMobile && (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 h-11 w-11 touch-manipulation bg-white dark:bg-gray-800 shadow-sm rounded-md"
          aria-label="Open sidebar"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <Drawer open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <DrawerContent className="h-[90vh] rounded-t-xl">
            <div className="h-full overflow-auto pt-4">
              <div className="flex justify-between items-center px-4 pb-2 border-b mb-2">
                <h2 className="text-lg font-semibold">EZ Narratives</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSidebarOpen(false)}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
                </Button>
              </div>
              <DashboardSidebar
                visible={true}
                sessions={sessions}
                activeSession={activeSession}
                onNewSession={handleNewSession}
                onSelectSession={(id) => {
                  handleSelectSession(id);
                  setSidebarOpen(false);
                }}
                onRenameSession={handleRenameSession}
                onDeleteSession={handleDeleteSession}
                navigate={navigate}
                setIsSettingsOpen={setIsSettingsOpen}
                setIsCustomInstructionsOpen={setIsCustomInstructionsOpen}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </>
    )}
    
    {/* Header */}
    {isMobile ? (
      <NavigationBar
        title="EZ Narratives"
        largeTitle={true}
        rightElement={
          <div className="flex items-center gap-1">
            <TouchFeedback>
              <Button
                variant="ghost"
                size="sm"
                className="h-11 w-11 p-0 touch-manipulation"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                )}
              </Button>
            </TouchFeedback>
            <TouchFeedback>
              <Button
                variant="ghost"
                size="sm"
                className="h-11 w-11 p-0 touch-manipulation"
                onClick={() => setIsSettingsOpen(true)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </Button>
            </TouchFeedback>
          </div>
        }
      />
    ) : (
      <DashboardHeader
        toggleSidebar={() => setLeftSidebarVisible(!leftSidebarVisible)}
        toggleSettings={() => setIsSettingsOpen(true)}
        sidebarVisible={leftSidebarVisible}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        userName="John"
      />
    )}
      
      {!isMobile && (
        <DashboardSidebar
          visible={leftSidebarVisible}
          sessions={sessions}
          activeSession={activeSession}
          onNewSession={handleNewSession}
          onSelectSession={handleSelectSession}
          onRenameSession={handleRenameSession}
          onDeleteSession={handleDeleteSession}
          navigate={navigate}
          setIsSettingsOpen={setIsSettingsOpen}
          setIsCustomInstructionsOpen={setIsCustomInstructionsOpen}
        />
      )}
      <main className={`${!isMobile && leftSidebarVisible ? 'ml-60' : 'ml-0'} flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out`}>
        <div className="flex justify-center px-4">
          <div className="w-full max-w-4xl">
        {/* Tabs */}
        <div className={`${isMobile ? 'mt-12' : 'mt-2'} m-0 p-0 w-full bg-white dark:bg-gray-800 shadow-sm rounded-t-lg`}>
          <ToggleGroup
            type="single"
            value={activeTab}
            onValueChange={(value) => value && setActiveTab(value)}
            className="w-full justify-around sm:justify-start gap-0 sm:gap-2 p-1"
          >
            <ToggleGroupItem
              value="chat"
              className="flex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-1 py-2 px-3 rounded-md data-[state=on]:bg-ems-600 data-[state=on]:text-white data-[state=off]:bg-gray-100 data-[state=off]:text-gray-600 min-h-[44px] min-w-[44px] transition-all"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Chat</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="ems"
              className="flex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-1 py-2 px-3 rounded-md data-[state=on]:bg-ems-600 data-[state=on]:text-white data-[state=off]:bg-gray-100 data-[state=off]:text-gray-600 min-h-[44px] min-w-[44px] transition-all"
            >
              <Stethoscope className="h-4 w-4" />
              <span>EMS</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="fire"
              className="flex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-1 py-2 px-3 rounded-md data-[state=on]:bg-ems-600 data-[state=on]:text-white data-[state=off]:bg-gray-100 data-[state=off]:text-gray-600 min-h-[44px] min-w-[44px] transition-all"
            >
              <Flame className="h-4 w-4" />
              <span>Fire</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden p-0 m-0 bg-gray-50 dark:bg-gray-900 rounded-b-lg shadow-md">
          <AnimatePresence mode="wait">
            {activeTab === "chat" && (
              <ChatPanelContent
                key="chat"
                messages={!showWelcome && activeSessionData?.messages && activeSessionData.messages.length > 0 ?
                  activeSessionData.messages : [welcomeMessage]}
                userInput={userInput}
                setUserInput={setUserInput}
                handleSendMessage={handleSendMessage}
                isGenerating={isGenerating}
                isRecording={isRecording}
                toggleSpeechRecognition={toggleSpeechRecognition}
                transcript={transcript}
              />
            )}
            {activeTab === "ems" && (
              <EMSPanel
                key="ems"
                narrativeText={narrativeText}
                onGenerateNarrative={generateNarrative}
                defaultFormData={{...defaultFormData, ...narrativeSettings}}
              />
            )}
            {activeTab === "fire" && (
              <FireTabContent
                key="fire"
                fireFormData={fireFormData}
                setFireFormData={setFireFormData}
                generateNarrative={generateNarrative}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  </main>
      
      {/* Dialogs */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl ${
              isMobile ? 'w-full max-h-[90vh]' : 'max-w-lg w-full max-h-[80vh]'
            } animate-in fade-in duration-300 scale-in-95`}
          >
            <div className="p-6">
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
        </div>
      )}
      
      {isProtocolQueryOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl ${
              isMobile ? 'w-full max-h-[90vh]' : 'max-w-lg w-full max-h-[80vh]'
            } animate-in fade-in duration-300 scale-in-95`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between border-b pb-2 mb-4">
                <h2 className="text-xl font-semibold">Protocol Q&A</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsProtocolQueryOpen(false)}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
                </Button>
              </div>
              <ProtocolQueryDialog
                onClose={() => setIsProtocolQueryOpen(false)}
                onAddToChat={(content) => {
                  const currentTime = format(new Date(), 'hh:mm a');
                  const assistantMessage: Message = {
                    type: 'assistant',
                    content,
                    timestamp: currentTime
                  };
                  addMessageToSession(assistantMessage);
                  setIsProtocolQueryOpen(false);
                  setTimeout(scrollToBottom, 100);
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {isCustomInstructionsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl ${
              isMobile ? 'w-full max-h-[90vh]' : 'max-w-2xl w-full max-h-[80vh]'
            } animate-in fade-in duration-300 scale-in-95`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between border-b pb-2 mb-4">
                <h2 className="text-xl font-semibold">Custom Instructions & Templates</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCustomInstructionsOpen(false)}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
                </Button>
              </div>
              <CustomInstructionsDialog
                onClose={() => setIsCustomInstructionsOpen(false)}
                onAddToChat={(content) => {
                  const currentTime = format(new Date(), 'hh:mm a');
                  const assistantMessage: Message = {
                    type: 'assistant',
                    content,
                    timestamp: currentTime
                  };
                  addMessageToSession(assistantMessage);
                  setIsCustomInstructionsOpen(false);
                  setTimeout(scrollToBottom, 100);
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {isMobile && (
        <>
          {/* iOS-style TabBar with improved styling */}
          <TabBar className="pb-safe shadow-lg bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700" />
          
          <MobileNarrativeDrawer
            open={mobileNarrativeDrawerOpen}
            onOpenChange={setMobileNarrativeDrawerOpen}
            onGenerateNarrative={() => generateNarrative({...defaultFormData, ...narrativeSettings})}
          />
          
          <MobileSessionsDrawer
            open={mobileSessionsDrawerOpen}
            onOpenChange={setMobileSessionsDrawerOpen}
            sessions={sessions}
            activeSession={activeSession}
            onNewSession={handleNewSession}
            onSelectSession={handleSelectSession}
            onRenameSession={handleRenameSession}
            onDeleteSession={handleDeleteSession}
          />
        </>
      )}
    </div>
  );
};

// Chat Panel Content Component
const ChatPanelContent: React.FC<{
  messages: Message[];
  userInput: string;
  setUserInput: (input: string) => void;
  handleSendMessage: () => void;
  isGenerating: boolean;
  isRecording: boolean;
  toggleSpeechRecognition: () => void;
  transcript: string;
}> = ({
  messages,
  userInput,
  setUserInput,
  handleSendMessage,
  isGenerating,
  isRecording,
  toggleSpeechRecognition,
  transcript
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [quickActionsExpanded, setQuickActionsExpanded] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <motion.div
      className="flex flex-col h-full space-y-2 p-2 m-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 15 }}
    >
      <Card className="flex-1 h-2/3 overflow-hidden mb-1 rounded-lg shadow-md w-full border-0 mx-0 snap-start">
        <div className="h-full overflow-y-auto p-3">
          <ChatSession
            messages={messages}
            onSavePreset={() => {}}
          />
          <div ref={messagesEndRef} />
        </div>
      </Card>
      
      <Card className="h-1/3 rounded-lg shadow-md w-full border-0 mx-0 snap-end">
        <div className="h-full flex flex-col">
          {isMobile && quickActionsExpanded && (
            <div className="p-3 border-b flex items-center gap-2 overflow-x-auto bg-white dark:bg-gray-800 backdrop-blur-sm">
              <TouchFeedback>
                <Button
                  size="sm"
                  variant="outline"
                  className="whitespace-nowrap rounded-full px-4 border-gray-200 dark:border-gray-700 shadow-sm"
                  onClick={() => {
                    setUserInput(userInput + " Generate a full arrest narrative");
                    setQuickActionsExpanded(false);
                  }}
                >
                  <Zap className="h-3.5 w-3.5 mr-2 text-ems-600 dark:text-ems-400" />
                  Full Arrest
                </Button>
              </TouchFeedback>
              <TouchFeedback>
                <Button
                  size="sm"
                  variant="outline"
                  className="whitespace-nowrap rounded-full px-4 border-gray-200 dark:border-gray-700 shadow-sm"
                  onClick={() => {
                    setUserInput(userInput + " Generate a chest pain narrative");
                    setQuickActionsExpanded(false);
                  }}
                >
                  <svg className="h-3.5 w-3.5 mr-2 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8h8"></path>
                    <path d="M18 16v-2"></path>
                    <path d="M18 20v-2"></path>
                  </svg>
                  Chest Pain
                </Button>
              </TouchFeedback>
              <TouchFeedback>
                <Button
                  size="sm"
                  variant="outline"
                  className="whitespace-nowrap rounded-full px-4 border-gray-200 dark:border-gray-700 shadow-sm"
                  onClick={() => {
                    setUserInput(userInput + " Generate a trauma narrative");
                    setQuickActionsExpanded(false);
                  }}
                >
                  <svg className="h-3.5 w-3.5 mr-2 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                  Trauma
                </Button>
              </TouchFeedback>
            </div>
          )}
          
          <div className="flex-1 p-3">
            <div className="relative h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={isRecording ? 'Listening...' : 'Type your message here or ask for help...'}
                className={`min-h-[${isMobile ? '60' : '70'}px] h-full resize-none ${isMobile ? 'text-base' : ''} pr-24 ${isRecording ? 'bg-red-50 dark:bg-red-900/10' : ''} border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              {transcript && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>{transcript}</span>
                  </div>
                </div>
              )}
              
              <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
                {isMobile && (
                  <TouchFeedback feedbackColor="#6366f1">
                    <Button
                      onClick={() => setQuickActionsExpanded(!quickActionsExpanded)}
                      variant="secondary"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 touch-manipulation"
                      title="Quick actions"
                      aria-label="Quick actions"
                    >
                      <Zap className="h-4 w-4" />
                    </Button>
                  </TouchFeedback>
                )}
                
                <TouchFeedback feedbackColor="#6366f1">
                  <Button
                    onClick={toggleSpeechRecognition}
                    variant={isRecording ? "destructive" : "secondary"}
                    size="icon"
                    className={`h-10 w-10 rounded-full ${isRecording ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-700'} touch-manipulation`}
                    title={isRecording ? 'Stop recording' : 'Start voice recording'}
                    aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </TouchFeedback>
                
                <TouchFeedback feedbackColor="#4f46e5">
                  <Button
                    onClick={handleSendMessage}
                    disabled={isGenerating || !userInput.trim()}
                    className="h-10 w-10 rounded-full bg-ems-600 hover:bg-ems-700 text-white touch-manipulation"
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
          </div>
          
          {!isMobile && (
            <div className="flex justify-between items-center px-4 pb-3 pt-1 text-xs text-gray-500 dark:text-gray-400">
              <div>
                <span>
                  Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 shadow-sm">Enter</kbd> to send
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  className="text-ems-600 dark:text-ems-400 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1.5 rounded-full flex items-center transition-colors"
                  onClick={() => {
                    setUserInput("Generate a narrative");
                  }}
                >
                  <Zap className="h-3.5 w-3.5 mr-1.5" />
                  <span>Generate Narrative</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};


// Fire Tab Content Component
const FireTabContent: React.FC<{
  fireFormData: {
    unit: string;
    emergencyType: string;
    customEmergencyType: string;
    additionalInfo: string;
  };
  setFireFormData: React.Dispatch<React.SetStateAction<{
    unit: string;
    emergencyType: string;
    customEmergencyType: string;
    additionalInfo: string;
  }>>;
  generateNarrative: (data: NarrativeFormData) => void;
}> = ({
  fireFormData,
  setFireFormData,
  generateNarrative
}) => {
  const isMobile = useIsMobile();
  const [isFormCollapsed, setIsFormCollapsed] = useState(false);
  const [showCustomEmergencyType, setShowCustomEmergencyType] = useState(false);
  
  useEffect(() => {
    setShowCustomEmergencyType(fireFormData.emergencyType === 'Other');
  }, [fireFormData.emergencyType]);
  
  const handleEmergencyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFireFormData(prev => ({
      ...prev,
      emergencyType: value
    }));
    
    setShowCustomEmergencyType(value === 'Other');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format fire data for narrative generation
    const emergencyTypeText = fireFormData.emergencyType === 'Other'
      ? fireFormData.customEmergencyType
      : fireFormData.emergencyType;
    
    // Create narrative data with fire incident information
    const narrativeData: NarrativeFormData = {
      unit: fireFormData.unit,
      dispatch_reason: `Fire: ${emergencyTypeText}`,
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
      treatment_provided: fireFormData.additionalInfo || 'Standard fire protocols followed.',
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
    
    // Call the generateNarrative function with the fire data
    generateNarrative(narrativeData);
  };
  
  const emergencyTypes = [
    "Structure Fire", "Vehicle Fire", "Cooking Fire (Confined)", "Chimney/Flue Fire",
    "Fire in Mobile Home", "Smoke Scare", "Wildland Fire", "Brush Fire", "Grass Fire",
    "Unauthorized Burning", "Smoke Report", "Medical Call", "MVA w/ Injuries",
    "MVA No Injuries", "Extrication", "Search for Person on Land", "Search for Person in Water",
    "Gas Leak", "CO Incident", "Power Line Down", "Hazardous Materials Spill",
    "Smoke Alarm Activation", "False Alarm", "Public Assist", "Ice Rescue",
    "Water Rescue", "Animal Rescue", "Technical Rescue", "High-Angle Rescue",
    "Confined Space Rescue", "Elevator Rescue (Stuck Elevator)", "Natural Gas Leak",
    "Electrical Fire", "Outdoor Fire", "Other"
  ];

  return (
    <motion.div
      className="flex flex-col h-full space-y-2 p-2 m-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 15 }}
    >
      <Card className="flex-1 overflow-auto rounded-lg shadow-md w-full border-0 mx-0 snap-start bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-semibold flex items-center">
            <Flame className="h-5 w-5 mr-2 text-orange-500" />
            Fire Incident Form
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
            onClick={() => setIsFormCollapsed(!isFormCollapsed)}
          >
            {isFormCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {!isFormCollapsed && (
          <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Unit Field */}
                <div className="space-y-2">
                  <label htmlFor="unit" className="block text-sm font-medium">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="unit"
                    type="text"
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg h-11 shadow-sm focus:ring-2 focus:ring-ems-500 focus:border-ems-500 dark:focus:ring-ems-400 dark:focus:border-ems-400 transition-shadow"
                    placeholder="Enter responding unit"
                    value={fireFormData.unit}
                    onChange={(e) => setFireFormData(prev => ({ ...prev, unit: e.target.value }))}
                    required
                    aria-label="Unit"
                  />
                </div>
                
                {/* Emergency Type Group */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Emergency Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg h-11 shadow-sm focus:ring-2 focus:ring-ems-500 focus:border-ems-500 dark:focus:ring-ems-400 dark:focus:border-ems-400 transition-shadow"
                    value={fireFormData.emergencyType}
                    onChange={handleEmergencyTypeChange}
                    required
                    aria-label="Emergency Type"
                  >
                    <option value="">Select Emergency Type</option>
                    {emergencyTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Custom Emergency Type (conditional) */}
              {showCustomEmergencyType && (
                <div className="mt-2">
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg h-11 shadow-sm focus:ring-2 focus:ring-ems-500 focus:border-ems-500 dark:focus:ring-ems-400 dark:focus:border-ems-400 transition-shadow"
                    placeholder="Specify emergency type"
                    value={fireFormData.customEmergencyType}
                    onChange={(e) => setFireFormData(prev => ({ ...prev, customEmergencyType: e.target.value }))}
                    required
                    aria-label="Custom Emergency Type"
                  />
                </div>
              )}
              
              {/* Additional Information */}
              <div className="space-y-2">
                <label htmlFor="additionalInfo" className="block text-sm font-medium">
                  Additional Information
                </label>
                <textarea
                  id="additionalInfo"
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-ems-500 focus:border-ems-500 dark:focus:ring-ems-400 dark:focus:border-ems-400 transition-shadow resize-none"
                  rows={6}
                  placeholder="Enter any additional remarks or information"
                  value={fireFormData.additionalInfo}
                  onChange={(e) => setFireFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                  aria-label="Additional Information"
                ></textarea>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-base font-medium rounded-lg shadow-sm"
              >
                Generate Fire Report
              </Button>
            </form>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default IntegratedDashboard;
