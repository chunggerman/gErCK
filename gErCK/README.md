On Your Left — gErCK
---
Your Always‑On AI Teammate
---
gErCK is a modular, multi‑layer AI platform designed to work beside you — supporting your tasks, understanding your intent, and adapting to your style.
---
It is built on a clean 6+2 architecture that separates capabilities, functions, models, storage, and integrations, with intelligence and foundations running across all layers.
---
Mission
---
The mission of On Your Left — gErCK is simple:
---
AI will be your trusted teammate, and eventually become the personal keeper of your stuff — a general‑enough, rather‑chill keeper who stays by your side.
---
Architecture Overview
The platform is built on 6 horizontal layers and 2 vertical layers:
6 Horizontal Layers
1. Frontend Interface & Input Channels
2. AI Capability Layer
3. AI Function Layer
4. LLM Layer
5. Storage Layer
6. Integration Layer
2 Vertical Layers
• AI Intelligence Modules
• Platform Foundations
Full architecture details:
[Looks like the result wasn't safe to show. Let's switch things up and try something else!]
---
AI Runtime Features (Step 5)
---
gErCK now includes a fully configurable AI runtime system that enables intelligent conversation management, advanced retrieval, and adaptive AI behavior.

### Conversation Intelligence
- **Automatic Summarization**: Conversations are intelligently summarized when they exceed configurable message thresholds, maintaining context while managing memory efficiently
- **Memory Management**: Adaptive context windows with summary integration for long-running conversations
- **Summary Snapshots**: Historical conversation summaries stored for analysis and continuity

### Hybrid Retrieval Engine
- **Vector Search**: Semantic similarity search using embeddings for contextual relevance
- **Keyword Search**: Traditional text-based content matching for precision
- **Weighted Ranking**: Configurable combination of vector and keyword results based on use case
- **Multi-strategy Retrieval**: Intelligent fusion of multiple retrieval approaches

### Configurable AI Runtime
- **Workspace Defaults**: Set AI configuration at the workspace level for consistent behavior
- **Conversation Overrides**: Customize settings per conversation for specialized interactions
- **Request-level Control**: Override settings for individual requests for maximum flexibility
- **Deep Configuration**: Control model selection, retrieval weights, chunking parameters, and summarization rules

### Advanced Prompt Engineering
- **Structured Prompts**: Multi-section prompts combining system instructions, conversation summaries, retrieved context, and user messages
- **Context Integration**: Seamless integration of retrieved knowledge chunks, conversation history, and summaries
- **Template Support**: Configurable instruction templates for consistent AI behavior

**Explore Step 5 docs:** `/doc/step-5/`
---
Phase 0 — Platform Foundation
Phase 0 establishes the core platform structure:
• backend skeleton
• capability orchestrator
• function layer
• LLM gateway
• storage abstraction
• minimal frontend
• CI/CD
• documentation
Phase 0 is the foundation.
Future phases will continue expanding capabilities, functions, and intelligence.
Explore Phase 0 docs:
/docs/phase0/

Phase 1 — Product Layer Overview
Phase 1 introduces the first complete product layer on top of the core gErCK architecture.
It enables users to upload documents, build knowledge bases, define instructions, test configurations, and create reusable chatbots — all through a structured, end‑to‑end workflow.
This section outlines Phase 1 using six documentation dimensions:
Objective, Goals, Deliverables, Implementation Items, Test Scenarios, and Test Case Validation.
---
1. Objective
Phase 1 aims to transform gErCK from a backend framework into a functional product environment.
The objective is to provide users with the ability to:
• Upload and organize documents into knowledge bases
• Process documents into searchable knowledge
• Write natural‑language instructions and convert them into structured prompts
• Test knowledge + prompt combinations in a controlled playground
• Create reusable chatbots based on these configurations
• Extract structured key‑value data from invoices and similar documents
• Interact with chatbots through a modern chat interface
Phase 1 establishes the foundation for all future capabilities.
---
2. Goals
Phase 1 must deliver:
• A complete knowledge base system
• A pre‑prompt system for instruction engineering
• A playground for testing configurations
• A chatbot creation and management system
• A structured document extraction workflow
• A chat interface with conversation history
• Backend support for OCR, chunking, embedding, retrieval, and structured extraction
• Frontend support for all user workflows
Success is defined by a user being able to complete the full flow:
Upload → Knowledge Base → Pre‑Prompt → Playground → Chatbot → Chat Interface
---
3. Deliverables
Frontend Deliverables
• Knowledge Base Management Page
• Pre‑Prompt Management Page
• Playground Page
• Chatbot Management Page
• Chat Interface Page
• Structured Extraction Page (batch upload + table view + export)
Backend Deliverables
• Models: KB, Document, Pre‑Prompt, Chatbot, Chat Session, Structured Record
• Functions: OCR, chunking, tagging, embedding, retrieval, synthesis, key‑value extraction
• Orchestrators: document, chat, structured extraction
• Storage: raw files, extracted text, embeddings, KB index, structured JSON
• API endpoints for all workflows
System Deliverables
• End‑to‑end document ingestion pipeline
• Retrieval‑augmented chat pipeline
• Structured extraction pipeline
• Regression‑ready test suite
---
4. Implementation Items
Backend
• Implement OCR pipeline
• Implement chunking + tagging
• Implement embedding + vector store
• Implement retrieval logic
• Implement answer synthesis
• Implement structured extraction (key‑value)
• Implement CRUD for KB, Pre‑Prompt, Chatbot, Chat Session
• Implement orchestrators
• Implement storage layers
• Implement API endpoints
Frontend
• Build KB management UI
• Build document upload + preview
• Build Pre‑Prompt editor + translation UI
• Build Playground chat interface
• Build Chatbot management UI
• Build Chat interface with history
• Build Structured Extraction UI (batch upload + table view + export)
• Integrate all flows with backend
Infrastructure
• Authentication
• File storage
• Vector storage
• JSON storage
• Logging and error handling
---
5. Test Scenarios
Knowledge Base
• Create, rename, delete KB
• Upload documents
• Process documents
• Retrieve content
Pre‑Prompt
• Create, edit, delete
• Translate instructions
• Link to KB
Playground
• Select KB
• Select Pre‑Prompt
• Chat with retrieval
• Display citations
Chatbot
• Create, edit, delete
• Load chatbot in chat interface
Structured Extraction
• Batch upload invoices
• Extract key‑value pairs
• Display table
• Export JSON/CSV
• Save as KB
• Query structured KB in Playground
Chat Interface
• Start new chat
• Load chat history
• Switch chatbots
• Handle long conversations
---
6. Test Case Validation (Including Regression)
Functional Validation
• OCR accuracy
• Chunking boundaries
• Retrieval relevance
• Prompt translation correctness
• Structured extraction accuracy
• End‑to‑end flow validation
Regression Validation
Triggered on backend or frontend changes:
• KB CRUD regression
• Pre‑Prompt CRUD regression
• Chatbot CRUD regression
• Chat session regression
• Retrieval regression
• Structured extraction regression
• API contract regression
• UI workflow regression
• Authentication regression
Acceptance Criteria
Phase 1 is complete when:
• All functional tests pass
• All regression tests pass
• All user flows work end‑to‑end
• No critical issues remain
