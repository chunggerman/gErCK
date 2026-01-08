"use client";

import { useState } from "react";
import AskForm from "../components/AskForm";
import AnswerPanel from "../components/AnswerPanel";

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]);

  // Updated to accept newMessages instead of question
  function handleNewAnswer(newMessages: any[], answer: string) {
    setMessages([
      ...newMessages,
      { role: "assistant", content: answer }
    ]);
  }

  return (
    <main className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">gErCK — Chat</h1>

      {/* Pass messages into AskForm */}
      <AskForm messages={messages} onAnswer={handleNewAnswer} />

      <AnswerPanel messages={messages} />
    </main>
  );
}