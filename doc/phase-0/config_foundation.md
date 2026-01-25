# Phase 0 — Config Foundation
On Your Left — gErCK

The `/config` folder defines how capabilities, functions, and LLMs are described, loaded, and extended.
It is part of the Platform Foundations vertical layer.

## Goals
- Provide a clean, declarative way to define capabilities and functions
- Keep configuration separate from code
- Allow future phases to add new capabilities without modifying backend logic
- Support modularity and composability

## Folder Structure
config/
├── capabilities/
│   └── knowledge.yaml
├── functions/
│   ├── embedding.yaml
│   ├── prompt_engine.yaml
│   └── web_search.yaml
├── llm/
│   ├── limits.yaml
│   ├── models.yaml
│   └── routing.yaml
---

## Components

### 🟨 Capabilities (`/config/capabilities/`)
Each YAML file defines a high-level skill exposed to users.

Example: `knowledge.yaml`
- capability name
- description
- required functions
- input/output schema
- orchestration hints

### 🟨 Functions (`/config/functions/`)
Each YAML file defines an atomic AI tool used by capabilities.

Examples:
- `embedding.yaml`
- `prompt_engine.yaml`
- `web_search.yaml`

Each function config includes:
- function name
- purpose
- parameters
- model requirements
- safety constraints

### 🟨 LLM (`/config/llm/`)
Defines how models are selected, routed, and constrained.

Files:
- `models.yaml` — available models
- `routing.yaml` — routing rules
- `limits.yaml` — token limits, temperature, etc.

---

## Phase 0 Deliverables
- Folder structure
- One capability config (`knowledge.yaml`)
- Three function configs
- Three LLM configs
