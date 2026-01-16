import { InstructionTemplate } from "./types";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

export async function listTemplates(workspaceId: string): Promise<InstructionTemplate[]> {
  const res = await fetch(`${BACKEND_BASE_URL}/workspace/${workspaceId}/templates`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to list templates");
  }

  return res.json() as Promise<InstructionTemplate[]>;
}

export async function getTemplate(workspaceId: string, templateId: string): Promise<InstructionTemplate> {
  const res = await fetch(`${BACKEND_BASE_URL}/workspace/${workspaceId}/templates/${templateId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to get template");
  }

  return res.json() as Promise<InstructionTemplate>;
}

export interface CreateTemplatePayload {
  name: string;
  description?: string;
  content: string;
}

export async function createTemplate(workspaceId: string, payload: CreateTemplatePayload): Promise<InstructionTemplate> {
  const res = await fetch(`${BACKEND_BASE_URL}/workspace/${workspaceId}/templates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create template");
  }

  return res.json() as Promise<InstructionTemplate>;
}

export async function updateTemplate(workspaceId: string, templateId: string, payload: CreateTemplatePayload): Promise<InstructionTemplate> {
  const res = await fetch(`${BACKEND_BASE_URL}/workspace/${workspaceId}/templates/${templateId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to update template");
  }

  return res.json() as Promise<InstructionTemplate>;
}

export async function deleteTemplate(workspaceId: string, templateId: string): Promise<void> {
  const res = await fetch(`${BACKEND_BASE_URL}/workspace/${workspaceId}/templates/${templateId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to delete template");
  }
}
