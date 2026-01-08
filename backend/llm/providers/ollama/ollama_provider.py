import subprocess
import json

class OllamaProvider:
    def __init__(self, model_name="llama3"):
        self.model_name = model_name

    def generate(self, prompt: str) -> str:
        """
        Calls the local Ollama model using the `ollama run` command.
        This assumes Ollama is installed and running locally.
        """
        try:
            result = subprocess.run(
                ["ollama", "run", self.model_name],
                input=prompt.encode("utf-8"),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=True
            )

            output = result.stdout.decode("utf-8").strip()
            return output

        except Exception as e:
            return f"[Ollama error: {str(e)}]"