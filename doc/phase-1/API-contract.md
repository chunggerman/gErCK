1. Overview
This document defines the Phase 1 API contract for the platform.
It covers:
• Workspaces
• Content & chunks
• Instructions
• Assistants
• Chat sessions & messages
• Retrieval (RAG-style query over chunks)
All APIs are JSON over HTTP.
Authentication is out of scope for Phase 1 and can be added later (e.g. API keys, JWT).
Base URL is assumed as:
/ api / v1 / ...
2. Conventions
• Timestamps: ISO 8601 strings (UTC), e.g. "2026-01-13T05:00:00Z"
• IDs: UUID strings
• Errors: JSON with error_code, message, and optional details
• Status codes:
	◦ 200 OK
	◦ 201 Created
	◦ 400 Bad Request
	◦ 404 Not Found
	◦ 500 Internal Server Error
---
3. Workspace APIs
3.1 Create workspace
POST /workspaces
Request:
{
  "workspace_name": "HK Projects Knowledge Base",
  "workspace_description": "All project docs, contracts, and technical references."
}
Response 201:
{
  "workspace_id": "uuid",
  "workspace_name": "HK Projects Knowledge Base",
  "workspace_description": "All project docs, contracts, and technical references.",
  "created_at": "2026-01-13T05:00:00Z",
  "updated_at": "2026-01-13T05:00:00Z"
}
3.2 List workspaces
GET /workspaces
Response 200:
[
  {
    "workspace_id": "uuid",
    "workspace_name": "HK Projects Knowledge Base",
    "workspace_description": "All project docs, contracts, and technical references.",
    "created_at": "2026-01-13T05:00:00Z",
    "updated_at": "2026-01-13T05:00:00Z"
  }
]
3.3 Get workspace by id
GET /workspaces/{workspace_id}
Response 200:
{
  "workspace_id": "uuid",
  "workspace_name": "HK Projects Knowledge Base",
  "workspace_description": "All project docs, contracts, and technical references.",
  "created_at": "2026-01-13T05:00:00Z",
  "updated_at": "2026-01-13T05:00:00Z"
}
4. Content & Chunk APIs
4.1 Create content (register uploaded file)
File upload mechanism (S3, GCS, etc.) is out of scope.
This API registers a file that has been uploaded elsewhere.
POST /workspaces/{workspace_id}/contents
Request:
{
  "content_name": "BD Submission Package - Tower A",
  "content_description": "Full BD submission set for Tower A.",
  "filename": "tower-a-bd-submission.pdf",
  "file_path": "s3://bucket/path/tower-a-bd-submission.pdf"
}
Behavior:
• Creates a content record with:
	◦ status = "uploaded"
• Triggers ingestion pipeline (out of band).
Response 201:
{
  "content_id": "uuid",
  "workspace_id": "uuid",
  "content_name": "BD Submission Package - Tower A",
  "content_description": "Full BD submission set for Tower A.",
  "filename": "tower-a-bd-submission.pdf",
  "file_path": "s3://bucket/path/tower-a-bd-submission.pdf",
  "status": "uploaded",
  "created_at": "2026-01-13T05:00:00Z",
  "updated_at": "2026-01-13T05:00:00Z"
}
4.2 List contents in a workspace
GET /workspaces/{workspace_id}/contents
Response 200:
[
  {
    "content_id": "uuid",
    "workspace_id": "uuid",
    "content_name": "BD Submission Package - Tower A",
    "content_description": "Full BD submission set for Tower A.",
    "filename": "tower-a-bd-submission.pdf",
    "file_path": "s3://bucket/path/tower-a-bd-submission.pdf",
    "status": "processed",
    "created_at": "2026-01-13T05:00:00Z",
    "updated_at": "2026-01-13T05:10:00Z"
  }
]
4.3 Get content by id
GET /contents/{content_id}
Response 200:
{
  "content_id": "uuid",
  "workspace_id": "uuid",
  "content_name": "BD Submission Package - Tower A",
  "content_description": "Full BD submission set for Tower A.",
  "filename": "tower-a-bd-submission.pdf",
  "file_path": "s3://bucket/path/tower-a-bd-submission.pdf",
  "status": "processed",
  "created_at": "2026-01-13T05:00:00Z",
  "updated_at": "2026-01-13T05:10:00Z"
}
4.4 List chunks for a content
GET /contents/{content_id}/chunks
Response 200:
[
  {
    "chunk_id": "uuid",
    "content_id": "uuid",
    "chunk_index": 0,
    "chunk_description": "Overview of BD submission scope and key drawings.",
    "tags": ["BD", "submission", "general", "scope"],
    "text": "Full text of the first chunk...",
    "created_at": "2026-01-13T05:05:00Z"
  }
]
tags may also be an object if you prefer:

