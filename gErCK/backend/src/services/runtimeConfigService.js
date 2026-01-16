import { deepMerge } from '../utils/deepMerge.js';

const SYSTEM_DEFAULT_CONFIG = {
  model: null,
  embedding_model: null,
  top_k: 5,
  instruction_template: null,
  summarization: {
    enabled: true,
    frequency: 10,
    style: "adaptive",
    max_length: "medium"
  },
  retrieval: {
    vector_weight: 0.5,
    keyword_weight: 0.2,
    recency_weight: 0.2,
    metadata_weight: 0.1,
    filters: {}
  },
  memory: {
    window_size: 10,
    use_summary: true
  },
  chunking: {
    size: 800,
    overlap: 100
  }
};

function resolveRuntimeConfig({ system = SYSTEM_DEFAULT_CONFIG, workspace, conversation, request }) {
  // Merge in order: system → workspace → conversation → request
  let config = deepMerge(system, workspace || {});
  config = deepMerge(config, conversation || {});
  config = deepMerge(config, request || {});
  return config;
}

export { SYSTEM_DEFAULT_CONFIG, resolveRuntimeConfig };
