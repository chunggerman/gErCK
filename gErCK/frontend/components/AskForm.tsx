"use client";

import { FormEvent, useState } from "react";

interface AskFormProps {
  onSendMessage: (message: string) => Promise<void> | void;
  onLoadingChange: (isLoading: boolean) => void;
  onError: (error: string | null) => void;
}

export default function AskForm({
  onSendMessage,
  onLoadingChange,
  onError,
}: AskFormProps) {
  const [question, setQuestion] = useState<string>("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!question.trim()) {
      onError("Please enter a message.");
      return;
    }

    onLoadingChange(true);
    onError(null);

    try {
      await onSendMessage(question);
      setQuestion("");
    } catch {
      onError("Failed to send message.");
    } finally {
      onLoadingChange(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg shadow-sm p-3 bg-white flex flex-col gap-2"
    >
      {/* Multi-line Slack-style input */}
      <textarea
        className="w-full resize-none border-0 focus:ring-0 p-2 text-sm"
        rows={3}
        placeholder="Ask something…"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      {/* Toolbar + Send */}
      <div className="flex items-center justify-between">
        {/* Toolbar icons (placeholder for now) */}
        <div className="flex gap-3 text-gray-500">
          <button type="button" className="hover:text-gray-700">
            B
          </button>
          <button type="button" className="hover:text-gray-700">
            I
          </button>
          <button type="button" className="hover:text-gray-700">
            ⬆ Upload
          </button>
        </div>

        {/* Send button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm"
        >
          Send
        </button>
      </div>
    </form>
  );
}
