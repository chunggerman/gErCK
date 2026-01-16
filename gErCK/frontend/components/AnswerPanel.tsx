"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import type { Source } from "@/types";

interface AnswerPanelProps {
  answer: string;
  isLoading: boolean;
  error?: string | null;
  sources?: Source[];
}

export default function AnswerPanel({
  answer,
  isLoading,
  error,
  sources = [],
}: AnswerPanelProps) {
  if (isLoading) {
    return (
      <div className="p-3 rounded-lg shadow-sm bg-gray-200 w-32 animate-pulse">
        Thinking…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 rounded-lg shadow-sm bg-red-100 text-red-700 max-w-[80%] mr-auto">
        {error}
      </div>
    );
  }

  if (!answer) {
    return (
      <div className="p-3 rounded-lg shadow-sm bg-gray-100 text-gray-500 max-w-[80%] mr-auto">
        No answer yet. Ask something above.
      </div>
    );
  }

  return (
    <div className="p-3 rounded-lg shadow-sm bg-gray-100 mr-auto max-w-[80%] space-y-3">
      {/* Answer */}
      <ReactMarkdown className="prose prose-sm max-w-none">
        {answer}
      </ReactMarkdown>

      {/* Citations */}
      {sources.length > 0 && (
        <div className="border-t pt-2 space-y-2">
          <p className="text-xs font-semibold text-gray-600">Sources</p>

          {sources.map((src, i) => (
            <div
              key={i}
              className="p-2 rounded border bg-white shadow-sm text-xs"
            >
              <p className="font-medium">{src.title}</p>
              <p className="text-gray-600 mt-1">{src.chunk}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
