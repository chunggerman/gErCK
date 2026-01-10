import { AskResponse } from "./types";

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
