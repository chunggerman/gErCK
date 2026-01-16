1. Scope recap
Phase 1 delivers:
• Single‑user environment (no auth, no teams)
• Workspace → Content → Instruction → Test Bench → Assistant → Chat
• Basic debug (retrieved chunks + citations), no orchestration, no multi‑assistant flows
---
2. Backend implementation
2.1 Core models
• workspace
	◦ id, name, description, created_at, updated_at
• content
	◦ id, workspace_id, filename, file_path, status, created_at, updated_at
• instruction
	◦ id, workspace_id, raw_instruction, structured_instruction, created_at, updated_at
• assistant_profile
	◦ id, workspace_id, name, description, created_at, updated_at
• chat_session
	◦ id, assistant_profile_id, created_at
• chat_message
	◦ id, session_id, role, content, created_at
Vector store + extracted text live in separate storage (DB or external).
2.2 Services
• WorkspaceService
	◦ create/get/update workspace
• ContentService
	◦ upload file, store metadata, trigger processing
• InstructionService
	◦ save/update instruction, call LLM to structure/translate
• TestBenchService
	◦ given workspace + question → retrieve + synthesize + citations
• AssistantProfileService
	◦ create assistant from workspace, list/get assistants
• ChatService
	◦ create session, append messages, run assistant chat via same pipeline as Test Bench
2.3 Pipelines
• Content pipeline
	1. Upload file
	2. OCR (if needed)
	3. Chunk + tag
	4. Embed
	5. Store text + embeddings + metadata
• Answer pipeline (Test Bench + Assistant)
	1. Load workspace instruction
	2. Retrieve relevant chunks
	3. Call LLM with instruction + question + context
	4. Return answer + citations + retrieved chunks (for debug)
2.4 API endpoints
• Workspace
	◦ POST /workspace
	◦ GET /workspace/:id
• Content
	◦ POST /workspace/:id/content (multipart)
	◦ GET /workspace/:id/content
• Instruction
	◦ POST /workspace/:id/instruction
	◦ GET /workspace/:id/instruction
	◦ POST /instruction/translate
• Test Bench
	◦ POST /workspace/:id/testbench/chat
• Assistant
	◦ POST /assistant-profile
	◦ GET /assistant-profile
	◦ GET /assistant-profile/:id
• Assistant chat
	◦ POST /assistant-profile/:id/chat
	◦ GET /assistant-profile/:id/sessions
	◦ GET /assistant-profile/:id/sessions/:sessionId
---
3. Frontend implementation
3.1 Pages
• DashboardPage
	◦ Empty state: “Create Workspace”
	◦ Populated:
		▪︎ Workspaces list (open workspace)
		▪︎ Assistants list (open assistant)
• WorkspacePage (3‑panel layout)
	◦ ContentPanel
		▪︎ Upload button (drag‑and‑drop)
		▪︎ File list + status
		▪︎ Optional preview
	◦ InstructionPanel
		▪︎ Text editor
		▪︎ Save button
		▪︎ “Translate Instruction” → shows structured view
	◦ TestBenchPanel
		▪︎ Chat area
		▪︎ Answer with citations
		▪︎ Debug toggle → show retrieved chunks
• AssistantPage
	◦ Left: assistant info (name, description, workspace link)
	◦ Center: chat area (messages + citations)
	◦ Right: history (sessions list, “New conversation”)
3.2 Frontend API wrappers
• workspaceApi → /workspace
• contentApi → /workspace/:id/content
• instructionApi → /workspace/:id/instruction, /instruction/translate
• testBenchApi → /workspace/:id/testbench/chat
• assistantApi → /assistant-profile
• chatApi → /assistant-profile/:id/chat, sessions
---
4. Build sequence
Step 1 — Skeleton
• Backend:
	◦ Workspace model + basic API
• Frontend:
	◦ Dashboard + “Create Workspace” + empty WorkspacePage shell
Step 2 — Content ingestion
• Backend:
	◦ Content model
	◦ Upload endpoint
	◦ Stub processing pipeline (log only)
• Frontend:
	◦ ContentPanel with upload + list
Then plug in OCR → chunk → embed.
Step 3 — Instruction
• Backend:
	◦ Instruction model + save/get
	◦ /instruction/translate calling LLM
• Frontend:
	◦ InstructionPanel editor + save
	◦ Translate button + structured view
Step 4 — Test Bench
• Backend:
	◦ Retrieval + synthesis pipeline
	◦ /workspace/:id/testbench/chat
• Frontend:
	◦ TestBenchPanel chat UI
	◦ Show answer + citations
	◦ Debug toggle → show retrieved chunks
Step 5 — Assistant
• Backend:
	◦ AssistantProfile model + create/list/get
• Frontend:
	◦ “Create Assistant” button in WorkspacePage
	◦ Assistants list on Dashboard
Step 6 — Assistant chat + history
• Backend:
	◦ ChatSession + ChatMessage models
	◦ /assistant-profile/:id/chat + session endpoints
• Frontend:
	◦ AssistantPage with:
		▪︎ info panel
		▪︎ chat area
		▪︎ history panel
Step 7 — Polish & regression
• Error handling (upload, LLM failures, retrieval issues)
• Loading states
• Minimal tests:
	◦ content pipeline
	◦ test bench
	◦ assistant chat
