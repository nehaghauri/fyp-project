// src/lib/knowledgeBaseManager.ts
import { parseDocument, parseMultipleDocuments } from './documentParser';
import { vectorStore } from './vectorStore';

export class KnowledgeBaseManager {
  /**
   * Upload and process a single file
   */
  async uploadFile(file: File, category: string): Promise<void> {
    try {
      console.log(`📤 Processing file: ${file.name}`);

      // Parse the document
      const parsedDoc = await parseDocument(file, category);

      // Validate parsed document
      if (!parsedDoc || !parsedDoc.chunks || parsedDoc.chunks.length === 0) {
        throw new Error('Failed to parse document or no content extracted');
      }

      // Add to vector store with safe metadata access
      await vectorStore.addDocument(
        parsedDoc.filename,
        parsedDoc.category,
        parsedDoc.metadata?.fileType || 'unknown',
        parsedDoc.chunks
      );

      console.log(`✅ Successfully processed ${file.name}`);
    } catch (error) {
      console.error(`❌ Error processing ${file.name}:`, error);
      throw error;
    }
  }

  /**
   * Upload and process multiple files
   */
  async uploadFiles(files: File[], category: string): Promise<{
    successful: string[];
    failed: Array<{ filename: string; error: string }>;
  }> {
    const successful: string[] = [];
    const failed: Array<{ filename: string; error: string }> = [];

    for (const file of files) {
      try {
        await this.uploadFile(file, category);
        successful.push(file.name);
      } catch (error: any) {
        failed.push({
          filename: file.name,
          error: error.message || 'Unknown error',
        });
      }
    }

    return { successful, failed };
  }

  /**
   * Remove a document from the knowledge base
   */
  removeDocument(filename: string): void {
    vectorStore.removeDocument(filename);
  }

  /**
   * Get statistics about the knowledge base
   */
  getStats() {
    return vectorStore.getStats();
  }

  /**
   * Search the knowledge base
   */
  async search(query: string, topK: number = 5) {
    return await vectorStore.search(query, topK);
  }

  /**
   * Clear the entire knowledge base
   */
  clearAll(): void {
    vectorStore.clear();
  }

  /**
   * Export knowledge base data (for backup)
   */
  exportData() {
    const documents = vectorStore.getAllDocuments();
    return {
      documents,
      stats: this.getStats(),
      exportDate: new Date().toISOString(),
    };
  }

  /**
   * Get documents by category
   */
  getDocumentsByCategory(category: string) {
    return vectorStore.getDocumentsByCategory(category);
  }
}

// Export singleton instance
export const knowledgeBaseManager = new KnowledgeBaseManager();