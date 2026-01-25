// backend/src/app/services/workspaceService.js

const defaultSettings = {
  retrieval: {
    topK: 5,
    scoreThreshold: 0.2
  },
  chunking: {
    strategy: "recursive",
    maxTokens: 800
  },
  summarization: {
    enabled: false,
    model: "gpt-4"
  },
  model: {
    provider: "openai",
    model: "gpt-4"
  },
  memory: {
    enabled: false
  },
  messageOverrides: {
    systemPrompt: "",
    temperature: 0.7
  }
};

const workspaceSettings = {
  default: { ...defaultSettings }
};

export function getWorkspaceSettings(workspaceId) {
  if (!workspaceSettings[workspaceId]) {
    workspaceSettings[workspaceId] = { ...defaultSettings };
  }
  return workspaceSettings[workspaceId];
}

export function updateWorkspaceSettings(workspaceId, newSettings) {
  workspaceSettings[workspaceId] = {
    ...workspaceSettings[workspaceId],
    ...newSettings
  };
  return workspaceSettings[workspaceId];
}
