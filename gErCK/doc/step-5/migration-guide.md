# Migration Guide: Basic to Intelligent Conversations

This guide helps you migrate from basic chat functionality to the new AI runtime system with conversation intelligence.

## Overview

The Step 5 upgrade introduces:
- Configurable AI behavior
- Automatic conversation summarization
- Hybrid retrieval system
- Enhanced context management

## Database Migration

### Required Schema Changes

Run the updated schema to add new columns and tables:

```sql
-- Add AI config to workspace
ALTER TABLE workspace ADD COLUMN ai_config JSONB DEFAULT '{...}';

-- Add overrides and summary to conversation
ALTER TABLE conversation
ADD COLUMN ai_config_override JSONB,
ADD COLUMN summary TEXT;

-- Create summary snapshots table
CREATE TABLE conversation_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversation(id) ON DELETE CASCADE,
  summary_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversation_summary_conversation_id
ON conversation_summary(conversation_id);
```

### Data Migration

For existing conversations, you may want to:

1. **Set workspace defaults**:
```sql
UPDATE workspace SET ai_config = '{
  "model": "llama3",
  "top_k": 5,
  "summarization": {"enabled": true, "frequency": 10},
  "retrieval": {"vector_weight": 0.5, "keyword_weight": 0.3}
}'::jsonb;
```

2. **Generate initial summaries** (optional):
```sql
-- For conversations with many messages
-- Run summarization manually or let it happen automatically
```

## Code Migration

### Backend Changes

1. **Install new dependencies** (if any):
```bash
# No new dependencies required for Step 5
```

2. **Update imports** in conversation controller:
```javascript
// Add these imports
import { resolveRuntimeConfig, SYSTEM_DEFAULT_CONFIG } from "../../services/runtimeConfigService.js";
import { summarizeMessages, mergeSummaries, saveConversationSummary, updateConversationSummary } from "../../services/summarizationService.js";
import { retrieveContext } from "../../services/retrievalService.js";
import { buildPrompt } from "../../services/promptBuilder.js";
```

3. **Update sendMessage function**:
   - Replace simple retrieval with `retrieveContext()`
   - Add configuration loading and merging
   - Integrate summarization logic
   - Use structured prompt building

### Frontend Changes

1. **Add configuration UI** (optional):
   - Workspace settings page for AI defaults
   - Conversation settings for overrides
   - Per-request configuration options

2. **Update API calls**:
```javascript
// Enhanced message sending
const response = await fetch(`/api/conversations/${id}/messages`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage,
    config: {
      model: 'gpt-4',
      top_k: 3
    }
  })
});
```

## Configuration Setup

### Workspace Defaults

Set up sensible defaults for your workspace:

```json
{
  "model": "llama3",
  "embedding_model": "nomic-embed-text",
  "top_k": 5,
  "summarization": {
    "enabled": true,
    "frequency": 10,
    "style": "adaptive",
    "max_length": "medium"
  },
  "retrieval": {
    "vector_weight": 0.6,
    "keyword_weight": 0.4,
    "recency_weight": 0.0,
    "metadata_weight": 0.0
  },
  "memory": {
    "window_size": 10,
    "use_summary": true
  }
}
```

### Testing Configuration

1. **Start with defaults**: Use workspace defaults for initial testing
2. **Test summarization**: Send 10+ messages to trigger summarization
3. **Test retrieval**: Ask questions that require context lookup
4. **Monitor performance**: Check response times and quality

## Feature Rollout Strategy

### Phase 1: Backend Only
- Deploy Step 5 backend changes
- Maintain existing API compatibility
- Monitor system performance

### Phase 2: Frontend Integration
- Add configuration UI components
- Update chat interface for enhanced features
- Provide user education materials

### Phase 3: Advanced Features
- Enable advanced summarization options
- Implement custom retrieval filters
- Add analytics and monitoring

## Backward Compatibility

### What Still Works
- ✅ Existing API endpoints
- ✅ Basic message sending
- ✅ Conversation history
- ✅ Simple retrieval (falls back to vector search)

### What Changes
- 🔄 Enhanced response format (includes retrieved chunks)
- 🔄 Improved context quality
- 🔄 Automatic summarization for long conversations

## Troubleshooting

### Common Issues

1. **Configuration not applying**:
   - Check JSON syntax
   - Verify field names match schema
   - Ensure proper nesting

2. **Summarization not triggering**:
   - Check `summarization.frequency` setting
   - Verify `summarization.enabled` is true
   - Monitor message counts

3. **Poor retrieval quality**:
   - Adjust `retrieval.vector_weight` vs `keyword_weight`
   - Check embedding model configuration
   - Review content chunking quality

### Rollback Plan

If issues arise:
1. **Disable summarization**: Set `summarization.enabled: false`
2. **Use simple retrieval**: Set `vector_weight: 1.0, keyword_weight: 0.0`
3. **Revert to defaults**: Remove custom configurations

## Performance Considerations

### Expected Changes
- **Memory usage**: Slightly higher due to configuration storage
- **Response time**: May increase due to enhanced retrieval (typically 100-500ms)
- **Database load**: Additional writes for summaries

### Optimization Tips
- **Index maintenance**: Ensure vector indexes are optimized
- **Caching**: Implement response caching for frequent queries
- **Batch processing**: Consider batching summarization tasks

## Support and Resources

- **Documentation**: See `/doc/step-5/` for detailed guides
- **Configuration Schema**: Reference `ai-runtime-config.md`
- **API Examples**: Check `api-endpoints.md`
- **Troubleshooting**: Review individual service documentation

## Success Metrics

Monitor these indicators post-migration:
- **User satisfaction**: Response quality ratings
- **Performance**: Response time and error rates
- **Engagement**: Conversation length and depth
- **System health**: Resource usage and error logs</content>
<parameter name="filePath">/Users/chunggerman/Documents/Documents - German’s MacBook Pro/GitHub/gErCK/doc/step-5/migration-guide.md
