
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Clipboard, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { isIOS } from '@/utils/platformUtils';

interface Protocol {
  id: string;
  title: string;
  description: string;
  suggestion?: string;
}

interface ProtocolSidebarProps {
  chiefComplaint: string;
}

const ProtocolSidebar: React.FC<ProtocolSidebarProps> = ({ chiefComplaint }) => {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!chiefComplaint) return;
    
    // Function to extract chief complaint from narrative
    const extractChiefComplaint = (narrative: string): string => {
      // Simple extraction logic - can be enhanced
      const chiefRegex = /chief complaint of (.*?)( for|\.|,)/i;
      const match = narrative.match(chiefRegex);
      return match ? match[1].trim() : "";
    };

    const fetchProtocols = async () => {
      setIsLoading(true);
      
      try {
        // In a real implementation, this would be an API call
        // For now, we'll mock the protocol data based on extracted complaint
        const complaint = extractChiefComplaint(chiefComplaint).toLowerCase();
        
        // Wait for a moment to simulate API fetch
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (complaint.includes('chest pain')) {
          setProtocols([
            {
              id: 'p1',
              title: 'Chest Pain Protocol',
              description: 'Follow the chest pain protocol including ECG, aspirin, and nitroglycerin assessment.',
              suggestion: 'Nitro not documented - check blood pressure or contraindications?'
            },
            {
              id: 'p2',
              title: 'Cardiac Protocol',
              description: 'Cardiac monitoring and assessment guidelines.'
            }
          ]);
        } else if (complaint.includes('breath') || complaint.includes('breathing')) {
          setProtocols([
            {
              id: 'p3',
              title: 'Respiratory Distress Protocol',
              description: 'Assessment and interventions for respiratory distress.',
              suggestion: 'Consider documenting SpO2 readings pre and post intervention.'
            }
          ]);
        } else if (complaint.includes('fall')) {
          setProtocols([
            {
              id: 'p4',
              title: 'Fall Assessment Protocol',
              description: 'Trauma assessment for falls including c-spine precautions.',
              suggestion: 'Spinal immobilization criteria not documented.'
            }
          ]);
        } else if (chiefComplaint.includes('trauma') || chiefComplaint.includes('injury')) {
          setProtocols([
            {
              id: 'p5',
              title: 'Trauma Protocol',
              description: 'Major trauma assessment and interventions.'
            }
          ]);
        } else {
          // Default protocols
          setProtocols([
            {
              id: 'p6',
              title: 'General Assessment Protocol',
              description: 'Standard assessment guidelines for all patients.'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching protocols:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProtocols();
  }, [chiefComplaint]);

  const addToNarrative = (suggestion: string) => {
    // Provide haptic feedback for iOS devices
    if (isIOS() && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    // In a real implementation, this would modify the narrative or notify the parent
    toast.success(`Suggestion added: ${suggestion}`);
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (protocols.length === 0) {
    return (
      <div 
        className="p-4 text-center text-sm text-gray-500 rounded-lg"
        role="alert"
        aria-live="polite"
      >
        No relevant protocols found. Generate a narrative to see related protocols.
      </div>
    );
  }

  return (
    <div 
      className="space-y-4 px-2 py-2" 
      role="region" 
      aria-label="Protocol recommendations"
    >
      {protocols.map((protocol) => (
        <div 
          key={protocol.id} 
          className="p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
          role="article"
        >
          <div className="font-medium text-sm flex items-center gap-2">
            <Clipboard className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span>{protocol.title}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">{protocol.description}</p>
          
          {protocol.suggestion && (
            <div className="mt-3 text-sm bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-md p-2.5">
              <div className="flex gap-2 items-start">
                <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1">{protocol.suggestion}</div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 h-10 text-sm w-full" // Increased height to 44px minimum for iOS
                onClick={() => addToNarrative(protocol.suggestion!)}
                aria-label={`Add suggestion: ${protocol.suggestion}`}
              >
                <PlusCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                Add to Narrative
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProtocolSidebar;
