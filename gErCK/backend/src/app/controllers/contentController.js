// backend/src/app/controllers/contentController.js

import { db } from "../../infra/db/client.js";
import { ChunkRepositoryPostgres } from "../../repositories/postgres/chunkRepositoryPostgres.js";
import { generateEmbedding } from "../services/embeddingService.js";

const chunkRepo = new ChunkRepositoryPostgres();

export async function uploadContent(req, res) {
  const client = await db.connect();

  try {
    const { workspace_id, title, text } = req.body;

    await client.query("BEGIN");

    const contentResult = await client.query(
      `
      INSERT INTO content (workspace_id, title, source_type, raw_text)
      VALUES ($1, $2, 'text', $3)
      RETURNING *;
      `,
      [workspace_id, title, text]
    );

    const content = contentResult.rows[0];

    const chunks = [
      {
        text,
        token_count: text.length
      }
    ];

    const insertedChunks = await chunkRepo.createMany(client, content.id, chunks);

    const firstChunk = insertedChunks[0];

    const embedding = await generateEmbedding(firstChunk.text);

    await chunkRepo.updateEmbedding(client, firstChunk.id, embedding);

    await client.query("COMMIT");

    res.json({
      content,
      chunk_count: insertedChunks.length,
      embedded: true
    });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}

export async function searchContent(req, res) {
  const client = await db.connect();

  try {
    const { workspace_id, query, limit = 5 } = req.body;

    const embedding = await generateEmbedding(query);

    const results = await chunkRepo.searchByEmbedding(
      client,
      workspace_id,
      embedding,
      limit
    );

    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}
