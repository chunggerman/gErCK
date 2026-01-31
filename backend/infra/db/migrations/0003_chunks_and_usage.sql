-- 0003_chunks_and_usage.sql
-- Document chunks + usage logging + pgvector embedding column

-- Document chunks: tests query COUNT(*) and embedding IS NOT NULL
CREATE TABLE IF NOT EXISTS document_chunks (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id  uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  chunk_index  integer NOT NULL,
  content      text NOT NULL,
  -- pgvector column; dimension can be adjusted in code, tests only check non-null
  embedding    vector(1536),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Usage logging: tests query COUNT(*) WHERE assistant_id = $1
CREATE TABLE IF NOT EXISTS usage (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assistant_id uuid NOT NULL REFERENCES assistants(id) ON DELETE CASCADE,
  tenant_id    uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  document_id  uuid REFERENCES documents(id) ON DELETE SET NULL,
  event_type   text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);
