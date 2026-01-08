import yaml
from pathlib import Path

from backend.functions.embedding.embedding_service import EmbeddingFunction
from backend.functions.web_search.web_search_service import WebSearchFunction
from backend.functions.prompt_engine.prompt_engine_service import PromptEngineFunction
from backend.llm.gateway.llm_gateway import LLMGateway

class KnowledgeService:
    def __init__(self):
        config_path = Path("config/capabilities/knowledge.yaml")
        with open(config_path, "r") as f:
            self.config = yaml.safe_load(f)

        self.embedding_fn = EmbeddingFunction()
        self.web_search_fn = WebSearchFunction()
        self.prompt_engine_fn = PromptEngineFunction()

        self.llm_gateway = LLMGateway()

    def handle(self, question: str) -> str:
        if not question:
            return "Please provide a question."

        embedding = self.embedding_fn.run(question)
        search_results = self.web_search_fn.run(question)
        prompt = self.prompt_engine_fn.build_prompt(question, search_results)

        answer = self.llm_gateway.run(prompt, capability="knowledge")
        return answer

    def handle_chat(self, messages):
        conversation = ""
        for msg in messages:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            conversation += f"{role}: {content}\n"

        prompt = conversation + "assistant:"
        return self.llm_gateway.run(prompt, capability="knowledge")