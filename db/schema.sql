-- ============================================================
-- gErCK Phase‑1 Schema
-- Clean, modular, workspace‑centric, pgvector‑enabled
-- ============================================================

-- -----------------------------
-- Extensions
-- -----------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================
-- 1. Workspace
-- ============================================================
CREATE TABLE IF NOT EXISTS workspace (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  ai_config JSONB DEFAULT '{
    "model": null,
    "embedding_model": null,
    "top_k": 5,
    "instruction_template": null,
    "summarization": {
      "enabled": true,
      "frequency": 10,
      "style": "adaptive",
      "max_length": "medium"
    },
    "retrieval": {
      "vector_weight": 0.5,
      "keyword_weight": 0.2,
      "recency_weight": 0.2,
      "metadata_weight": 0.1,
      "filters": {}
    },
    "memory": {
      "window_size": 10,
      "use_summary": true
    },
    "chunking": {
      "size": 800,
      "overlap": 100
    }
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. Conversation
-- ============================================================
CREATE TABLE IF NOT EXISTS conversation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  ai_config_override JSONB,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversation_workspace_id
  ON conversation(workspace_id);
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  source_type TEXT NOT NULL, -- text, pdf, docx, image, url
  raw_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_workspace_id
  ON content(workspace_id);

-- ============================================================
-- 3. Message
-- ============================================================
CREATE TABLE IF NOT EXISTS message (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversation(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- user, assistant, system
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_message_conversation_id
  ON message(conversation_id);

-- ============================================================
-- 4. Conversation Summary
-- ============================================================
CREATE TABLE IF NOT EXISTS conversation_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversation(id) ON DELETE CASCADE,
  summary_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversation_summary_conversation_id
  ON conversation_summary(conversation_id);

-- ============================================================
-- 5. Content Chunk
-- ============================================================
CREATE TABLE IF NOT EXISTS content_chunk (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  token_count INTEGER,
  embedding vector(1536), -- Step 2.3
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chunk_content_id
  ON content_chunk(content_id);

-- Vector index for retrieval (Step 3)
CREATE INDEX IF NOT EXISTS idx_chunk_embedding
  ON content_chunk
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- ============================================================
-- 7. Instruction
-- ============================================================
CREATE TABLE IF NOT EXISTS instruction (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_instruction_workspace_id
  ON instruction(workspace_id);

-- ============================================================
-- 8. Assistant
-- ============================================================
CREATE TABLE IF NOT EXISTS assistant (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assistant_workspace_id
  ON assistant(workspace_id);
