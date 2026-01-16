"use client";

import { useState } from "react";
import Link from "next/link";
import AskForm from "@/components/AskForm";
import AnswerPanel from "@/components/AnswerPanel";
import type { Message, Source } from "@/types";

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState("default");

  async function handleAsk(question: string) {
    // add user message
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/assistant/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          templateId,
          workspaceId: "default",
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Backend error");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      // add empty assistant message to stream into
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let done = false;

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;

        if (value) {
          const chunk = decoder.decode(value);

          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.role === "assistant") {
              last.content += chunk;
            }
            return updated;
          });
        }
      }

      // citations via header
      const meta = res.headers.get("X-RAG-Metadata");
      if (meta) {
        const sources: Source[] = JSON.parse(meta);
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "assistant") {
            last.sources = sources;
          }
          return updated;
        });
      }
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full p-6 gap-4">
      {/* Header actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Assistant</h1>

        <div className="flex gap-3">
          <Link href="../documents" className="text-blue-600 hover:underline">
            Upload Documents
          </Link>
          <Link href="../settings" className="text-blue-600 hover:underline">
            Settings
          </Link>
        </div>
      </div>

      {/* Template selector */}
      <div>
        <select
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="default">Default Template</option>
          <option value="templateA">Template A</option>
          <option value="templateB">Template B</option>
        </select>
      </div>

      {/* Conversation history */}
      <div className="flex-1 overflow-y-auto border rounded p-4 space-y-4 bg-white">
        {messages.map((msg, i) =>
          msg.role === "user" ? (
            <div
              key={i}
              className="p-3 rounded-lg shadow-sm bg-blue-100 ml-auto max-w-[80%]"
            >
              {msg.content}
            </div>
          ) : (
            <AnswerPanel
              key={i}
              answer={msg.content}
              isLoading={false}
              error={null}
              sources={msg.sources}
            />
          )
        )}

        {/* Typing indicator */}
        {loading &&
          messages[messages.length - 1]?.role !== "assistant" && (
            <div className="p-3 rounded-lg shadow-sm bg-gray-200 w-24 animate-pulse">
              …
            </div>
          )}

        {error && (
          <AnswerPanel answer="" isLoading={false} error={error} />
        )}
      </div>

      {/* AskForm */}
      <AskForm
        onSendMessage={handleAsk}
        onLoadingChange={setLoading}
        onError={setError}
      />
    </div>
  );
}
