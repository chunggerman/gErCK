// backend/src/app/services/ingestService.js

import { ContentRepositoryPostgres } from "../../repositories/postgres/contentRepositoryPostgres.js";
import { ContentChunkRepositoryPostgres } from "../../repositories/postgres/contentChunkRepositoryPostgres.js";
import { TagRepositoryPostgres } from "../../repositories/postgres/tagRepositoryPostgres.js";

import { chunkText } from "./chunkingService.js";
import { embedText } from "./embeddingService.js";
import { callLLM } from "./llmService.js";

const contentRepo = new ContentRepositoryPostgres();
const chunkRepo = new ContentChunkRepositoryPostgres();
const tagRepo = new TagRepositoryPostgres();

/**
 * Extract raw text from uploaded file.
 * Phase‑B: placeholder — you can plug in PDF/DOCX extractors later.
 */
async function extractRawText(file) {
  if (!file) return "";
  return file.text || file.rawText || ""; // simple fallback
}

/**
 * Auto‑generate tags for a chunk using LLM.
 */
async function generateTagsForChunk(text) {
  const prompt = `
You are a tagging engine. Extract 3–7 short, meaningful tags from the following text.
Return ONLY a comma-separated list of tags, no explanations.

Text:
${text}
`;

  const raw = await callLLM(prompt, { model: "llama3.1" });
  return raw
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0);
}

/**
 * Full ingestion pipeline:
 * - create content
 * - extract text
 * - chunk
 * - embed
 * - insert chunks
 * - auto-tag
 * - update metadata
 */
export async function ingestContent({
  workspaceId,
  title,
  sourceType,
  file,
  metadata = {}
}) {
  // 1. Create content row (rawText may be null initially)
  const content = await contentRepo.create({
    workspaceId,
    title,
    sourceType,
    rawText: null,
    metadata
  });

  // 2. Extract raw text
  const rawText = await extractRawText(file);

  // 3. Update content with raw text
  await contentRepo.updateRawText(content.id, rawText);

  // 4. Chunk text
  const chunks = chunkText(rawText, {
    size: 800,
    overlap: 100
  });

  const insertedChunks = [];

  // 5. Process each chunk
  for (const chunk of chunks) {
    // 5a. Embed
    const embedding = await embedText(chunk.text);

    // 5b. Insert chunk into DB
    const inserted = await chunkRepo.createChunk({
      contentId: content.id,
      text: chunk.text,
      tokenCount: chunk.tokenCount,
      embedding
    });

    insertedChunks.push(inserted);

    // 5c. Auto-generate tags
    const tags = await generateTagsForChunk(chunk.text);

    // 5d. Deduplicate + attach tags
    for (const tagName of tags) {
      const tag = await tagRepo.findOrCreate(tagName);
      await tagRepo.attachToChunk(inserted.id, tag.id);
    }
  }

  // 6. Update metadata with ingestion summary
  await contentRepo.updateMetadata(content.id, {
    ingested: true,
    chunkCount: insertedChunks.length,
    autoTagged: true,
    updatedAt: new Date().toISOString()
  });

  return {
    content,
    chunks: insertedChunks
  };
}
