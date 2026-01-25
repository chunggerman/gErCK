# Phase 0 — Architecture
On Your Left — gErCK

## The 6+2 Layer Model

gErCK is architected using 6 horizontal layers and 2 vertical layers.
Phase 0 establishes the skeleton for all 8 layers.

---

### 🟨 Layer 1 — Frontend Interface & Input Channels
**Purpose:** Entry point for users and systems.
**Repo Path:** `/frontend/`

Responsibilities:
- UI rendering
- Input normalization
- File upload handling
- Channel adapters (future)

Phase 0:
- Minimal Next.js frontend
- Basic input pipeline

---

### 🟨 Layer 2 — AI Capability Layer
**Purpose:** High-level skills exposed to users.
**Repo Path:** `/backend/capabilities/`

Responsibilities:
- Capability APIs
- Orchestration
- Guardrails

Phase 0:
- Capability orchestrator
- Capability template

---

### 🟨 Layer 3 — AI Function Layer
**Purpose:** Atomic AI tools used by capabilities.
**Repo Path:** `/backend/functions/`

Responsibilities:
- OCR (placeholder)
- Embedding (placeholder)
- Prompt engine
- Web search

Phase 0:
- Function folder
- Basic LLM call

---

### 🟨 Layer 4 — LLM Layer
**Purpose:** Unified interface to all models.
**Repo Path:** `/backend/llm/`

Responsibilities:
- Model routing
- Prompt formatting
- Safety filters

Phase 0:
- LLM gateway
- Provider abstraction

---

### 🟨 Layer 5 — Storage Layer
**Purpose:** Internal data stores.
**Repo Path:** `/backend/storage/`

Responsibilities:
- File storage
- Embedding storage
- Session data

Phase 0:
- Storage abstraction
- Configurable paths

---

### 🟨 Layer 6 — Integration Layer
**Purpose:** Connects to external systems.
**Repo Path:** `/backend/integrations/` *(future)*

Responsibilities:
- Connectors
- Data ingestion
- Event streaming

Phase 0:
- Integration folder placeholder

---

### 🟦 Vertical Layer — AI Intelligence Modules
**Purpose:** Cross-cutting intelligence.
**Repo Path:** `/backend/orchestration/`

Responsibilities:
- Task routing
- Multi-step workflows
- Guardrails
- Memory (future)

Phase 0:
- Orchestrator logic
- Basic reasoning flow

---

### 🟩 Vertical Layer — Platform Foundations
**Purpose:** Infrastructure, security, governance.
**Repo Paths:**
- `.github/workflows/`
- `/config/`
- `.bandit`, `.gitattributes`, `requirements.txt`

Responsibilities:
- CI/CD
- Logging
- Security
- Documentation

Phase 0:
- GitHub Actions
- Linting
- Tests
- Containerization
