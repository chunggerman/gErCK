import { useState } from 'react';
import { AIConfig } from '../types';

export function useRequestLevelConfig() {
  const [config, setConfig] = useState<Partial<AIConfig>>({});

  const updateConfig = (updates: Partial<AIConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const resetConfig = () => {
    setConfig({});
  };

  const setModel = (model: string) => updateConfig({ model });
  const setEmbeddingModel = (embedding_model: string) => updateConfig({ embedding_model });
  const setTopK = (top_k: number) => updateConfig({ top_k });
  const setInstructionTemplate = (instruction_template: string) => updateConfig({ instruction_template });
  const setSummarizationEnabled = (enabled: boolean) => updateConfig({
    summarization: { ...config.summarization, enabled }
  });
  const setSummarizationFrequency = (frequency: number) => updateConfig({
    summarization: { ...config.summarization, frequency }
  });
  const setSummarizationStyle = (style: string) => updateConfig({
    summarization: { ...config.summarization, style }
  });
  const setSummarizationMaxLength = (max_length: string) => updateConfig({
    summarization: { ...config.summarization, max_length }
  });
  const setRetrievalVectorWeight = (vector_weight: number) => updateConfig({
    retrieval: { ...config.retrieval, vector_weight }
  });
  const setRetrievalKeywordWeight = (keyword_weight: number) => updateConfig({
    retrieval: { ...config.retrieval, keyword_weight }
  });
  const setRetrievalRecencyWeight = (recency_weight: number) => updateConfig({
    retrieval: { ...config.retrieval, recency_weight }
  });
  const setRetrievalMetadataWeight = (metadata_weight: number) => updateConfig({
    retrieval: { ...config.retrieval, metadata_weight }
  });
  const setMemoryWindowSize = (window_size: number) => updateConfig({
    memory: { ...config.memory, window_size }
  });
  const setMemoryUseSummary = (use_summary: boolean) => updateConfig({
    memory: { ...config.memory, use_summary }
  });
  const setChunkingSize = (size: number) => updateConfig({
    chunking: { ...config.chunking, size }
  });
  const setChunkingOverlap = (overlap: number) => updateConfig({
    chunking: { ...config.chunking, overlap }
  });

  return {
    config,
    updateConfig,
    resetConfig,
    setters: {
      setModel,
      setEmbeddingModel,
      setTopK,
      setInstructionTemplate,
      setSummarizationEnabled,
      setSummarizationFrequency,
      setSummarizationStyle,
      setSummarizationMaxLength,
      setRetrievalVectorWeight,
      setRetrievalKeywordWeight,
      setRetrievalRecencyWeight,
      setRetrievalMetadataWeight,
      setMemoryWindowSize,
      setMemoryUseSummary,
      setChunkingSize,
      setChunkingOverlap,
    }
  };
}
