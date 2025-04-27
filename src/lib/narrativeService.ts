import { supabase } from './supabase';
import { generateNarrative, generateNarrativeWithWebSearch } from './openai-client';
import { generateNarrativeWithOpenRouter, generateNarrativeWithWebSearchOpenRouter } from './openrouter';
import { searchKnowledgeBase, getUserKbPreferences } from './knowledgeBaseService';
import { toast } from "sonner";

/**
 * Interface for narrative generation options
 */
export interface NarrativeGenerationOptions {
  userId: string;
  runData: {
    patientAge?: number;
    patientGender?: string;
    chiefComplaint?: string;
    vitalSigns?: {
      bloodPressure?: string;
      heartRate?: number;
      respiratoryRate?: number;
      oxygenSaturation?: number;
      temperature?: number;
      bloodGlucose?: number;
    };
    medications?: string[];
    procedures?: string[];
    assessment?: string;
    transport?: {
      destination?: string;
      mode?: string;
    };
    [key: string]: unknown;
  };
  format?: 'standard' | 'soap' | 'chart';
  maxLength?: number;
  useOpenRouter?: boolean; // Option to use OpenRouter instead of OpenAI
}

/**
 * Generate a narrative based on run data and user preferences
 * @param options - Narrative generation options
 * @returns Generated narrative text
 */
export async function generateEmsNarrative(options: NarrativeGenerationOptions): Promise<string> {
  try {
    const { userId, runData, format = 'standard', maxLength = 1500, useOpenRouter = false } = options;
    
    // Show loading toast
    toast.loading("Generating narrative...");
    
    // Get user's knowledge base preferences
    const preferences = await getUserKbPreferences(userId);
    
    // Format the run data as a string
    const runDataString = formatRunDataForPrompt(runData, format);
    
    let narrative = '';
    
    // If no preferences or no selected sources and web search is disabled, use default approach
    if (!preferences || (preferences.selected_sources.length === 0 && !preferences.use_web_search)) {
      console.log('Using default web search for narrative generation');
      // Default to using web search with either OpenAI or OpenRouter
      narrative = await (useOpenRouter
        ? generateNarrativeWithWebSearchOpenRouter(runDataString)
        : generateNarrativeWithWebSearch(runDataString));
    }
    // If no sources selected but web search is enabled
    else if (preferences.selected_sources.length === 0 && preferences.use_web_search) {
      console.log('Using web search for narrative generation');
      narrative = await (useOpenRouter
        ? generateNarrativeWithWebSearchOpenRouter(runDataString)
        : generateNarrativeWithWebSearch(runDataString));
    }
    else {
      console.log('Using knowledge base for narrative generation with sources:', preferences.selected_sources);
      // Search knowledge base for relevant context
      const contextSnippets = await searchKnowledgeBase(
        `${runData.chiefComplaint || ''} ${runData.assessment || ''}`,
        preferences.selected_sources,
        5 // Get top 5 most relevant snippets
      );
      
      // Generate narrative with context using either OpenAI or OpenRouter
      narrative = await (useOpenRouter
        ? generateNarrativeWithOpenRouter(runDataString, contextSnippets)
        : generateNarrative(runDataString, contextSnippets));
    }
    
    // Dismiss loading toast
    toast.dismiss();
    
    // Show success toast
    toast.success("Narrative generated successfully!");
    
    return narrative;
  } catch (error) {
    console.error('Error generating narrative:', error);
    // Dismiss loading toast
    toast.dismiss();
    
    // Show error toast
    toast.error("Failed to generate narrative. Please try again.");
    
    throw error;
  }
}

/**
 * Format run data as a string for the prompt
 * @param runData - The run data object
 * @param format - The desired narrative format
 * @returns Formatted run data string
 */
