class PromptEngineFunction:
    def __init__(self):
        pass  # config will be added later

    def build_prompt(self, question: str, search_results: list):
        """
        Placeholder prompt builder.
        Later this will assemble a real prompt for the LLM.
        """
        return f"Question: {question}\nSearch Results: {search_results}"