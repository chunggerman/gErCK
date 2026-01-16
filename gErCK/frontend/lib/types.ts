// Shared types for backend responses and frontend components

export interface AskResponse {
  answer: string;
}

export interface AIConfig {
  model: string | null;
  embedding_model: string | null;
  top_k: number;
  instruction_template: string | null;
  summarization: {
    enabled: boolean;
    frequency: number;
    style: string;
    max_length: string;
  };
  retrieval: {
    vector_weight: number;
    keyword_weight: number;
    recency_weight: number;
    metadata_weight: number;
    filters: {
      tags?: string[];
      source_types?: string[];
    };
  };
  memory: {
    window_size: number;
    use_summary: boolean;
  };
  chunking: {
    size: number;
    overlap: number;
  };
}

export interface InstructionTemplate {
  id: string;
  name: string;
  description?: string;
  content: string;
  created_at: string;
  updated_at: string;
}
