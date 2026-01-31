// backend/src/app/services/assistantChatService.js

import fetch from "node-fetch";

export async function runAssistantChat({
  aiConfig,
  tenantId,
  workspaceId,
  assistantId,
  messages,
  metadata = {},
}) {
  const endpoint = aiConfig.endpoint;
  const apiKey = aiConfig.apiKey;
  const model = aiConfig.model;

  const body = {
    model,
    messages,
    metadata,
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Assistant chat failed: ${errText}`);
  }

  const data = await response.json();

  return {
    reply: data?.choices?.[0]?.message?.content || "",
    usage: {
      model,
      tokensIn: data?.usage?.prompt_tokens ?? 0,
      tokensOut: data?.usage?.completion_tokens ?? 0,
    },
  };
}