function formatRunDataForPrompt(
  runData: NarrativeGenerationOptions['runData'], 
  format: string
): string {
  // Create a structured representation of the run data
  const sections = [
    {
      title: 'Patient Information',
      content: [
        runData.patientAge ? `Age: ${runData.patientAge}` : null,
        runData.patientGender ? `Gender: ${runData.patientGender}` : null,
      ].filter(Boolean).join('\n')
    },
    {
      title: 'Chief Complaint',
      content: runData.chiefComplaint || 'Not provided'
    },
    {
      title: 'Vital Signs',
      content: runData.vitalSigns ? [
        runData.vitalSigns.bloodPressure ? `BP: ${runData.vitalSigns.bloodPressure}` : null,
        runData.vitalSigns.heartRate ? `HR: ${runData.vitalSigns.heartRate}` : null,
        runData.vitalSigns.respiratoryRate ? `RR: ${runData.vitalSigns.respiratoryRate}` : null,
        runData.vitalSigns.oxygenSaturation ? `SpO2: ${runData.vitalSigns.oxygenSaturation}%` : null,
        runData.vitalSigns.temperature ? `Temp: ${runData.vitalSigns.temperature}°F` : null,
        runData.vitalSigns.bloodGlucose ? `BGL: ${runData.vitalSigns.bloodGlucose} mg/dL` : null,
      ].filter(Boolean).join('\n') : 'Not provided'
    },
    {
      title: 'Medications Administered',
      content: runData.medications && runData.medications.length > 0 
        ? runData.medications.join('\n') 
        : 'None'
    },
    {
      title: 'Procedures Performed',
      content: runData.procedures && runData.procedures.length > 0 
        ? runData.procedures.join('\n') 
        : 'None'
    },
    {
      title: 'Assessment',
      content: runData.assessment || 'Not provided'
    },
    {
      title: 'Transport',
      content: runData.transport ? [
        runData.transport.destination ? `Destination: ${runData.transport.destination}` : null,
        runData.transport.mode ? `Mode: ${runData.transport.mode}` : null,
      ].filter(Boolean).join('\n') : 'Not provided'
    }
  ];
  
  // Format instructions based on the requested format
  let formatInstructions = '';
  switch (format) {
    case 'soap':
      formatInstructions = 'Please format the narrative in SOAP format (Subjective, Objective, Assessment, Plan).';
      break;
    case 'chart':
      formatInstructions = 'Please format the narrative in CHART format (Chief complaint, History, Assessment, Rx/Treatment, Transport).';
      break;
    default:
      formatInstructions = 'Please format the narrative in standard paragraph format.';
  }
  
  // Combine all sections
  const formattedData = [
    `FORMAT INSTRUCTIONS: ${formatInstructions}`,
    ...sections.map(section => `${section.title}:\n${section.content}`)
  ].join('\n\n');
  
  return formattedData;
}

/**
 * Save a generated narrative to the database
 * @param userId - The user's ID
 * @param title - The narrative title
 * @param content - The narrative content
 * @param format - The narrative format
 * @returns The saved narrative object
 */
interface SavedNarrative {
  id: string;
  user_id: string;
  title: string;
  content: string;
  format: string;
  created_at: string;
}

export async function saveNarrative(
  userId: string,
  title: string,
  content: string,
  format: string = 'standard'
): Promise<SavedNarrative> {
  try {
    // Show loading toast
    toast.loading("Saving narrative...");
    
    const { data, error } = await supabase
      .from('narratives')
      .insert({
        user_id: userId,
        title,
        content,
        format
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving narrative:', error);
      toast.dismiss();
      toast.error("Failed to save narrative.");
      throw error;
    }
    
    // Dismiss loading toast and show success
    toast.dismiss();
    toast.success("Narrative saved successfully!");
    
    return data;
  } catch (error) {
    console.error('Error in saveNarrative:', error);
    toast.dismiss();
    toast.error("Failed to save narrative.");
    throw error;
  }
}

/**
 * Load a narrative from the database by ID
 * @param narrativeId - The narrative ID to load
 * @returns The narrative object
 */
export async function loadNarrative(narrativeId: string): Promise<SavedNarrative> {
  try {
    const { data, error } = await supabase
      .from('narratives')
      .select('*')
      .eq('id', narrativeId)
      .single();
    
    if (error) {
      console.error('Error loading narrative:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in loadNarrative:', error);
    throw error;
  }
}

/**
 * Delete a narrative from the database
 * @param narrativeId - The ID of the narrative to delete
 */
export async function deleteNarrative(narrativeId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('narratives')
      .delete()
      .eq('id', narrativeId);
    
    if (error) {
      console.error('Error deleting narrative:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteNarrative:', error);
    throw error;
  }
}
