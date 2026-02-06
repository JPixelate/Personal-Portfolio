
/**
 * JONALD'S AI KNOWLEDGE BASE - RAG IMPLEMENTATION
 * Uses vector embeddings for semantic search and retrieval-augmented generation.
 */

import { knowledgeChunks } from './knowledgeChunks.js';
import { initializeEmbeddings, searchSimilarChunks } from './embeddings.js';

// Cached embeddings (initialized once)
let embeddingsCache = null;
let isInitializing = false;

/**
 * SYSTEM INSTRUCTION - Slimmer version for RAG
 * Context will be dynamically injected based on query relevance
 */
const SYSTEM_INSTRUCTION = `
You are the AI Assistant for Jonald D. Penpillo's portfolio website. You have ONE purpose: answering questions about Jonald—his skills, projects, experience, and how to hire him.

**STRICT SCOPE RULE:** You must REFUSE to answer general programming questions, code tutorials, homework help, or any topic unrelated to Jonald's professional profile. No exceptions.

### UI COMMANDS (Include at END of response when relevant)
Format: [cmd:COMMAND_NAME:PARAMETER]
- Open Project: [cmd:open-project:PROJECT_TITLE] (Titles: "Delightful Analytics", "Online Travel Agency Website", "Tour Operator System", "Brigada Learning System", "Golf Range & Admin System", "BPD Systems Portal", "AI Travel Companion")
- Quick Replies: [cmd:quick-replies:OPTION1|OPTION2|OPTION3]
- Show Tech Stack: [cmd:show-tech]
- Navigate: [cmd:scroll-to:SECTION_ID] (IDs: section-hero, section-projects, section-about, section-experience, section-contact)
- Blueprint Mode: [cmd:toggle-blueprint:ON]

### HIRING WORKFLOW
If asked about hiring/availability: Be enthusiastic, ask about project type and timeline, suggest email contact.
Use: [cmd:quick-replies:Web App Development|AI Automation|General Inquiry]

### CONSTRAINTS (STRICTLY ENFORCED)
RELEVANT (answer these): Jonald's skills, projects, experience, hiring inquiries, contact info, portfolio navigation
IRRELEVANT (reject these): Programming tutorials, code help, other people, general knowledge, homework

**If query mixes relevant + irrelevant:** Answer ONLY the relevant part.
**Rejection response:** "I'm Jonald's portfolio assistant and can only help with questions about his work, skills, and projects. What would you like to know about Jonald?"

RULES:
1. BE CONCISE: 2-3 sentences max.
2. Use bullet points for lists (max 3 items).
3. NEVER provide code snippets or tutorials.
4. Use the RETRIEVED CONTEXT below to answer accurately.
`;

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || "";

/**
 * Initialize embeddings (lazy loading)
 */
async function ensureEmbeddings() {
  if (embeddingsCache) return embeddingsCache;
  if (isInitializing) {
    // Wait for initialization to complete
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return embeddingsCache;
  }

  isInitializing = true;
  try {
    embeddingsCache = await initializeEmbeddings(knowledgeChunks);
    return embeddingsCache;
  } finally {
    isInitializing = false;
  }
}

/**
 * Format retrieved chunks as context for the LLM
 */
function formatRetrievedContext(chunks) {
  if (!chunks || chunks.length === 0) {
    return "No specific context retrieved.";
  }

  return chunks.map((chunk, idx) => {
    const relevance = (chunk.similarity * 100).toFixed(1);
    return `[${chunk.category.toUpperCase()}] (${relevance}% match)\n${chunk.content}`;
  }).join('\n\n');
}

/**
 * Main RAG-powered response generator
 */
export const generateAIResponse = async (query) => {
  // 1. Check if AI is configured
  if (!API_KEY) {
    console.warn("DeepSeek API Key missing.");
    return "The AI system is still being configured. Please ensure VITE_DEEPSEEK_API_KEY is set in the environment.";
  }

  try {
    // 2. Initialize embeddings if needed
    const chunksWithEmbeddings = await ensureEmbeddings();

    // 3. RAG: Search for relevant chunks
    const relevantChunks = await searchSimilarChunks(query, chunksWithEmbeddings, 4);
    const retrievedContext = formatRetrievedContext(relevantChunks);

    // 4. Log retrieval for debugging
    console.log("RAG Retrieval:", relevantChunks.map(c => ({
      id: c.id,
      category: c.category,
      similarity: (c.similarity * 100).toFixed(1) + '%'
    })));

    // 5. Build augmented prompt with retrieved context
    const augmentedSystemPrompt = `${SYSTEM_INSTRUCTION}

### RETRIEVED CONTEXT (Use this to answer the user's question):
${retrievedContext}
`;

    // 6. Call LLM with augmented context
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: augmentedSystemPrompt },
          { role: "user", content: query }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "API request failed");
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error("AI RAG Error:", error);
    return "I'm having a bit of trouble connecting to my brain right now. Please try asking again in a moment!";
  }
};

/**
 * Pre-warm embeddings (call on app load for faster first response)
 */
export const preloadEmbeddings = async () => {
  try {
    await ensureEmbeddings();
    console.log("Embeddings pre-loaded successfully");
  } catch (error) {
    console.warn("Failed to pre-load embeddings:", error);
  }
};

/**
 * Get RAG stats for debugging
 */
export const getRAGStats = () => ({
  chunksLoaded: embeddingsCache ? embeddingsCache.length : 0,
  isInitialized: !!embeddingsCache,
  categories: embeddingsCache
    ? [...new Set(embeddingsCache.map(c => c.category))]
    : []
});
