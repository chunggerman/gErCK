import yaml
from pathlib import Path

from backend.llm.providers.ollama.ollama_provider import OllamaProvider
# Future: from backend.llm.providers.gpt.gpt_provider import GPTProvider


class LLMGateway:
    def __init__(self):
        # Load configs
        self.models = self._load_yaml("config/llm/models.yaml")["models"]
        self.routing = self._load_yaml("config/llm/routing.yaml")
        self.limits = self._load_yaml("config/llm/limits.yaml")

        # Determine default model
        default_model_key = self.routing.get("default_model")
        self.default_model = self.models[default_model_key]

        # Initialize providers
        self.providers = {
            "ollama": OllamaProvider,
            # "openai": GPTProvider,  # future
        }

    def _load_yaml(self, path: str):
        with open(Path(path), "r") as f:
            return yaml.safe_load(f)

    def run(self, prompt: str, capability: str = None) -> str:
        # Determine model based on routing rules
        model_key = self._select_model(capability)
        model_cfg = self.models[model_key]

        provider_name = model_cfg["provider"]
        model_name = model_cfg["model_name"]

        provider_class = self.providers[provider_name]
        provider = provider_class(model_name=model_name)

        return provider.generate(prompt)

    def _select_model(self, capability: str):
        # Capability override
        overrides = self.routing.get("capability_overrides", {})
        if capability and capability in overrides:
            return overrides[capability]["model"]

        # Default
        return self.routing["default_model"]