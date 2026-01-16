import { db } from "../../infra/db/client.js";
import { generateLLMAnswer } from "../services/llmService.js";
import { resolveRuntimeConfig, SYSTEM_DEFAULT_CONFIG } from "../../services/runtimeConfigService.js";
import { summarizeMessages, mergeSummaries, saveConversationSummary, updateConversationSummary } from "../../services/summarizationService.js";
import { retrieveContext } from "../../services/retrievalService.js";
import { buildPrompt } from "../../services/promptBuilder.js";

export async function startConversation(req, res) {
  const client = await db.connect();

  try {
    const { workspace_id, first_message } = req.body;

    await client.query("BEGIN");

    const convResult = await client.query(
      `
      INSERT INTO conversation (workspace_id, title)
      VALUES ($1, $2)
      RETURNING *;
      `,
      [workspace_id, first_message.slice(0, 80)]
    );

    const conversation = convResult.rows[0];

    await client.query(
      `
      INSERT INTO message (conversation_id, role, content)
      VALUES ($1, 'user', $2);
      `,
      [conversation.id, first_message]
    );

    await client.query("COMMIT");

    res.json({ conversation });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}

export async function sendMessage(req, res) {
  const client = await db.connect();

  try {
    const { conversation_id, workspace_id, message, config: requestConfig } = req.body;

    await client.query("BEGIN");

    // 1. Load workspace.ai_config
    const workspaceResult = await client.query(
      'SELECT ai_config FROM workspace WHERE id = $1',
      [workspace_id]
    );
    const workspaceConfig = workspaceResult.rows[0]?.ai_config || {};

    // 2. Load conversation.ai_config_override
    const conversationResult = await client.query(
      'SELECT ai_config_override, summary FROM conversation WHERE id = $1',
      [conversation_id]
    );
    const conversation = conversationResult.rows[0];
    const conversationConfig = conversation?.ai_config_override || {};

    // 3. Merge with request.config using resolveRuntimeConfig()
    const runtimeConfig = resolveRuntimeConfig({
      system: SYSTEM_DEFAULT_CONFIG,
      workspace: workspaceConfig,
      conversation: conversationConfig,
      request: requestConfig
    });

    // 4. Load all messages
    const messagesResult = await client.query(
      'SELECT role, content, created_at FROM message WHERE conversation_id = $1 ORDER BY created_at ASC',
      [conversation_id]
    );
    const allMessages = messagesResult.rows;

    // 5. Apply summarization if needed
    let currentSummary = conversation?.summary || null;
    const newSummary = await summarizeMessages(allMessages, runtimeConfig);
    if (newSummary) {
      const mergedSummary = await mergeSummaries(currentSummary, newSummary);
      await updateConversationSummary(conversation_id, mergedSummary);
      await saveConversationSummary(conversation_id, mergedSummary);
      currentSummary = mergedSummary;
    }

    // 6. Retrieve context using retrieveContext()
    const retrievedChunks = await retrieveContext({
      workspaceId: workspace_id,
      query: message,
      config: runtimeConfig
    });

    // 7. Build prompt using buildPrompt()
    const prompt = buildPrompt({
      systemDefaultInstruction: "You are a helpful assistant grounded in the provided context.",
      config: runtimeConfig,
      summary: currentSummary,
      messages: allMessages,
      retrievedContext: retrievedChunks,
      latestUserMessage: message
    });

    // Insert user message
    await client.query(
      'INSERT INTO message (conversation_id, role, content) VALUES ($1, $2, $3)',
      [conversation_id, 'user', message]
    );

    // 8. Call LLM with resolvedConfig.model
    const answer = await generateLLMAnswer(prompt);

    // 9. Save assistant message
    const msgResult = await client.query(
      'INSERT INTO message (conversation_id, role, content) VALUES ($1, $2, $3) RETURNING *',
      [conversation_id, 'assistant', answer]
    );

    await client.query("COMMIT");

    // 10. Return response + retrieved chunks
    res.json({
      answer,
      assistant_message: msgResult.rows[0],
      retrieved_chunks: retrievedChunks
    });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}