"tags": { "department": "BD", "document_type": "submission" }
5. Instruction APIs
5.1 Upsert workspace instruction
One instruction set per workspace in Phase 1 (can be versioned later).
PUT /workspaces/{workspace_id}/instruction
Request:
{
  "raw_instruction": "You are an assistant helping with Hong Kong construction compliance. Always reference relevant ordinances when answering.",
  "structured_instruction": {
    "tone": "professional",
    "jurisdiction": "Hong Kong",
    "must_reference": ["Buildings Ordinance (Cap. 123)", "Fire Services Ordinance (Cap. 95)"]
  }
}
Response 200:
{
  "instruction_id": "uuid",
  "workspace_id": "uuid",
  "raw_instruction": "You are an assistant helping with Hong Kong construction compliance. Always reference relevant ordinances when answering.",
  "structured_instruction": {
    "tone": "professional",
    "jurisdiction": "Hong Kong",
    "must_reference": ["Buildings Ordinance (Cap. 123)", "Fire Services Ordinance (Cap. 95)"]
  },
  "created_at": "2026-01-13T05:02:00Z",
  "updated_at": "2026-01-13T05:15:00Z"
}
5.2 Get workspace instruction
GET /workspaces/{workspace_id}/instruction
Response 200:
{
  "instruction_id": "uuid",
  "workspace_id": "uuid",
  "raw_instruction": "You are an assistant helping with Hong Kong construction compliance. Always reference relevant ordinances when answering.",
  "structured_instruction": {
    "tone": "professional",
    "jurisdiction": "Hong Kong",
    "must_reference": ["Buildings Ordinance (Cap. 123)", "Fire Services Ordinance (Cap. 95)"]
  },
  "created_at": "2026-01-13T05:02:00Z",
  "updated_at": "2026-01-13T05:15:00Z"
}
6. Assistant APIs
6.1 Create assistant from workspace
POST /workspaces/{workspace_id}/assistants
Request:
{
  "assistant_name": "Construction Compliance Assistant",
  "assistant_description": "Helps validate building designs against HK ordinances and departmental requirements."
}
Behavior:
• Links assistant to workspace.
• Uses workspace content + instruction at runtime.
Response 201:
{
  "assistant_id": "uuid",
  "workspace_id": "uuid",
  "assistant_name": "Construction Compliance Assistant",
  "assistant_description": "Helps validate building designs against HK ordinances and departmental requirements.",
  "created_at": "2026-01-13T05:20:00Z",
  "updated_at": "2026-01-13T05:20:00Z"
}
6.2 List assistants in a workspace
GET /workspaces/{workspace_id}/assistants
Response 200:
[
  {
    "assistant_id": "uuid",
    "workspace_id": "uuid",
    "assistant_name": "Construction Compliance Assistant",
    "assistant_description": "Helps validate building designs against HK ordinances and departmental requirements.",
    "created_at": "2026-01-13T05:20:00Z",
    "updated_at": "2026-01-13T05:20:00Z"
  }
]
6.3 Get assistant by id
GET /assistants/{assistant_id}
Response 200:
{
  "assistant_id": "uuid",
  "workspace_id": "uuid",
  "assistant_name": "Construction Compliance Assistant",
  "assistant_description": "Helps validate building designs against HK ordinances and departmental requirements.",
  "created_at": "2026-01-13T05:20:00Z",
  "updated_at": "2026-01-13T05:20:00Z"
}
7. Chat APIs
7.1 Create chat session
POST /assistants/{assistant_id}/sessions
Request:
{}
(Phase 1: no extra metadata; can extend later.)
Response 201:
{
  "chat_session_id": "uuid",
  "assistant_id": "uuid",
  "created_at": "2026-01-13T05:25:00Z"
}
7.2 Send message in a session
POST /sessions/{chat_session_id}/messages
Request:
{
  "role": "user",
  "content": "Can this proposed staircase design satisfy both BD and FSD requirements for means of escape?"
}
Behavior (server-side):
1. Store user message.
2. Run retrieval over workspace chunks.
3. Call LLM with:
	◦ instructions
	◦ retrieved chunks
	◦ chat history
