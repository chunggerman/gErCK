const { Readable } = require("stream");

// This is a stub implementation.
// Replace with your real RAG pipeline (retrieval + LLM + citations).
async function streamAnswer({ question, templateId, workspaceId }) {
  const fullAnswer = `This is a streamed response to: ${question}\n\n(template: ${templateId}, workspace: ${workspaceId})`;

  const citations = [
    {
      title: "Sample Document A",
      chunk: "This is a relevant excerpt from document A.",
      id: "doc-a",
    },
    {
      title: "Sample Document B",
      chunk: "This is a relevant excerpt from document B.",
      id: "doc-b",
    },
  ];

  const stream = Readable.from(fullAnswer);

  return { stream, citations };
}

module.exports = { streamAnswer };
