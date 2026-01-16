interface AnswerPanelProps {
  answer: string;
  isLoading: boolean;
  error?: string | null;
}

export default function AnswerPanel({
  answer,
  isLoading,
  error,
}: AnswerPanelProps) {
  if (isLoading) {
    return (
      <div className="answer-panel">
        <p>Thinking...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="answer-panel">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!answer) {
    return (
      <div className="answer-panel">
        <p>No answer yet. Ask something above.</p>
      </div>
    );
  }

  return (
    <div className="answer-panel">
      <p>{answer}</p>
    </div>
  );
}