4. Store assistant reply as another message.
5. Return assistant reply.
Response 200:
{
  "chat_message_id": "uuid-assistant",
  "chat_session_id": "uuid-session",
  "role": "assistant",
  "content": "Based on your description, the staircase must comply with both the Buildings Ordinance (Cap. 123) and the Fire Services Ordinance (Cap. 95)...",
  "created_at": "2026-01-13T05:25:10Z",
  "retrieval_context": {
    "chunks": [
      {
        "chunk_id": "uuid",
        "content_id": "uuid",
        "chunk_index": 12,
        "chunk_description": "FSD requirements for means of escape in high-rise buildings.",
        "tags": ["FSD", "means_of_escape", "fire_safety"],
        "similarity_score": 0.87
      }
    ]
  }
}
retrieval_context is included so the UI can show “why” the assistant answered that way.
7.3 List messages in a session
GET /sessions/{chat_session_id}/messages
Response 200:
[
  {
    "chat_message_id": "uuid-user",
    "chat_session_id": "uuid-session",
    "role": "user",
    "content": "Can this proposed staircase design satisfy both BD and FSD requirements for means of escape?",
    "created_at": "2026-01-13T05:25:00Z"
  },
  {
    "chat_message_id": "uuid-assistant",
    "chat_session_id": "uuid-session",
    "role": "assistant",
    "content": "Based on your description, the staircase must comply with both the Buildings Ordinance (Cap. 123) and the Fire Services Ordinance (Cap. 95)...",
    "created_at": "2026-01-13T05:25:10Z"
  }
]
8. Retrieval API (Test Bench / Direct Query)
This is for testing the workspace knowledge without going through chat.
8.1 Query workspace knowledge
POST /workspaces/{workspace_id}/retrieve
Request:
{
  "query": "What are the BD and FSD requirements for means of escape in commercial buildings?",
  "top_k": 5
}
Response 200:
{
  "query": "What are the BD and FSD requirements for means of escape in commercial buildings?",
  "results": [
    {
      "chunk_id": "uuid",
      "content_id": "uuid",
      "content_name": "Fire Safety Design Report - Tower A",
      "chunk_index": 7,
      "chunk_description": "Summary of BD and FSD requirements for means of escape in commercial towers.",
      "tags": ["BD", "FSD", "means_of_escape", "commercial"],
      "text": "The means of escape provisions shall comply with the Buildings Ordinance (Cap. 123) and Fire Services Ordinance (Cap. 95)...",
      "similarity_score": 0.91
    }
  ]
}
9. Error Format
All errors follow a consistent structure.
Example 400:
{
  "error_code": "INVALID_REQUEST",
  "message": "content_name is required.",
  "details": {
    "field": "content_name"
  }
}
Example 404:
{
  "error_code": "NOT_FOUND",
  "message": "Workspace not found."
}
Example 500:
{
  "error_code": "INTERNAL_ERROR",
  "message": "An unexpected error occurred."
}
