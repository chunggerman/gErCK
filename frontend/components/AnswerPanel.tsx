import { useEffect, useRef } from "react";

export default function AnswerPanel({ messages }: { messages: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!messages.length) return null;

  return (
    <div
      ref={containerRef}
      className="mt-6 p-4 border rounded bg-gray-50 flex flex-col space-y-4 h-[400px] overflow-y-auto"
    >
      {messages.map((msg, i) => (
        <div
          key={i}
          className={
            msg.role === "user"
              ? "bg-blue-100 text-blue-900 p-3 rounded-lg self-end max-w-[80%]"
              : "bg-green-100 text-green-900 p-3 rounded-lg self-start max-w-[80%]"
          }
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
}