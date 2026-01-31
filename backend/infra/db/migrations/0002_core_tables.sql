-- 0002_core_tables.sql
-- Core entities: tenants, workspaces, assistants, documents

-- Tenants: name is stored ENCRYPTED (bytea) to satisfy
-- test: dbRes.rows[0].name !== 'Acme Corp'
CREATE TABLE IF NOT EXISTS tenants (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        bytea NOT NULL,
  -- used for uniqueness & lookup without breaking encryption
  name_hash   text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Workspaces: plaintext name (tests expect exact match)
CREATE TABLE IF NOT EXISTS workspaces (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Assistants: linked to tenant + workspace
CREATE TABLE IF NOT EXISTS assistants (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name         text NOT NULL,
  model        text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Documents: chunked/embedded flags are required by tests
CREATE TABLE IF NOT EXISTS documents (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name         text NOT NULL,
  content      text NOT NULL,
  chunked      boolean NOT NULL DEFAULT false,
  embedded     boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);
