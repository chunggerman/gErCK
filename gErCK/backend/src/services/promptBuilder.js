export function buildPrompt({
  systemDefaultInstruction,
  config,
  summary,
  messages,
  retrievedContext,
  latestUserMessage
}) {
  const sections = [];

  // System instructions
  if (systemDefaultInstruction) {
    sections.push(`System: ${systemDefaultInstruction}`);
  }

  // Instruction template
  if (config.instruction_template) {
    sections.push(`Instructions: ${config.instruction_template}`);
  }

  // Summary
  if (summary && config.memory.use_summary) {
    sections.push(`Conversation Summary:\n${summary}`);
  }

  // Last N messages (excluding the latest user message)
  const recentMessages = messages.slice(-config.memory.window_size);
  if (recentMessages.length > 0) {
    const historyText = recentMessages
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');
    sections.push(`Recent Conversation:\n${historyText}`);
  }

  // Retrieved context
  if (retrievedContext && retrievedContext.length > 0) {
    const contextText = retrievedContext
      .map((chunk, i) => `Context ${i + 1}:\n${chunk.text}`)
      .join('\n\n');
    sections.push(`Relevant Context:\n${contextText}`);
  }

  // Latest user message
  sections.push(`Current User Message: ${latestUserMessage}`);

  return sections.join('\n\n');
}
