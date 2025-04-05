
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Clipboard, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

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
    // In a real implementation, this would modify the narrative or notify the parent
    toast.success(`Suggestion added: ${suggestion}`);
  };

  if (isLoading) {
    return (
      <div className="p-2 text-center text-sm text-gray-500">
        Loading relevant protocols...
      </div>
    );
  }

  if (protocols.length === 0) {
    return (
      <div className="p-2 text-center text-sm text-gray-500">
        No relevant protocols found. Generate a narrative to see related protocols.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {protocols.map((protocol) => (
        <div 
          key={protocol.id} 
          className="p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
        >
          <div className="font-medium text-sm flex items-center gap-1">
            <Clipboard className="h-3.5 w-3.5" />
            {protocol.title}
          </div>
          <p className="text-xs text-gray-500 mt-1">{protocol.description}</p>
          
          {protocol.suggestion && (
            <div className="mt-2 text-xs bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded p-1.5">
              <div className="flex gap-1 items-start">
                <AlertCircle className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">{protocol.suggestion}</div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-1.5 h-7 text-xs w-full"
                onClick={() => addToNarrative(protocol.suggestion!)}
              >
                <PlusCircle className="h-3 w-3 mr-1" />
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
