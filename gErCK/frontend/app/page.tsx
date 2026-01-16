"use client";

import { useState } from "react";
import AskForm from "../components/AskForm";
import AnswerPanel from "../components/AnswerPanel";
import MessageOverridesPanel from "../components/MessageOverridesPanel";
import { startConversation, sendMessage } from "../lib/api";
import { useRequestLevelConfig } from "../lib/hooks/useRequestLevelConfig";

export default function Page() {
  const [answer, setAnswer] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { config } = useRequestLevelConfig();

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!conversationId) {
        // Start new conversation
        const result = await startConversation({
          workspace_id: "default-workspace", // Hardcode for now
          first_message: message
        });
        setConversationId(result.conversation.id);
        setAnswer("Conversation started. Ask follow-up questions.");
      } else {
        // Send message
        const result = await sendMessage(conversationId, {
          message,
          config: Object.keys(config).length > 0 ? config : undefined
        });
        setAnswer(result.answer);
      }
    } catch (err) {
      setError("Failed to send message.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
      <h1>AI Conversation</h1>

      <div>
        <AskForm
          onAnswer={() => {}} // Not used
          onLoadingChange={setIsLoading}
          onError={setError}
          onSendMessage={handleSendMessage}
        />
        <MessageOverridesPanel />
      </div>

      <AnswerPanel answer={answer} isLoading={isLoading} error={error} />
    </main>
  );
}
