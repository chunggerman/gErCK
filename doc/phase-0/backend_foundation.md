# Phase 0 — Backend Foundation
On Your Left — gErCK

The backend is built using FastAPI and follows the 6+2 architecture.

## Goals
- Clean module boundaries
- Capability orchestrator
- Function layer
- LLM gateway
- Storage abstraction
- Config loader
- Logging baseline

## Key Modules

### `/backend/main.py`
- FastAPI app
- Router registration
- Health check endpoint

### `/backend/capabilities/`
- Capability templates
- Orchestration logic
- API endpoints

### `/backend/functions/`
- Atomic AI functions
- Prompt engine
- Web search (placeholder)

### `/backend/llm/`
- Model routing
- Provider abstraction
- Safety filters

### `/backend/storage/`
- File storage
- Embedding storage (placeholder)
- Session data

### `/backend/orchestration/`
- Task router
- Multi-step workflows
- Guardrails

### `/config/`
- Environment loader
- Capability config
- Function config
- LLM config
