-- 0004_constraints_and_indexes.sql
-- Uniqueness + indexes aligned with tests and expected behavior

-- Tenant name uniqueness (via hash, since name is encrypted)
ALTER TABLE tenants
  ADD CONSTRAINT tenants_name_hash_unique UNIQUE (name_hash);

-- Basic lookup indexes
CREATE INDEX IF NOT EXISTS idx_workspaces_tenant_id
  ON workspaces (tenant_id);

CREATE INDEX IF NOT EXISTS idx_assistants_tenant_workspace
  ON assistants (tenant_id, workspace_id);

CREATE INDEX IF NOT EXISTS idx_documents_tenant_workspace
  ON documents (tenant_id, workspace_id);

CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id
  ON document_chunks (document_id);

CREATE INDEX IF NOT EXISTS idx_usage_assistant_id
  ON usage (assistant_id);
