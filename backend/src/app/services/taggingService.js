// backend/src/app/services/taggingService.js

import fetch from "node-fetch";

export async function runAiTagging({
  aiConfig,
  content,
  referenceTags = [],
  metadata = {},
}) {
  const endpoint = aiConfig.endpoint;
  const apiKey = aiConfig.apiKey;
  const model = aiConfig.model;

  const systemPrompt = `
You are a tagging engine.
Given text content and a list of builder-defined reference tags,
return ONLY the tags that match the content.
Return as a JSON array of strings.
No explanations.
`;

  const body = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: JSON.stringify({
          content,
          referenceTags,
        }),
      },
    ],
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
    throw new Error(`AI tagging failed: ${errText}`);
  }

  const data = await response.json();

  let tags = [];
  try {
    tags = JSON.parse(data?.choices?.[0]?.message?.content || "[]");
  } catch {
    tags = [];
  }

  return {
    tags,
    usage: {
      model,
      tokensIn: data?.usage?.prompt_tokens ?? 0,
      tokensOut: data?.usage?.completion_tokens ?? 0,
    },
  };
}
