const express = require("express");
const router = express.Router();
const { streamAnswer } = require("../services/ragService");

router.post("/query", async (req, res) => {
  const { question, templateId, workspaceId } = req.body || {};

  if (!question) {
    return res.status(400).send("Missing 'question' in request body");
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  try {
    const { stream, citations } = await streamAnswer({
      question,
      templateId,
      workspaceId,
    });

    // We buffer citations and send them as a header at the end.
    stream.on("data", (chunk) => {
      res.write(chunk);
    });

    stream.on("end", () => {
      res.setHeader("X-RAG-Metadata", JSON.stringify(citations || []));
      res.end();
    });

    stream.on("error", (err) => {
      console.error("Stream error:", err);
      if (!res.headersSent) {
        res.status(500).send("Error generating answer");
      } else {
        res.end();
      }
    });
  } catch (err) {
    console.error("Route error:", err);
    if (!res.headersSent) {
      res.status(500).send("Error generating answer");
    } else {
      res.end();
    }
  }
});

module.exports = router;
