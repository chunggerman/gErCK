Database Schema — Phase 1
This project uses PostgreSQL as the primary database engine.
The schema is designed for long‑term scalability, semantic clarity, and cloud portability (AWS RDS, GCP Cloud SQL, Azure PostgreSQL, Supabase, Neon, etc.).
Vector search is supported via the optional pgvector extension.
If pgvector is unavailable, ingestion still works, but vector retrieval will be disabled.
---
1. Required Extensions
CREATE EXTENSION IF NOT EXISTS vector;
This enables the vector column type for embeddings.
---
2. Tables
Below are the Phase‑1 tables with enterprise‑safe, semantically unique column names and explicit foreign keys.
---
2.1 workspace
Represents a user’s knowledge container.
All content, instructions, and assistants belong to a workspace.
CREATE TABLE workspace (
  workspace_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_name        TEXT NOT NULL,
  workspace_description TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
2.2 content
Represents an uploaded file and its processing lifecycle.
CREATE TABLE content (
  content_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id         UUID NOT NULL REFERENCES workspace(workspace_id) ON DELETE CASCADE,
  content_name         TEXT NOT NULL,
  content_description  TEXT,
  filename             TEXT NOT NULL,
  file_path            TEXT NOT NULL,
  status               TEXT NOT NULL, -- 'uploaded' | 'processing' | 'processed' | 'failed'
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
2.3 content_chunk
Represents a semantically meaningful chunk extracted from a content file.
CREATE TABLE content_chunk (
  chunk_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id         UUID NOT NULL REFERENCES content(content_id) ON DELETE CASCADE,
  chunk_index        INT NOT NULL,
  chunk_description  TEXT,
  tags               JSONB, -- array or object of semantic tags
  text               TEXT NOT NULL,
  embedding          vector(1536),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
2.4 instruction
Represents the workspace’s instruction set (raw + structured).
CREATE TABLE instruction (
  instruction_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id           UUID NOT NULL REFERENCES workspace(workspace_id) ON DELETE CASCADE,
  raw_instruction        TEXT NOT NULL,
  structured_instruction JSONB,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
2.5 assistant
Represents an assistant created from a workspace.
CREATE TABLE assistant (
  assistant_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id          UUID NOT NULL REFERENCES workspace(workspace_id) ON DELETE CASCADE,
  assistant_name        TEXT NOT NULL,
  assistant_description TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
3. Chat System
3.1 chat_session
Represents a conversation session with an assistant.
CREATE TABLE chat_session (
  chat_session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assistant_id    UUID NOT NULL REFERENCES assistant(assistant_id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
3.2 chat_message
Represents a single message within a chat session.
CREATE TABLE chat_message (
  chat_message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_session_id UUID NOT NULL REFERENCES chat_session(chat_session_id) ON DELETE CASCADE,
  role            TEXT NOT NULL, -- 'user' | 'assistant' | 'system'
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
4. Indexes
Recommended indexes for performance and retrieval.
-- Workspace-level content lookup
CREATE INDEX idx_content_workspace ON content(workspace_id);

-- Chunk lookup by content
CREATE INDEX idx_chunk_content ON content_chunk(content_id);

-- Vector similarity search
CREATE INDEX idx_chunk_embedding ON content_chunk USING ivfflat (embedding vector_cosine_ops);

-- Assistant → session lookup
CREATE INDEX idx_session_assistant ON chat_session(assistant_id);

-- Session → message lookup
CREATE INDEX idx_message_session ON chat_message(chat_session_id);
5. Entity Relationship Diagram (ERD)
workspace
 ├── content
 │     └── content_chunk
 ├── instruction
 └── assistant
        └── chat_session
               └── chat_message
6. Notes
• All timestamps use TIMESTAMPTZ for timezone correctness.
• vector(1536) should match your embedding model dimension.
• status in content reflects the ingestion lifecycle and must be updated by the pipeline.
• Schema is intentionally normalized and enterprise‑safe.
• No authentication, authorization, or organization tables appear in Phase 1.
These will be introduced in later phases.
