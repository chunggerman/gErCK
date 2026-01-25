export class EmbeddingService {
  constructor(provider) {
    this.provider = provider;
  }

  async embedText(text) {
    return await this.provider.embed(text);
  }

  async embedChunks(chunks) {
    const results = [];

    for (const chunk of chunks) {
      const embedding = await this.embedText(chunk.text);
      results.push({
        ...chunk,
        embedding
      });
    }

    return results;
  }
}
