"use client";

import { FormEvent, useState } from "react";

interface AskFormProps {
  onSendMessage: (message: string) => void;
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
      onSendMessage(question);
      setQuestion("");
    } catch {
      onError("Failed to send message.");
    } finally {
      onLoadingChange(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="ask-form">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter your message..."
      />
      <button type="submit">Send</button>
    </form>
  );
}
