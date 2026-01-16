import { generateLLMAnswer } from '../app/services/llmService.js';
import { db } from '../infra/db/client.js';

export async function summarizeMessages(messages, config) {
  if (!config.summarization.enabled) {
    return null;
  }

  const messageCount = messages.length;
  if (messageCount < config.summarization.frequency) {
    return null;
  }

  const messagesText = messages
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const lengthMap = {
    short: 'brief, key points only',
    medium: 'concise summary of main topics and conclusions',
    long: 'detailed summary including all important details'
  };

  const style = lengthMap[config.summarization.max_length] || lengthMap.medium;

  const prompt = `
Summarize the following conversation. Provide a ${style}.

Conversation:
${messagesText}

Summary:
  `.trim();

  const summary = await generateLLMAnswer(prompt);
  return summary;
}

export async function mergeSummaries(previous, current) {
  if (!previous) {
    return current;
  }

  const prompt = `
Merge these two conversation summaries into a single, coherent summary.
Keep the most important information and ensure chronological consistency.

Previous summary:
${previous}

Current summary:
${current}

Merged summary:
  `.trim();

  const merged = await generateLLMAnswer(prompt);
  return merged;
}

export async function saveConversationSummary(conversationId, summaryText) {
  const client = await db.connect();
  try {
    await client.query(
      'INSERT INTO conversation_summary (conversation_id, summary_text) VALUES ($1, $2)',
      [conversationId, summaryText]
    );
  } finally {
    client.release();
  }
}

export async function updateConversationSummary(conversationId, summaryText) {
  const client = await db.connect();
  try {
    await client.query(
      'UPDATE conversation SET summary = $1 WHERE id = $2',
      [summaryText, conversationId]
    );
  } finally {
    client.release();
  }
}
