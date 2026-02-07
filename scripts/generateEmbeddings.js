/**
 * EMBEDDING GENERATOR SCRIPT
 * Run with: node scripts/generateEmbeddings.js
 *
 * Generates vector embeddings for all knowledge chunks and saves to JSON.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import knowledge chunks from source of truth
import { knowledgeChunks } from '../src/utils/knowledgeChunks.js';

/**
 * Generate fallback embedding using character n-grams
 * (Same algorithm as in embeddings.js)
 */
function generateFallbackEmbedding(text, dimensions = 256) {
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
 * Main generation function
 */
async function generateEmbeddings() {
  console.log('🚀 Generating embeddings for', knowledgeChunks.length, 'chunks...\n');

  const embeddingsData = [];

  for (const chunk of knowledgeChunks) {
    const embedding = generateFallbackEmbedding(chunk.content);

    embeddingsData.push({
      id: chunk.id,
      category: chunk.category,
      content: chunk.content,
      embedding: embedding.map(v => Math.round(v * 10000) / 10000) // Round to 4 decimals
    });

    console.log(`✓ ${chunk.id} (${chunk.category})`);
  }

  // Save to JSON file
  const outputPath = path.join(__dirname, '../src/data/embeddings.json');
  const outputDir = path.dirname(outputPath);

  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(embeddingsData, null, 2));

  console.log(`\n✅ Embeddings saved to: src/data/embeddings.json`);
  console.log(`📊 Total chunks: ${embeddingsData.length}`);
  console.log(`📐 Vector dimensions: 256`);
  console.log(`📁 File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
}

generateEmbeddings().catch(console.error);
