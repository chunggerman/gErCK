class PromptEngineFunction:
    def __init__(self):
        # config will be added later
        pass

    def build_prompt(self, question: str, search_results: list):
        """
        Placeholder prompt builder.
        Later this will assemble a real prompt for the LLM.
        """
        return (
            f"Question: {question}\n"
            f"Search Results: {search_results}"
        )
    