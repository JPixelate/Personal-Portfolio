/**
 * EMBEDDINGS UTILITY FOR RAG SYSTEM
 * Loads pre-computed vectors from static JSON and performs similarity search.
 */

// Import pre-computed embeddings
import embeddingsData from '../data/embeddings.json';

/**
 * Simple string hash function for query embedding
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}

/**
 * Generate embedding for query text
 * Uses the same algorithm as the pre-computed embeddings
 */
export function generateEmbedding(text, dimensions = 256) {
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  const words = normalized.split(/\s+/).filter(w => w.length > 0);
  const embedding = new Array(dimensions).fill(0);

  // Word-level features
  words.forEach((word, idx) => {
    const hash = simpleHash(word);
    const position = Math.abs(hash) % dimensions;
    embedding[position] += 1 / (1 + idx * 0.1);
  });

  // Character trigram features
  for (let i = 0; i < normalized.length - 2; i++) {
    const trigram = normalized.substring(i, i + 3);
    const hash = simpleHash(trigram);
    const position = Math.abs(hash) % dimensions;
    embedding[position] += 0.5;
  }

  // Normalize to unit vector
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < dimensions; i++) {
      embedding[i] /= magnitude;
    }
  }

  return embedding;
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    const minLen = Math.min(vecA.length, vecB.length);
    vecA = vecA.slice(0, minLen);
    vecB = vecB.slice(0, minLen);
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Search for most relevant chunks based on query
 * @param {string} query - User's question
 * @param {Array} chunksWithEmbeddings - Knowledge chunks with embeddings (optional, uses static data)
 * @param {number} topK - Number of results to return
 * @returns {Array} Top matching chunks with similarity scores
 */
export async function searchSimilarChunks(query, chunksWithEmbeddings = null, topK = 6) {
  const chunks = chunksWithEmbeddings || embeddingsData;
  const queryEmbedding = generateEmbedding(query);
  const normalize = str => str.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  const queryWords = normalize(query).split(/\s+/).filter(w => w.length > 2);

  const scored = chunks.map(chunk => {
    // 1. Vector Similarity
    const sim = cosineSimilarity(queryEmbedding, chunk.embedding);
    
    // 2. Keyword Boost
    let keywordMatches = 0;
    const chunkContent = normalize(chunk.content + ' ' + chunk.category);
    
    queryWords.forEach(word => {
      if (chunkContent.includes(word)) {
        keywordMatches++;
      }
    });
    
    // Boost score: 10% boost per matching keyword (capped at 50%)
    const boost = Math.min(keywordMatches * 0.1, 0.5);
    
    return {
      ...chunk,
      similarity: sim + boost,
      originalSimilarity: sim,
      matches: keywordMatches
    };
  });

  // Sort by combined score
  scored.sort((a, b) => b.similarity - a.similarity);

  return scored.slice(0, topK);
}

/**
 * Initialize embeddings - now just returns static data
 * Kept for backwards compatibility
 */
export async function initializeEmbeddings() {
  console.log(`Loaded ${embeddingsData.length} pre-computed embeddings`);
  return embeddingsData;
}

/**
 * Get all embeddings data
 */
export function getEmbeddingsData() {
  return embeddingsData;
}

/**
 * Get embedding stats
 */
export function getEmbeddingStats() {
  const categories = [...new Set(embeddingsData.map(c => c.category))];
  return {
    totalChunks: embeddingsData.length,
    dimensions: embeddingsData[0]?.embedding?.length || 0,
    categories,
    categoryCounts: categories.reduce((acc, cat) => {
      acc[cat] = embeddingsData.filter(c => c.category === cat).length;
      return acc;
    }, {})
  };
}
