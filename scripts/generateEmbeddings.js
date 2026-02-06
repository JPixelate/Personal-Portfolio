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
  // ========== IDENTITY & CONTACT ==========
  {
    id: "profile-basic",
    category: "profile",
    content: "Jonald D. Penpillo is a Full-Stack Software Developer based in Purok Bayanihan, Brgy. San Isidro, General Santos City, Philippines. He specializes in web development, AI automation, and creative design. His portfolio is available at https://penpillo-portfolio.vercel.app/"
  },
  {
    id: "contact-email",
    category: "contact",
    content: "Jonald's email address is jonaldpenpillo@gmail.com. This is the best way to reach him for project inquiries and collaborations."
  },
  {
    id: "contact-phone",
    category: "contact",
    content: "Jonald can be reached by phone at +63 9107678246 for technical discussions and business inquiries."
  },
  {
    id: "social-linkedin",
    category: "contact",
    content: "Jonald's LinkedIn profile is www.linkedin.com/in/jonald-penpillo. You can view his full CV and professional network there."
  },

  // ========== PROFESSIONAL SUMMARY ==========
  {
    id: "summary-main",
    category: "summary",
    content: "Jonald is a results-driven Full-Stack Web Developer with hands-on experience in PHP (CodeIgniter), React, JavaScript, AJAX, and front-end technologies, delivering scalable web applications and business-critical systems. He is skilled in leading end-to-end development of secure platforms and management systems."
  },
  {
    id: "summary-achievements",
    category: "summary",
    content: "Jonald led the development of an AI-powered companion app for Delightful Philippines using n8n automation, contributing to the Innovation Award at the Top Executive Congress 2025. He has delivered high-impact digital products such as Travel News portals and OTA platforms, supporting large-scale tourism initiatives."
  },
  {
    id: "summary-strengths",
    category: "summary",
    content: "Jonald is proactive and collaborative, with strengths in system architecture, automation, React-based UI, API integration, and problem-solving, consistently delivering high-quality, secure, and maintainable solutions."
  },

  // ========== TECHNICAL SKILLS ==========
  {
    id: "skills-languages",
    category: "skills",
    content: "Jonald's programming languages and frameworks include PHP Framework CodeIgniter, JavaScript, React, Next.js, Node.js, TypeScript, and AJAX. He is proficient in both frontend and backend development."
  },
  {
    id: "skills-frontend",
    category: "skills",
    content: "Jonald specializes in Front-end Web Development using React, Tailwind CSS, HTML, and CSS. He has strong UX/UI Design skills and creates responsive, user-friendly interfaces."
  },
  {
    id: "skills-ai-automation",
    category: "skills",
    content: "Jonald specializes in AI Automation using n8n, Chatbot Integration (HybeChat and ManyChat), RAG Systems (Retrieval-Augmented Generation), and n8n Orchestration for workflow automation."
  },
  {
    id: "skills-creative",
    category: "skills",
    content: "Jonald has creative skills in Video Editing using Adobe Premiere Pro, and Graphic Design with Adobe Illustrator, Photoshop, and Canva. He has extensive experience creating visual content for various platforms."
  },

  // ========== SOFT SKILLS ==========
  {
    id: "soft-skills",
    category: "skills",
    content: "Jonald's soft skills include Creativity, Problem-solving, Adaptability, Collaboration, Attention to Detail, Time Management, and Effective Communication. He has proven experience working in teams to deliver successful projects."
  },

  // ========== EDUCATION ==========
  {
    id: "education-degree",
    category: "education",
    content: "Jonald graduated in June 2022 from Goldenstate College of Koronadal, Inc. with a Bachelor of Science in Information Technology. He was awarded Outstanding Student in Industry Immersion and won 2nd Place in the ICT Day Web Design Competition."
  },

  // ========== CERTIFICATIONS ==========
  {
    id: "certifications-udemy",
    category: "education",
    content: "Jonald has completed multiple Udemy certifications including Web Development Master Class by YouAccel Training, Web Development with Elementor by Alexander Schlee, CSS Crash Course by Proper Dot Institute, Mastering Visual Studio Code by Alex Horea, and Social Media Marketing Strategy 2021 by Anton Voroniuk."
  },
  {
    id: "certifications-hubspot",
    category: "education",
    content: "Jonald is certified by HubSpot Academy in Email Marketing and Digital Marketing, demonstrating his expertise in digital marketing strategies."
  },
  {
    id: "certifications-google",
    category: "education",
    content: "Jonald has completed the Google Mobile Experience Certification Exam, showcasing his knowledge of mobile-first web development."
  },
  {
    id: "certifications-link",
    category: "education",
    content: "All of Jonald's certificates can be viewed at https://drive.google.com/drive/folders/1cF-NCGJYmeCahFZKVSnKz1X4VPLA6-Sp?usp=sharing"
  },

  // ========== AWARDS ==========
  {
    id: "award-innovation-2025",
    category: "achievement",
    content: "In December 2025, Jonald received the Innovation Award at the Top Executive Congress 2025 for leading and developing the Delightful Philippines digital platform and its AI-powered companion, 'Delai,' built using n8n automation, in collaboration with a cross-functional development team."
  },
  {
    id: "award-sinedokyu",
    category: "achievement",
    content: "In June 2022, Jonald won 3rd Place in SINEDOKYU: Mobile Documentary Film Competition, initiated by the Provincial Government of South Cotabato through the Arts, Culture, Tourism, Museum Development, and Promotions Unit during the 2021 Arts Festival."
  },

  // ========== CURRENT POSITION (May 2024 - Present) ==========
  {
    id: "work-brigada-current",
    category: "experience",
    content: "Since May 2024, Jonald works as a Software Developer in the Quality Management Department at Brigada Group. He leads development of multiple enterprise systems and AI-powered solutions."
  },
  {
    id: "work-brigada-golf-range",
    category: "experience",
    content: "At Brigada Group, Jonald led the development of the Brigada Golf Range platform, integrating an enhanced security system to improve operational safety and access control."
  },
  {
    id: "work-brigada-tour-operator",
    category: "experience",
    content: "Jonald led the development of a Tour Operator Management System that streamlines booking, operations, and administrative workflows for Brigada Group's tourism operations."
  },
  {
    id: "work-brigada-ai-companion",
    category: "experience",
    content: "Jonald led the development of an AI-powered companion application for Delightful Philippines using n8n automation. This project received the Innovation Award from the Top Executive Congress 2025."
  },
  {
    id: "work-brigada-delightful",
    category: "experience",
    content: "Jonald managed and led the development of the Delightful Philippines Travel News website and its Online Travel Agency (OTA) platform, supporting tourism advocacy initiatives under Brigada's new tourism-focused company."
  },
  {
    id: "work-brigada-lms",
    category: "experience",
    content: "Jonald developed and implemented a Learning Management System (LMS) for new employees at Brigada Group, built using CodeIgniter 3 (PHP Framework), Ajax, and JavaScript, with plans to scale for use by all employees."
  },
  {
    id: "work-brigada-file-upload",
    category: "experience",
    content: "Jonald designed and launched a File Upload Website to streamline the collection and management of exclusive images and videos showcasing Philippine destinations for Brigada Group."
  },
  {
    id: "work-brigada-healthline",
    category: "experience",
    content: "Jonald served as the front-end developer for the manufacturing website, Brigada Healthline, ensuring a seamless, user-friendly interface."
  },
  {
    id: "work-brigada-design",
    category: "experience",
    content: "At Brigada Group, Jonald proposed and created graphic designs for websites and internal systems, including logos and visual assets, enhancing brand identity and user experience."
  },

  // ========== CREATIVE CONTENT SPECIALIST (March 2023 - May 2024) ==========
  {
    id: "work-pr-website",
    category: "experience",
    content: "From March 2023 to May 2024, Jonald worked as a Creative Content Specialist in Corporate Public Relations at Brigada Group. He led the end-to-end development and maintenance of the corporate website www.brigadagroup.ph, including layout structure, content integration, and feature implementation."
  },
  {
    id: "work-pr-features",
    category: "experience",
    content: "As Creative Content Specialist, Jonald developed interactive and content-driven web features to support corporate announcements, brand campaigns, and public relations initiatives at Brigada Group."
  },
  {
    id: "work-pr-collaboration",
    category: "experience",
    content: "Jonald collaborated with PR, marketing, and production teams to translate communication strategies into effective digital content, producing and editing multimedia assets used across corporate platforms."
  },
  {
    id: "work-pr-engagement",
    category: "experience",
    content: "In his PR role, Jonald assisted in improving online visibility and audience engagement through structured content presentation and website updates, ensuring timely publication and consistency with brand standards."
  },

  // ========== VIDEO EDITOR CONTRACTUAL (October 2022 - March 2023) ==========
  {
    id: "work-video-editor-brigada",
    category: "experience",
    content: "From October 2022 to March 2023, Jonald worked as a Contractual Video Editor at Brigada Mass Media Corporation. He skillfully crafted the Edited Opening Bumper, infused humor into the Kulitan Kabrigada segments, and created compelling teasers for Brigada Tanghali Saya—a vibrant noon-time show."
  },

  // ========== INTERNSHIPS ==========
  {
    id: "internship-goldenstate",
    category: "experience",
    content: "From August to December 2021, Jonald completed an IT Internship at Goldenstate College of Koronadal, Inc. He designed and developed a responsive website for an educational IT tutorial, collaborated with team members in planning and implementation, and edited raw videos, screen recordings, animations, sounds, and graphics using Adobe Premiere Pro. He also created a teaser video for Virtramurals 2021."
  },
  {
    id: "internship-s1-digital",
    category: "experience",
    content: "From August to December 2021, Jonald completed a Virtual IT Internship at S1 Digital Marketing. He completed training on WordPress web design basics and created a mockup web design for Block8D (www.block8d.online), a sister company of S1. He collaborated with trainees from diverse fields including Accounting, Marketing, and Graphic Design to formulate effective digital marketing strategies."
  },
  {
    id: "internship-s1-training",
    category: "experience",
    content: "During his S1 Digital Marketing internship, Jonald undertook online training from Udemy, HubSpot Academy, and Google Marketing under the guidance of a mentor. He also implemented Chatbot integration on Facebook and websites using HybeChat and ManyChat, enhancing interactive communication channels."
  },

  // ========== FREELANCE WORK ==========
  {
    id: "freelance-video-editing",
    category: "experience",
    content: "From June 2016 to August 2022, Jonald worked as a Freelance Video Editor. He edited a short documentary film that secured 3rd place in the SINEDOKYU: Mobile Documentary Film Competition 2021 using Adobe Premiere Pro. His responsibilities included trimming film segments, incorporating graphics, sound effects, transitions, and visual colors to enhance the viewing experience."
  },
  {
    id: "freelance-graphic-design",
    category: "experience",
    content: "From August 2016 to August 2022, Jonald worked as a Freelance Graphic Designer. He created a mockup logo for Philippine Tourism and a logo for a personal brand and portfolio. He designed invitation cards for a radio station and various events, including debuts and engagements, utilizing professional graphic design tools such as Adobe Illustrator, Photoshop, and Canva."
  },

  // ========== PROJECTS ==========
  {
    id: "project-delightful-analytics",
    category: "project",
    content: "Delightful Analytics is a comprehensive analytics platform Jonald built as Lead Developer and Frontend Development. It tracks performance of Delightful.ph and ai.delightful.ph, integrating Google Analytics, n8n automation, SerpAPI for SEO tracking, and multiple APIs."
  },
  {
    id: "project-ota",
    category: "project",
    content: "Jonald developed an Online Travel Agency Website, a comprehensive platform for travel bookings and tourism services under Brigada's tourism-focused company."
  },
  {
    id: "project-tour-operator",
    category: "project",
    content: "The Tour Operator Management System is a project Jonald led that streamlines booking, operations, and administrative workflows for tour operators at Brigada Group."
  },
  {
    id: "project-bls",
    category: "project",
    content: "Brigada Learning System (BLS) is an interactive Learning Management System (LMS) Jonald built using CodeIgniter 3, Ajax, and JavaScript for employee education and training at Brigada Group, with plans to scale for all employees."
  },
  {
    id: "project-golf",
    category: "project",
    content: "Jonald led the development of the Brigada Golf Range platform with an enhanced security system for reservation management, administration of golf facilities, and improved operational safety and access control."
  },
  {
    id: "project-bpd",
    category: "project",
    content: "BPD Systems Portal is a centralized internal process management hub Jonald developed for streamlining business operations at Brigada Group."
  },
  {
    id: "project-ai-travel-delai",
    category: "project",
    content: "The AI Travel Companion 'Delai' is an intelligent AI-powered travel assistant Jonald led the development of using n8n automation for Delightful Philippines. This project won the Innovation Award at Top Executive Congress 2025 and was built in collaboration with a cross-functional development team."
  },
  {
    id: "project-brigada-healthline",
    category: "project",
    content: "Brigada Healthline is a manufacturing website where Jonald served as the front-end developer, ensuring a seamless, user-friendly interface."
  },
  {
    id: "project-file-upload",
    category: "project",
    content: "Jonald designed and launched a File Upload Website to streamline the collection and management of exclusive images and videos showcasing Philippine destinations for Brigada Group's tourism initiatives."
  },
  {
    id: "project-brigadagroup-website",
    category: "project",
    content: "Jonald led the end-to-end development and maintenance of the corporate website www.brigadagroup.ph, including layout structure, content integration, feature implementation, and interactive web features for corporate announcements and brand campaigns."
  },

  // ========== HIRING & AVAILABILITY ==========
  {
    id: "hiring-availability",
    category: "hiring",
    content: "Jonald is available for freelance projects and collaborations. He works on Web App Development, AI Automation projects, and Full Stack development. Contact him via email at jonaldpenpillo@gmail.com or phone at +63 9107678246 to discuss your project."
  },
  {
    id: "hiring-services",
    category: "hiring",
    content: "Jonald offers services in Full-Stack Web Development, AI Chatbot Integration, Workflow Automation with n8n, Custom Software Solutions, UX/UI Design, Video Editing, and Graphic Design. He can build web apps, automate business processes, and integrate AI into existing systems."
  },

  // ========== AI ASSISTANT & VOICE INTERFACE (Portfolio Feature) ==========
  {
    id: "project-ai-assistant-overview",
    category: "project",
    content: "Jonald built an AI-powered chat assistant (System Concierge) embedded directly into this portfolio website. It uses a custom RAG (Retrieval-Augmented Generation) pipeline to answer questions about Jonald's skills, projects, and experience. The assistant also features a real-time Voice Interface with speech-to-text and text-to-speech capabilities."
  },
  {
    id: "project-ai-assistant-rag",
    category: "project",
    content: "The AI assistant's RAG system uses client-side vector embeddings (256-dimensional) with cosine similarity search. Knowledge is organized into semantic chunks covering Jonald's profile, projects, skills, and experience. Embeddings are pre-computed and stored as static JSON, enabling instant semantic search without external API calls. The LLM backend is DeepSeek API (deepseek-chat model) which receives the retrieved context to generate accurate, grounded responses."
  },
  {
    id: "project-ai-assistant-voice",
    category: "project",
    content: "The Voice Interface uses AssemblyAI's real-time streaming API over WebSocket for speech-to-text transcription. Audio is captured from the browser microphone, encoded as PCM16 at 16kHz sample rate, and streamed to AssemblyAI for live transcription. For text-to-speech, the Web Speech Synthesis API reads AI responses aloud. The interaction is tap-to-talk: tap the orb to start listening, tap again to send the transcript as a message."
  },
  {
    id: "project-ai-assistant-stack",
    category: "project",
    content: "The AI Assistant & Voice Interface tech stack includes: React for the UI component, DeepSeek API for LLM completions, AssemblyAI Streaming API for real-time speech-to-text, Web Speech Synthesis API for text-to-speech, Framer Motion for animations (pulse rings, waveform visualizer, transcript transitions), Tailwind CSS for styling with dual-theme support (light mode and blueprint mode), Lucide React for icons, and React Markdown for rendering formatted AI responses."
  },
  {
    id: "project-ai-assistant-security",
    category: "project",
    content: "The AI assistant includes multiple security layers: prompt injection detection (blocks attempts to extract system instructions), jailbreak prevention (blocks persona/roleplay attacks like DAN), SQL/code injection filtering, input validation with a gibberish detector (checks consonant runs, vowel ratios, character diversity), and rate limiting (100 messages per 4-hour window). The system prompt enforces strict scope rules so the AI only answers questions about Jonald."
  },
  {
    id: "project-ai-assistant-process",
    category: "project",
    content: "The development process for the AI assistant involved: (1) Designing the knowledge base with semantic chunking of Jonald's professional data, (2) Building a client-side embedding engine using word-level and character trigram features, (3) Pre-computing 256-dimensional vector embeddings and storing them as static JSON, (4) Integrating DeepSeek API with a RAG-augmented system prompt, (5) Adding security guardrails and input validation, (6) Building the voice pipeline with AssemblyAI WebSocket streaming and browser TTS, (7) Designing the UI with a minimalist orb interface, waveform visualizer, and live transcript display."
  },
  {
    id: "project-ai-assistant-features",
    category: "project",
    content: "Key features of the AI assistant include: chat mode with markdown-rendered responses, voice mode with real-time waveform visualization, UI command system that can open projects and navigate to sections (e.g. [cmd:open-project:PROJECT_TITLE] and [cmd:scroll-to:SECTION_ID]), quick reply suggestions, dual-theme support (light mode and blueprint/dark mode), mobile-responsive design, and a promotional bubble to invite users to try the assistant."
  },

  // ========== PORTFOLIO WEBSITE ==========
  {
    id: "portfolio-tech",
    category: "portfolio",
    content: "This portfolio website was built by Jonald using React, Vite, Tailwind CSS, and Framer Motion. It features a custom AI assistant (System Concierge) powered by DeepSeek with a RAG pipeline, real-time voice interaction via AssemblyAI, smooth animations, blueprint mode toggle, responsive design, and is deployed on Vercel at https://penpillo-portfolio.vercel.app/"
  },
  {
    id: "portfolio-sections",
    category: "portfolio",
    content: "The portfolio has sections for Projects ([View Portfolio](/#section-projects)), About ([Read Manifesto](/#section-about)), Experience ([View Experience](/#section-experience)), Process ([See Process](/#section-process)), and Contact ([Contact Me](/#section-contact))."
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
