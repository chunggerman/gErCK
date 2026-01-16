# API Endpoints (Step 5 Updates)

Step 5 introduces new API capabilities and enhances existing endpoints with AI runtime configuration support.

## Enhanced Endpoints

### Send Message

**Endpoint**: `POST /api/conversations/{conversationId}/messages`

**New Features**:
- AI runtime configuration support
- Automatic summarization
- Hybrid retrieval
- Enhanced response format

**Request Body**:
```json
{
  "message": "What is the capital of France?",
  "config": {
    "model": "gpt-4",
    "top_k": 3,
    "summarization": {
      "enabled": false
    },
    "retrieval": {
      "vector_weight": 0.8,
      "keyword_weight": 0.2
    }
  }
}
```

**Response**:
```json
{
  "answer": "The capital of France is Paris.",
  "assistant_message": {
    "id": "msg-123",
    "conversation_id": "conv-456",
    "role": "assistant",
    "content": "The capital of France is Paris.",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "retrieved_chunks": [
    {
      "id": "chunk-789",
      "text": "Paris is the capital and most populous city of France...",
      "score": 0.95
    }
  ],
  "summary_updated": false
}
```

## New Endpoints

### Manual Summarization

**Endpoint**: `POST /api/conversations/{conversationId}/summarize`

**Purpose**: Manually trigger conversation summarization

**Request Body**:
```json
{
  "style": "detailed",
  "max_length": "long",
  "force": false
}
```

**Response**:
```json
{
  "summary": "The conversation covered European geography, focusing on France and its capital city Paris...",
  "snapshot_id": "summary-123",
  "message_count": 15
}
```

### Get Conversation Summary

**Endpoint**: `GET /api/conversations/{conversationId}/summary`

**Purpose**: Retrieve current conversation summary

**Response**:
```json
{
  "summary": "Discussion about European capitals and geography...",
  "last_updated": "2024-01-15T10:30:00Z",
  "message_count": 15,
  "snapshots": [
    {
      "id": "summary-121",
      "summary_text": "Initial geography discussion...",
      "created_at": "2024-01-15T09:00:00Z"
    },
    {
      "id": "summary-123",
      "summary_text": "Extended discussion about European capitals...",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Workspace AI Configuration

**Endpoint**: `GET /api/workspaces/{workspaceId}/ai-config`

**Purpose**: Retrieve workspace AI configuration

**Response**:
```json
{
  "config": {
    "model": "llama3",
    "top_k": 5,
    "summarization": {
      "enabled": true,
      "frequency": 10
    },
    "retrieval": {
      "vector_weight": 0.5,
      "keyword_weight": 0.3
    }
  },
  "last_updated": "2024-01-15T08:00:00Z"
}
```

**Endpoint**: `PUT /api/workspaces/{workspaceId}/ai-config`

**Purpose**: Update workspace AI configuration

**Request Body**:
```json
{
  "config": {
    "model": "gpt-4",
    "summarization": {
      "frequency": 15
    }
  }
}
```

### Conversation AI Configuration

**Endpoint**: `GET /api/conversations/{conversationId}/ai-config`

**Purpose**: Retrieve conversation AI configuration override

**Response**:
```json
{
  "config": {
    "model": "claude-3",
    "top_k": 3
  },
  "effective_config": {
    "model": "claude-3",
    "top_k": 3,
    "summarization": {
      "enabled": true,
      "frequency": 10
    }
    // ... merged with workspace defaults
  }
}
```

**Endpoint**: `PUT /api/conversations/{conversationId}/ai-config`

**Purpose**: Update conversation AI configuration override

**Request Body**:
```json
{
  "config": {
    "model": "gpt-4",
    "summarization": {
      "enabled": false
    }
  }
}
```

## Configuration Schema

### AI Runtime Configuration

All configuration endpoints accept the following schema:

```json
{
  "model": "string?",
  "embedding_model": "string?",
  "top_k": "number?",
  "instruction_template": "string?",
  "summarization": {
    "enabled": "boolean?",
    "frequency": "number?",
    "style": "string?",
    "max_length": "string?"
  },
  "retrieval": {
    "vector_weight": "number?",
    "keyword_weight": "number?",
    "recency_weight": "number?",
    "metadata_weight": "number?",
    "filters": "object?"
  },
  "memory": {
    "window_size": "number?",
    "use_summary": "boolean?"
  },
  "chunking": {
    "size": "number?",
    "overlap": "number?"
  }
}
```

## Error Handling

### Configuration Validation Errors

```json
{
  "error": "ConfigurationValidationError",
  "message": "Invalid configuration",
  "details": {
    "field": "retrieval.vector_weight",
    "issue": "Must be between 0 and 1",
    "provided": 1.5
  }
}
```

### Summarization Errors

```json
{
  "error": "SummarizationError",
  "message": "Failed to generate summary",
  "details": {
    "conversation_id": "conv-123",
    "reason": "LLM service unavailable"
  }
}
```

## Rate Limiting

- **Configuration Updates**: 10 requests per minute per workspace
- **Manual Summarization**: 5 requests per minute per conversation
- **Message Sending**: Inherits existing rate limits

## Authentication

All Step 5 endpoints require:
- Valid JWT token
- Workspace access permissions
- Conversation ownership (for conversation-specific endpoints)

## Backward Compatibility

- Existing endpoints maintain full backward compatibility
- New parameters are optional
- Default configurations ensure existing behavior
- No breaking changes to existing API contracts</content>
<parameter name="filePath">/Users/chunggerman/Documents/Documents - German’s MacBook Pro/GitHub/gErCK/doc/step-5/api-endpoints.md
