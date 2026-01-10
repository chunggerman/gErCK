from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.capabilities.knowledge.knowledge_service import KnowledgeService


app = FastAPI(title="gErCK AI Platform - Vertical Slice")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


knowledge_service = KnowledgeService()


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/ask")
def ask_question(payload: dict):
    messages = payload.get("messages", [])
    answer = knowledge_service.handle_chat(messages)
    return {"messages": messages, "answer": answer}

