# Hybrid Retrieval Engine

The gErCK retrieval engine combines multiple search strategies to provide comprehensive and accurate context retrieval for AI conversations.

## Architecture Overview

The hybrid retrieval system integrates:

1. **Vector Search**: Semantic similarity using embeddings
2. **Keyword Search**: Traditional text matching
3. **Weighted Ranking**: Intelligent combination of results
4. **Filtering & Deduplication**: Result refinement

## Search Strategies

### Vector Search

**Purpose**: Find semantically similar content using embeddings

**Implementation**:
- Uses configured embedding model
- Searches against vector-indexed content chunks
- Returns results ranked by cosine similarity

**Configuration**:
```json
{
  "embedding_model": "nomic-embed-text",
  "top_k": 5
}
```

### Keyword Search

**Purpose**: Find exact and partial text matches

**Implementation**:
- Full-text search with ILIKE matching
- Searches within workspace content
- Supports partial word matching with wildcards

**Configuration**:
```json
{
  "keyword_search": {
    "enabled": true,
    "fuzzy_matching": true
  }
}
```

## Hybrid Ranking Algorithm

### Weight-Based Scoring

Each retrieval result receives a score based on multiple factors:

```
final_score = (vector_score × vector_weight) +
              (keyword_score × keyword_weight) +
              (recency_score × recency_weight) +
              (metadata_score × metadata_weight)
```

### Score Components

| Component | Calculation | Purpose |
|-----------|-------------|---------|
| **Vector Score** | Cosine similarity (0-1) | Semantic relevance |
| **Keyword Score** | Match quality (0-1) | Textual relevance |
| **Recency Score** | Time-based decay (0-1) | Content freshness |
| **Metadata Score** | Tag/field matching (0-1) | Structured relevance |

### Result Ranking

1. **Score Calculation**: Apply weights to each result
2. **Deduplication**: Remove duplicate chunks
3. **Top-K Selection**: Return highest scoring results
4. **Re-ranking**: Optional second pass for refinement

## Configuration Examples

### Balanced Search
```json
{
  "retrieval": {
    "vector_weight": 0.5,
    "keyword_weight": 0.3,
    "recency_weight": 0.15,
    "metadata_weight": 0.05
  }
}
```

### Semantic-Focused Search
```json
{
  "retrieval": {
    "vector_weight": 0.8,
    "keyword_weight": 0.2,
    "recency_weight": 0.0,
    "metadata_weight": 0.0
  }
}
```

### Keyword-Focused Search
```json
{
  "retrieval": {
    "vector_weight": 0.2,
    "keyword_weight": 0.8,
    "recency_weight": 0.0,
    "metadata_weight": 0.0
  }
}
```

## Performance Optimization

### Indexing Strategies

- **Vector Indexes**: IVF-Flat with optimized lists parameter
- **Text Indexes**: GIN indexes for full-text search
- **Composite Indexes**: Combined field indexes for metadata filtering

### Caching

- **Embedding Cache**: Reuse embeddings for repeated queries
- **Result Cache**: Cache frequent search results
- **Index Warmup**: Preload frequently accessed indexes

### Query Optimization

- **Batch Processing**: Process multiple queries together
- **Parallel Search**: Execute vector and keyword searches concurrently
- **Early Termination**: Stop searching when sufficient results found

## API Usage

### Basic Retrieval

```javascript
const context = await retrieveContext({
  workspaceId: "workspace-123",
  query: "What is machine learning?",
  config: {
    top_k: 5,
    retrieval: {
      vector_weight: 0.6,
      keyword_weight: 0.4
    }
  }
});
```

### Advanced Filtering

```javascript
const context = await retrieveContext({
  workspaceId: "workspace-123",
  query: "Python programming",
  config: {
    retrieval: {
      filters: {
        content_type: "tutorial",
        tags: ["python", "beginner"]
      }
    }
  }
});
```

## Monitoring & Analytics

### Performance Metrics

- **Query Latency**: Average response time
- **Result Quality**: User satisfaction scores
- **Coverage**: Percentage of queries with results
- **Precision/Recall**: Search accuracy metrics

### Search Analytics

- **Popular Queries**: Most frequent search terms
- **Result Click-through**: Which results users select
- **Search Patterns**: Temporal and behavioral patterns
- **Performance Trends**: Latency and quality over time

## Troubleshooting

### Common Issues

1. **Low Result Quality**
   - Adjust vector vs keyword weights
   - Check embedding model quality
   - Review content chunking strategy

2. **Slow Performance**
   - Optimize index parameters
   - Implement result caching
   - Consider query batching

3. **Missing Results**
   - Verify content ingestion
   - Check filtering criteria
   - Review search query preprocessing

### Debug Tools

- **Query Analysis**: Break down search into components
- **Result Inspection**: Examine individual result scores
- **Index Validation**: Verify index integrity and statistics</content>
<parameter name="filePath">/Users/chunggerman/Documents/Documents - German’s MacBook Pro/GitHub/gErCK/doc/step-5/retrieval-engine.md
