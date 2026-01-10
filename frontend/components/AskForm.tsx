"use client";

import { FormEvent, useState } from "react";
import { askForKnowledge } from "../lib/api";

interface AskFormProps {
  onAnswer: (answer: string) => void;
  onLoadingChange: (isLoading: boolean) => void;
  onError: (error: string | null) => void;
}

export default function AskForm({
  onAnswer,
  onLoadingChange,
  onError,
}: AskFormProps) {
  const [question, setQuestion] = useState<string>("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!question.trim()) {
      onError("Please enter a question.");
      return;
    }

    onLoadingChange(true);
    onError(null);

    try {
      const result = await askForKnowledge(question);
      onAnswer(result.answer);
    } catch {
      onError("Failed to get an answer from the backend.");
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
        placeholder="Ask for knowledge..."
      />
      <button type="submit">Ask</button>
    </form>
  );
}
