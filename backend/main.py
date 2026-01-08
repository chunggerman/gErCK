from fastapi import FastAPI
from backend.capabilities.knowledge.knowledge_service import KnowledgeService

app = FastAPI(title="gErCK AI Platform - Vertical Slice")

# Initialize capability service
knowledge_service = KnowledgeService()

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/ask")
def ask_question(payload: dict):
    question = payload.get("question", "")
    answer = knowledge_service.handle(question)
    return {"question": question, "answer": answer}