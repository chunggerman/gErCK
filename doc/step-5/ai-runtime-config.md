# AI Runtime Configuration

The gErCK AI runtime supports configuration at three levels: **workspace defaults**, **conversation overrides**, and **request overrides**. Configuration is merged hierarchically with later levels taking precedence.

## Configuration Hierarchy

```
Request Config → Conversation Config → Workspace Config → System Defaults
```

## Complete Configuration Schema

```json
{
  "model": "llama3",
  "embedding_model": "nomic-embed-text",
  "top_k": 5,
  "instruction_template": null,
  "summarization": {
    "enabled": true,
    "frequency": 10,
    "style": "adaptive",
    "max_length": "medium"
  },
  "retrieval": {
    "vector_weight": 0.5,
    "keyword_weight": 0.2,
    "recency_weight": 0.2,
    "metadata_weight": 0.1,
    "filters": {}
  },
  "memory": {
    "window_size": 10,
    "use_summary": true
  },
  "chunking": {
    "size": 800,
    "overlap": 100
  }
}
```

## Configuration Fields

### Core Settings

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `model` | string | null | LLM model to use (e.g., "llama3", "gpt-4") |
| `embedding_model` | string | null | Embedding model for vector search |
| `top_k` | number | 5 | Number of chunks to retrieve |
| `instruction_template` | string | null | Custom instruction template |

### Summarization Settings

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `summarization.enabled` | boolean | true | Enable automatic summarization |
| `summarization.frequency` | number | 10 | Messages before summarization triggers |
| `summarization.style` | string | "adaptive" | Summary style ("concise", "detailed") |
| `summarization.max_length` | string | "medium" | Summary length ("short", "medium", "long") |

### Retrieval Settings

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `retrieval.vector_weight` | number | 0.5 | Weight for vector similarity (0-1) |
| `retrieval.keyword_weight` | number | 0.2 | Weight for keyword matching (0-1) |
| `retrieval.recency_weight` | number | 0.2 | Weight for content recency (0-1) |
| `retrieval.metadata_weight` | number | 0.1 | Weight for metadata matching (0-1) |
| `retrieval.filters` | object | {} | Additional filtering criteria |

### Memory Settings

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `memory.window_size` | number | 10 | Recent messages to include in context |
| `memory.use_summary` | boolean | true | Include conversation summary in prompts |

### Chunking Settings

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `chunking.size` | number | 800 | Target chunk size in tokens |
| `chunking.overlap` | number | 100 | Token overlap between chunks |

## Configuration Examples

### Workspace-Level Configuration

Set default behavior for all conversations in a workspace:

```json
{
  "model": "llama3",
  "top_k": 5,
  "summarization": {
    "enabled": true,
    "frequency": 15
  },
  "retrieval": {
    "vector_weight": 0.7,
    "keyword_weight": 0.3
  }
}
```

### Conversation Override

Customize settings for a specific conversation:

```json
{
  "model": "gpt-4",
  "top_k": 3,
  "summarization": {
    "enabled": false
  }
}
```

### Request Override

Override settings for a single request:

```json
{
  "model": "claude-3",
  "retrieval": {
    "vector_weight": 1.0,
    "keyword_weight": 0.0
  }
}
```

## Configuration Validation

The system validates configuration at each level:

- **Type checking**: Ensures fields have correct data types
- **Range validation**: Validates numeric ranges (e.g., weights 0-1)
- **Fallback handling**: Uses defaults when invalid values are provided
- **Deep merging**: Properly merges nested objects

## Best Practices

1. **Start with workspace defaults** for consistent behavior
2. **Use conversation overrides** for specialized use cases
3. **Reserve request overrides** for one-off customizations
4. **Test configurations** in development before production use
5. **Monitor performance** and adjust retrieval weights based on results</content>
<parameter name="filePath">/Users/chunggerman/Documents/Documents - German’s MacBook Pro/GitHub/gErCK/doc/step-5/ai-runtime-config.md
