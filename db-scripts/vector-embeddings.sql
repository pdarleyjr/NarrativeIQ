-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a table for knowledge base embeddings
CREATE TABLE knowledge_base_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  source TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for similarity search
CREATE INDEX ON knowledge_base_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create a table to track knowledge base sources
CREATE TABLE knowledge_base_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a table for user knowledge base preferences
CREATE TABLE user_kb_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  selected_sources TEXT[] DEFAULT '{}',
  use_web_search BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE knowledge_base_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_kb_preferences ENABLE ROW LEVEL SECURITY;

-- Knowledge base embeddings policies
CREATE POLICY "Anyone can view knowledge base embeddings" 
  ON knowledge_base_embeddings FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can insert knowledge base embeddings" 
  ON knowledge_base_embeddings FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update knowledge base embeddings" 
  ON knowledge_base_embeddings FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Knowledge base sources policies
CREATE POLICY "Anyone can view knowledge base sources" 
  ON knowledge_base_sources FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can insert knowledge base sources" 
  ON knowledge_base_sources FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update knowledge base sources" 
  ON knowledge_base_sources FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- User KB preferences policies
CREATE POLICY "Users can view their own KB preferences" 
  ON user_kb_preferences FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own KB preferences" 
  ON user_kb_preferences FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own KB preferences" 
  ON user_kb_preferences FOR UPDATE 
  USING (auth.uid() = user_id);

-- Insert initial knowledge base sources
INSERT INTO knowledge_base_sources (name, description, file_path)
VALUES 
  ('National EMS Guidelines', 'National Model EMS Clinical Guidelines', 'knowledge base/ems_guidelines.json'),
  ('National EMS Guidelines (Chunked)', 'National Model EMS Clinical Guidelines in chunked format', 'knowledge base/ems_guidelines_chunks.json'),
  ('South Florida Regional EMS Protocols', 'South Florida Regional EMS Protocols', 'knowledge base/South_FL_Regional_ems_protocols.json');