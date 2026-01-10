"use client";

import { useState } from "react";
import AskForm from "../components/AskForm";
import AnswerPanel from "../components/AnswerPanel";

export default function Page() {
  const [answer, setAnswer] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <main style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
      <h1>Ask for Knowledge</h1>

      <AskForm
        onAnswer={setAnswer}
        onLoadingChange={setIsLoading}
        onError={setError}
      />

      <AnswerPanel answer={answer} isLoading={isLoading} error={error} />
    </main>
  );
}
