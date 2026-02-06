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

// Knowledge chunks (copy from knowledgeChunks.js)
const knowledgeChunks = [
  // Identity & Contact
  {
    id: "profile-basic",
    category: "profile",
    content: "Jonald D. Penpillo is a Full-Stack Software Developer based in General Santos City, Philippines. He specializes in web development, AI automation, and creative design."
  },
  {
    id: "contact-email",
    category: "contact",
    content: "Jonald's email address is jonaldpenpillo@gmail.com. This is the best way to reach him for project inquiries and collaborations."
  },
  {
    id: "contact-whatsapp",
    category: "contact",
    content: "Jonald is available on WhatsApp at +63 910 787 6246. This is his preferred channel for technical discussions and quick consultations."
  },
  {
    id: "contact-viber",
    category: "contact",
    content: "For business inquiries, Jonald can be reached on Viber at +63 992 713 3582."
  },
  {
    id: "social-linkedin",
    category: "contact",
    content: "Jonald's LinkedIn profile is linkedin.com/in/jonald-penpillo. You can view his full CV and professional network there."
  },
  {
    id: "social-instagram",
    category: "contact",
    content: "Jonald's Instagram is @h4kuna_11 where he shares creative work and daily updates."
  },
  // Professional Summary
  {
    id: "summary-main",
    category: "summary",
    content: "Jonald is a results-driven Full-Stack Web Developer with experience in PHP (CodeIgniter), React, JavaScript, and AI automation using n8n. He won the Innovation Award at Top Executive Congress 2025 for developing an AI companion."
  },
  {
    id: "award-innovation",
    category: "achievement",
    content: "Jonald won the Innovation Award at Top Executive Congress 2025 for his AI Travel Companion development project, demonstrating his expertise in AI integration and innovative solutions."
  },
  // Technical Skills
  {
    id: "skills-languages",
    category: "skills",
    content: "Jonald's programming languages and frameworks include PHP with CodeIgniter, React, JavaScript, Node.js, Next.js, and TypeScript. He is proficient in both frontend and backend development."
  },
  {
    id: "skills-ai",
    category: "skills",
    content: "Jonald specializes in AI Automation using n8n, Chatbot Integration, RAG Systems (Retrieval-Augmented Generation), MCP (Model Context Protocol), and n8n Orchestration for workflow automation."
  },
  {
    id: "skills-creative",
    category: "skills",
    content: "Jonald has creative skills in UX/UI Design, Video Editing using Adobe Premiere Pro, and Graphic Design with Adobe Illustrator and Photoshop."
  },
  // Projects
  {
    id: "project-delightful-analytics",
    category: "project",
    content: "Delightful Analytics is a comprehensive analytics platform Jonald built for tracking performance of Delightful.ph and ai.delightful.ph. It integrates Google Analytics, n8n automation, and SerpAPI for SEO tracking."
  },
  {
    id: "project-ota",
    category: "project",
    content: "Jonald developed an Online Travel Agency Website, a comprehensive platform for travel bookings and tourism services."
  },
  {
    id: "project-tour-operator",
    category: "project",
    content: "The Tour Operator System is a project by Jonald that streamlines booking and administrative workflows for tour operators."
  },
  {
    id: "project-bls",
    category: "project",
    content: "Brigada Learning System (BLS) is an interactive Learning Management System (LMS) Jonald built for education and training purposes."
  },
  {
    id: "project-golf",
    category: "project",
    content: "Jonald created a Golf Range & Admin System for reservation management and administration of golf facilities."
  },
  {
    id: "project-bpd",
    category: "project",
    content: "BPD Systems Portal is a centralized internal process management hub Jonald developed for streamlining business operations."
  },
  {
    id: "project-ai-travel",
    category: "project",
    content: "The AI Travel Companion is an intelligent AI-powered travel assistant Jonald built using n8n and OpenAI. This project won the Innovation Award at Top Executive Congress 2025."
  },
  // Work History
  {
    id: "work-brigada-dev",
    category: "experience",
    content: "Jonald currently works as a Software Developer at Brigada Group since May 2024. He develops web applications and AI automation solutions for the company."
  },
  {
    id: "work-brigada-creative",
    category: "experience",
    content: "Before becoming a developer, Jonald worked as a Creative Content Specialist at Brigada Group from 2023 to 2024, handling visual content and design work."
  },
  {
    id: "work-freelance",
    category: "experience",
    content: "Jonald worked as a freelance Video Editor and Graphic Designer from 2016 to 2022, building extensive experience in creative media production."
  },
  // Hiring & Availability
  {
    id: "hiring-availability",
    category: "hiring",
    content: "Jonald is available for freelance projects and collaborations. He works on Web App Development, AI Automation projects, and Full Stack development. Contact him via email at jonaldpenpillo@gmail.com to discuss your project."
  },
  {
    id: "hiring-services",
    category: "hiring",
    content: "Jonald offers services in Full-Stack Web Development, AI Chatbot Integration, Workflow Automation with n8n, and Custom Software Solutions. He can build web apps, automate business processes, and integrate AI into existing systems."
  },
  // Portfolio Website
  {
    id: "portfolio-tech",
    category: "portfolio",
    content: "This portfolio website was built by Jonald using React, Vite, and modern web technologies. It features an AI assistant powered by DeepSeek, smooth animations, and a responsive design."
  },
  {
    id: "portfolio-sections",
    category: "portfolio",
    content: "The portfolio has sections for Projects (case studies), About (philosophy and background), Experience (work history), and Contact (ways to reach Jonald)."
  }
];

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
