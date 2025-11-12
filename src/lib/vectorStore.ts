// src/lib/vectorStore.ts

interface VectorDocument {
  id: string;
  content: string;
  embedding: number[];
  metadata: {
    filename: string;
    category: string;
    chunkIndex: number;
    fileType: string;
  };
}

interface SearchResult {
  document: VectorDocument;
  similarity: number;
}

class VectorStore {
  private documents: VectorDocument[] = [];
  private ollamaUrl: string = 'http://localhost:11434';

  /**
   * Generate embeddings using Ollama
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2:1b',
          prompt: text,
        }),
      });

      const data = await response.json();
      return data.embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  /**
   * Add a document with its chunks to the vector store
   */
  async addDocument(
    filename: string,
    category: string,
    fileType: string,
    chunks: string[]
  ): Promise<void> {
    console.log(`📥 Adding ${chunks.length} chunks from ${filename}...`);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await this.generateEmbedding(chunk);

      const doc: VectorDocument = {
        id: `${filename}-chunk-${i}`,
        content: chunk,
        embedding,
        metadata: {
          filename,
          category,
          chunkIndex: i,
          fileType,
        },
      };

      this.documents.push(doc);
    }

    console.log(`✅ Added ${filename} to vector store`);
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Search for similar documents using semantic search
   */
  async search(query: string, topK: number = 5): Promise<SearchResult[]> {
    console.log(`🔍 Searching for: "${query}"`);

    // Generate embedding for the query
    const queryEmbedding = await this.generateEmbedding(query);

    // Calculate similarity for all documents
    const results: SearchResult[] = this.documents.map(doc => ({
      document: doc,
      similarity: this.cosineSimilarity(queryEmbedding, doc.embedding),
    }));

    // Sort by similarity (highest first) and return top K
    results.sort((a, b) => b.similarity - a.similarity);

    console.log(`📊 Found ${results.length} results, returning top ${topK}`);
    return results.slice(0, topK);
  }

  /**
   * Get all documents in the store
   */
  getAllDocuments(): VectorDocument[] {
    return this.documents;
  }

  /**
   * Get documents by category
   */
  getDocumentsByCategory(category: string): VectorDocument[] {
    return this.documents.filter(doc => doc.metadata.category === category);
  }

  /**
   * Remove all documents from a specific file
   */
  removeDocument(filename: string): void {
    this.documents = this.documents.filter(
      doc => doc.metadata.filename !== filename
    );
    console.log(`🗑️ Removed all chunks from ${filename}`);
  }

  /**
   * Clear all documents
   */
  clear(): void {
    this.documents = [];
    console.log('🗑️ Cleared vector store');
  }

  /**
   * Get statistics about the vector store
   */
  getStats() {
    const categories = new Set(this.documents.map(d => d.metadata.category));
    const files = new Set(this.documents.map(d => d.metadata.filename));

    return {
      totalDocuments: this.documents.length,
      totalFiles: files.size,
      categories: Array.from(categories),
      categoryBreakdown: Array.from(categories).map(cat => ({
        category: cat,
        count: this.documents.filter(d => d.metadata.category === cat).length,
      })),
    };
  }
}

// Export a singleton instance
export const vectorStore = new VectorStore();