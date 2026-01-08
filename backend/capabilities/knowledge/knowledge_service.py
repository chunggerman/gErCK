import yaml
from pathlib import Path

from backend.functions.embedding.embedding_service import EmbeddingFunction
from backend.functions.web_search.web_search_service import WebSearchFunction
from backend.functions.prompt_engine.prompt_engine_service import PromptEngineFunction

class KnowledgeService:
    def __init__(self):
        # Load capability config
        config_path = Path("config/capabilities/knowledge.yaml")
        with open(config_path, "r") as f:
            self.config = yaml.safe_load(f)

        # Initialize functions (they will be placeholders for now)
        self.embedding_fn = EmbeddingFunction()
        self.web_search_fn = WebSearchFunction()
        self.prompt_engine_fn = PromptEngineFunction()

    def handle(self, question: str) -> str:
        if not question:
            return "Please provide a question."

        # Step 1: Embedding (placeholder)
        embedding = self.embedding_fn.run(question)

        # Step 2: Web search (placeholder)
        search_results = self.web_search_fn.run(question)

        # Step 3: Prompt assembly (placeholder)
        prompt = self.prompt_engine_fn.build_prompt(question, search_results)

        # Step 4: LLM call (placeholder)
        answer = self.llm_gateway.run(prompt, capability="knowledge")

        return answer