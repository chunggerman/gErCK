"use client";

import { useState } from "react";
import { ask } from "../lib/api";

export default function AskForm({
  messages,
  onAnswer
}: {
  messages: any[];
  onAnswer: (newMessages: any[], answer: string) => void;
}) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    try {
      // Build new message list
      const newMessages = [
        ...messages,
        { role: "user", content: question }
      ];

      // Send full chat history to backend
      const result = await ask(newMessages);

      // Pass updated messages + answer back to parent
      onAnswer(newMessages, result.answer);

      // Clear input
      setQuestion("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="border p-2 w-full"
        placeholder="Ask something..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Thinking..." : "Ask"}
      </button>
    </form>
  );
}