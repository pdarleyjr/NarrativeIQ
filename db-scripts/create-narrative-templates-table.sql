-- Create narrative_templates table
CREATE TABLE IF NOT EXISTS public.narrative_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add RLS policies
ALTER TABLE public.narrative_templates ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to select only their own templates
CREATE POLICY "Users can view their own templates" 
  ON public.narrative_templates 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy to allow users to insert their own templates
CREATE POLICY "Users can insert their own templates" 
  ON public.narrative_templates 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own templates
CREATE POLICY "Users can update their own templates" 
  ON public.narrative_templates 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy to allow users to delete their own templates
CREATE POLICY "Users can delete their own templates" 
  ON public.narrative_templates 
  FOR DELETE 
  USING (auth.uid() = user_id);