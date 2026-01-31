// backend/src/app/services/aiConfigService.js

import { TenantsRepositoryPostgres } from "../../repositories/postgres/tenantsRepositoryPostgres.js";
import { WorkspacesRepositoryPostgres } from "../../repositories/postgres/workspaceRepositoryPostgres.js";

const tenantsRepo = new TenantsRepositoryPostgres();
const workspacesRepo = new WorkspacesRepositoryPostgres();

export async function getEffectiveAiConfig({ tenantId, workspaceId }) {
  const tenant = await tenantsRepo.get(tenantId);
  if (!tenant) return null;

  const workspace = await workspacesRepo.get(workspaceId);
  if (!workspace || workspace.tenant_id !== tenantId) return null;

  const tenantConfig = tenant.ai_config || {};
  const workspaceConfig = workspace.ai_config || {};

  return {
    ...tenantConfig,
    ...workspaceConfig,
  };
}
