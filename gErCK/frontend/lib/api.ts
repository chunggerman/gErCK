import { AskResponse, AIConfig } from "./types";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

export async function askForKnowledge(question: string): Promise<AskResponse> {
  const res = await fetch(`${BACKEND_BASE_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    throw new Error("Backend error");
  }

  return res.json() as Promise<AskResponse>;
}

export async function getWorkspaceAIConfig(workspaceId: string): Promise<AIConfig> {
  const res = await fetch(`${BACKEND_BASE_URL}/workspace/${workspaceId}/ai-config`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch AI config");
  }

  return res.json() as Promise<AIConfig>;
}

export async function updateWorkspaceAIConfig(workspaceId: string, aiConfig: AIConfig): Promise<void> {
  const res = await fetch(`${BACKEND_BASE_URL}/workspace/${workspaceId}/ai-config`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(aiConfig),
  });

  if (!res.ok) {
    throw new Error("Failed to update AI config");
  }
}

export interface SendMessageRequest {
  message: string;
  config?: Partial<AIConfig>;
}

export interface SendMessageResponse {
  answer: string;
  assistant_message: {
    id: string;
    conversation_id: string;
    role: string;
    content: string;
    created_at: string;
  };
  retrieved_chunks: any[];
}

export async function sendMessage(conversationId: string, request: SendMessageRequest): Promise<SendMessageResponse> {
  const res = await fetch(`${BACKEND_BASE_URL}/conversation/${conversationId}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw new Error("Failed to send message");
  }

  return res.json() as Promise<SendMessageResponse>;
}

export interface StartConversationRequest {
  workspace_id: string;
  first_message: string;
}

export interface StartConversationResponse {
  conversation: {
    id: string;
    workspace_id: string;
    title: string;
    created_at: string;
  };
}

export async function startConversation(request: StartConversationRequest): Promise<StartConversationResponse> {
  const res = await fetch(`${BACKEND_BASE_URL}/conversation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw new Error("Failed to start conversation");
  }

  return res.json() as Promise<StartConversationResponse>;
}
