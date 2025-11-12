// src/lib/enhancedRAG.ts
import { vectorStore } from './vectorStore';

interface Message {
  role: string;
  content: string;
}

/**
 * Build context from vector search results
 */
export async function buildEnhancedRAGContext(
  query: string,
  topK: number = 3
): Promise<string> {
  try {
    // Search vector store for relevant chunks
    const results = await vectorStore.search(query, topK);

    if (results.length === 0) {
      return '';
    }

    // Build context from search results
    const contextParts = results.map((result, index) => {
      const { document, similarity } = result;
      return `[Source ${index + 1}: ${document.metadata.filename} (${document.metadata.category}) - Relevance: ${(similarity * 100).toFixed(1)}%]\n${document.content}`;
    });

    return contextParts.join('\n\n---\n\n');
  } catch (error) {
    console.error('Error building RAG context:', error);
    return '';
  }
}

/**
 * Build an enhanced prompt with RAG context and conversation history
 */
export async function buildEnhancedPrompt(
  userQuery: string,
  customerName?: string,
  conversationHistory: Message[] = []
): Promise<string> {
  // Get relevant context from knowledge base
  const ragContext = await buildEnhancedRAGContext(userQuery, 3);

  // Build conversation history string
  const historyContext = conversationHistory
    .slice(-5) // Last 5 messages for context
    .map(msg => `${msg.role === 'user' ? 'Customer' : 'Agent'}: ${msg.content}`)
    .join('\n');

  // Construct the enhanced prompt
  let prompt = `You are a helpful customer service agent for Infiniserve Glow, a digital services company.

`;

  // Add customer context if available
  if (customerName) {
    prompt += `You are currently assisting: ${customerName}\n\n`;
  }

  // Add knowledge base context if available
  if (ragContext) {
    prompt += `=== RELEVANT KNOWLEDGE BASE CONTEXT ===\n${ragContext}\n\n`;
  }

  // Add conversation history if available
  if (historyContext) {
    prompt += `=== CONVERSATION HISTORY ===\n${historyContext}\n\n`;
  }

  // Add the current query
  prompt += `=== CURRENT CUSTOMER QUERY ===\nCustomer: ${userQuery}\n\n`;

  // Add instructions
  prompt += `Instructions:
- Use the knowledge base context above to answer the customer's query accurately
- Be friendly, professional, and concise
- If the answer isn't in the knowledge base, use your general knowledge but be honest about it
- Reference specific sources when applicable
- Keep responses clear and actionable

Agent:`;

  return prompt;
}

/**
 * Build a prompt specifically for general chat (no customer context)
 */
export async function buildGeneralChatPrompt(
  userQuery: string,
  conversationHistory: Message[] = []
): Promise<string> {
  return buildEnhancedPrompt(userQuery, undefined, conversationHistory);
}

/**
 * Extract key topics from a query for better search
 */
export function extractKeyTopics(query: string): string[] {
  // Remove common stop words
  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'will', 'with', 'what', 'how', 'can', 'do', 'does'
  ]);

  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  return Array.from(new Set(words));
}

/**
 * Check if knowledge base has relevant information
 */
export async function hasRelevantKnowledge(
  query: string,
  minSimilarity: number = 0.5
): Promise<boolean> {
  try {
    const results = await vectorStore.search(query, 1);
    return results.length > 0 && results[0].similarity >= minSimilarity;
  } catch (error) {
    console.error('Error checking knowledge base:', error);
    return false;
  }
}