# gErCK
# gErCK AI Platform — MVP (Chat Capability)

gErCK is a modular, capability‑driven AI platform designed for enterprise‑grade extensibility, clarity, and long‑term maintainability. This MVP delivers the first complete vertical slice: Ask for Knowledge (Chat) — a multi‑turn conversational capability powered by a clean backend architecture and a modular Next.js frontend.

This document describes:
- Architecture
- Folder structure
- Setup instructions
- Running backend & frontend
- How the chat capability works
- Troubleshooting
- Roadmap (Agentic RAG, Prompt Library, CI/CD, Testing)

---

# 🏗 Architecture Overview

gErCK is built around capabilities, each isolated into its own module with clear boundaries.

## Backend Architecture (FastAPI)

backend/
  main.py
  capabilities/
    chat/
      chat_service.py
    knowledge/
      knowledge_service.py
  functions/
    embedding/
      embedding_service.py
    prompt_engine/
      prompt_engine_service.py
    llm_gateway/
      llm_gateway_service.py

## Frontend Architecture (Next.js)

frontend/
  app/
    page.tsx
  components/
    AskForm.tsx
    AnswerPanel.tsx
  lib/
    api.ts

## Flow: Multi‑Turn Chat

1. User enters a message  
2. Frontend sends full message history to backend  
3. Backend orchestrates:
   - PromptEngine → builds prompt  
   - LLMGateway → calls model  
4. Backend returns answer  
5. Frontend updates chat history and UI  

---

# ⚙️ Setup Instructions

## 1. Clone the repository

git clone https://github.com/<your-org>/gErCK.git
cd gErCK

---

## 2. Backend Setup (FastAPI)

### Create a virtual environment

python3 -m venv venv
source venv/bin/activate

### Install dependencies

pip install -r requirements.txt

### Run the backend

python -m uvicorn backend.main:app --reload

Backend runs at:

http://localhost:8000

### Health check

http://localhost:8000/health

Expected:

{"status":"ok"}

---

## 3. Frontend Setup (Next.js)

cd frontend
npm install
npm run dev

Frontend runs at:

http://localhost:3000

---

# 💬 Chat Capability (MVP)

## Features

- Multi‑turn conversation  
- Full message history sent to backend  
- Clean chat UI with bubbles  
- Scrollable chat window  
- Auto‑scroll to bottom  
- Modular backend orchestration  

## How it works

1. AskForm collects user input  
2. page.tsx stores message history  
3. api.ts sends { messages: [...] } to backend  
4. Backend:
   - builds prompt  
   - calls LLM  
   - returns answer  
5. UI updates with new messages  

---

# 🧪 Testing (To Be Added)

Planned test structure:

backend/tests/
  test_chat_service.py
  test_prompt_engine.py
  test_llm_gateway.py

Test stack:
- pytest  
- pytest‑asyncio  
- coverage  

---

# 🔄 CI/CD (To Be Added)

Planned GitHub Actions workflow:
- Install dependencies  
- Run linting  
- Run tests  
- Run security scan (Bandit)  
- Build frontend  
- Optional: deploy to Vercel / Azure  

---

# 🔐 Security (To Be Added)

- Dependency scanning  
- Secret scanning  
- Environment variable validation  
- API key isolation  
- Rate limiting  

---

# 🧭 Roadmap

## 1. Agentic RAG (Next Major Capability)

- Document ingestion  
- Chunking  
- Auto‑tagging  
- User tagging  
- Vector storage  
- Metadata‑aware retrieval  
- Prompt library integration  
- Agentic retrieval planning  

## 2. Prompt Library

- Create / edit / save prompts  
- Tag prompts  
- Combine prompts with documents  
- Use prompts in chat  

## 3. Knowledge Capability

- Ingestion API  
- Retrieval API  
- Document library UI  

## 4. CI/CD + Testing

- Full automated pipeline  
- Unit tests for all capabilities  
- Security scanning  

---

# 🆘 Troubleshooting

## Backend: ModuleNotFoundError: No module named 'backend'

Run backend correctly:

python -m uvicorn backend.main:app --reload

## Port already in use

lsof -i :8000
kill -9 <PID>

## Frontend cannot connect to backend

Check CORS settings in backend/main.py.

---

# 🎉 MVP Complete

You now have:
- a clean, modular backend  
- a working multi‑turn chat capability  
- a modern frontend  
- a stable foundation for Agentic RAG  

This README reflects the current state of the platform and prepares the ground for the next major capability.