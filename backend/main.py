from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.capabilities.knowledge.knowledge_service import KnowledgeService

# 1. Create the FastAPI app
app = FastAPI(title="gErCK AI Platform - Vertical Slice")

# 2. Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Initialize capability service
knowledge_service = KnowledgeService()

# 4. Define routes
@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/ask")
def ask_question(payload: dict):
    messages = payload.get("messages", [])
    answer = knowledge_service.handle_chat(messages)
    return {"messages": messages, "answer": answer}