-- Create a stored procedure for vector similarity search
CREATE OR REPLACE FUNCTION match_embeddings(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT,
  source_filter TEXT[]
)
RETURNS TABLE (
  id UUID,
  content_id TEXT,
  title TEXT,
  content TEXT,
  source TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kbe.id,
    kbe.content_id,
    kbe.title,
    kbe.content,
    kbe.source,
    1 - (kbe.embedding <=> query_embedding) AS similarity
  FROM
    knowledge_base_embeddings kbe
  WHERE
    kbe.source = ANY(source_filter)
    AND 1 - (kbe.embedding <=> query_embedding) > match_threshold
  ORDER BY
    similarity DESC
  LIMIT
    match_count;
END;
$$;

-- Create a function that can be called to create the procedure
CREATE OR REPLACE FUNCTION create_match_embeddings_procedure()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- The function just returns void as the actual procedure is created above
  -- This is just a wrapper to make it callable from the application
  RETURN;
END;
$$;