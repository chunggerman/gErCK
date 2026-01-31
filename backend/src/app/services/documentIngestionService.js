// backend/src/app/services/documentIngestionService.js

import { chunkDocumentContent } from "./chunkingService.js";
import { generateEmbedding } from "./embeddingService.js";
import { runAiTagging } from "./taggingService.js";
import { getEffectiveAiConfig } from "./aiConfigService.js";
import { db } from "../../infra/db/client.js";

export async function ingestDocument({
  tenantId,
  workspaceId,
  referenceId,
  content,
  referenceTags = [],
}) {
  const aiConfig = await getEffectiveAiConfig({ tenantId, workspaceId });
  if (!aiConfig) throw new Error("No AI config found for tenant/workspace");

  const chunks = chunkDocumentContent(content);

  const insertedChunks = [];

  for (const chunk of chunks) {
    const { embedding, usage: embedUsage } = await generateEmbedding({
      aiConfig,
      text: chunk,
    });

    const { tags, usage: tagUsage } = await runAiTagging({
      aiConfig,
      content: chunk,
      referenceTags,
    });

    const result = await db.query(
      `
      INSERT INTO document_chunks
      (tenant_id, workspace_id, reference_id, content, embedding, tags)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [tenantId, workspaceId, referenceId, chunk, embedding, tags]
    );

    insertedChunks.push(result.rows[0]);
  }

  return insertedChunks;
}
