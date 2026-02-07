import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// ============================================
// RATE LIMITING CONFIGURATION
// ============================================

// In-memory storage for user chat limits (IP-based)
// Structure: { "IP_ADDRESS": { count: number, resetTime: timestamp } }
const chatLimits = new Map();

const CHATS_PER_WINDOW = 12;
const WINDOW_DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours

/**
 * Check and update rate limit for an IP address
 * Returns: { allowed: boolean, remaining: number, resetTime: timestamp }
 */
function checkRateLimit(ip) {
  const now = Date.now();
  const userLimit = chatLimits.get(ip);

  // No previous record or window expired
  if (!userLimit || now >= userLimit.resetTime) {
    const resetTime = now + WINDOW_DURATION_MS;
    chatLimits.set(ip, { count: 1, resetTime });
    return { allowed: true, remaining: CHATS_PER_WINDOW - 1, resetTime };
  }

  // Within the window
  if (userLimit.count >= CHATS_PER_WINDOW) {
    return { 
      allowed: false, 
      remaining: 0, 
      resetTime: userLimit.resetTime 
    };
  }

  // Increment count
  userLimit.count += 1;
  chatLimits.set(ip, userLimit);

  return { 
    allowed: true, 
    remaining: CHATS_PER_WINDOW - userLimit.count, 
    resetTime: userLimit.resetTime 
  };
}

// General API rate limiter (prevents spam/DDoS)
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: { error: 'Too many requests, please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get client IP address (handles proxies)
 */
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() || 
         req.headers['x-real-ip'] || 
         req.socket.remoteAddress || 
         'unknown';
}

/**
 * Generate embeddings for RAG (using Google Gemini)
 */
async function generateEmbedding(text) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: { parts: [{ text }] }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Embedding API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.embedding.values;
  } catch (error) {
    console.error('Embedding generation error:', error);
    throw error;
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a, b) {
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

// ============================================
// API ENDPOINTS
// ============================================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * Check rate limit status for current user
 */
app.get('/api/chat/limit', (req, res) => {
  const ip = getClientIP(req);
  const now = Date.now();
  const userLimit = chatLimits.get(ip);

  if (!userLimit || now >= userLimit.resetTime) {
    return res.json({
      count: 0,
      limit: CHATS_PER_WINDOW,
      remaining: CHATS_PER_WINDOW,
      resetTime: now + WINDOW_DURATION_MS,
      isLimitReached: false
    });
  }

  res.json({
    count: userLimit.count,
    limit: CHATS_PER_WINDOW,
    remaining: CHATS_PER_WINDOW - userLimit.count,
    resetTime: userLimit.resetTime,
    isLimitReached: userLimit.count >= CHATS_PER_WINDOW
  });
});

/**
 * Build a concise system prompt for the AI
 */
function getSystemPrompt(relevantChunks, userHistory = []) {
  const historyText = userHistory && userHistory.length > 0 
    ? `User viewed: ${userHistory.map(p => p.title).join(', ')}` 
    : 'No history';

  return `You are Jonald Penpillo's portfolio AI.
Date: ${new Date().toDateString()}

Purpose: Answer questions about Jonald's skills, projects, bio, and personal background. 

**RULES:**
- Use ONLY the RETRIEVED CONTEXT. If not there, say you don't know.
- STRICT SCOPE: No general coding/homework help.
- BE CONCISE (2-3 sentences). 
- Always use 3rd person ("He").
- NEVER provide code snippets.
- Use [cmd:...] if found in context and relevant.
- Jonald graduated from Goldenstate College (NOT STI).
- **REAL-TIME CALCULATION:** Use "Date: ${new Date().toDateString()}" to calculate current durations (e.g., how long he has been in a relationship, experience length) from dates given in the context. Do NOT use outdated "hardcoded" duration strings if a start date is available.

**USER CONTEXT:** ${historyText}

**RETRIEVED CONTEXT:**
${relevantChunks || 'No context found.'}`;
}

/**
 * Main AI Chat endpoint (secured with rate limiting)
 */
app.post('/api/chat', async (req, res) => {
  const ip = getClientIP(req);
  const { query, relevantChunks, userHistory } = req.body;

  if (!query || typeof query !== 'string') return res.status(400).json({ error: 'Invalid query' });
  if (query.length > 500) return res.status(400).json({ error: 'Query too long' });

  const limitCheck = checkRateLimit(ip);
  if (!limitCheck.allowed) {
    const timeRemaining = Math.ceil((limitCheck.resetTime - Date.now()) / 1000 / 60);
    return res.status(429).json({ 
      error: 'Limit reached',
      message: `Limit reached. Try again in ${timeRemaining}m.`,
      resetTime: limitCheck.resetTime
    });
  }

  const API_KEY = process.env.DEEPSEEK_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'Service not configured' });

  try {
    const systemPrompt = getSystemPrompt(relevantChunks, userHistory);

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        max_tokens: 150,
        temperature: 0.6
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API failed');
    }

    const data = await response.json();
    res.json({
      response: data.choices[0].message.content,
      usage: data.usage,
      rateLimit: { remaining: limitCheck.remaining, resetTime: limitCheck.resetTime, limit: CHATS_PER_WINDOW }
    });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Chat failed' });
  }
});

/**
 * Streaming AI Chat endpoint
 */
app.post('/api/chat/stream', async (req, res) => {
  const ip = getClientIP(req);
  const { query, relevantChunks, userHistory } = req.body;

  if (!query || typeof query !== 'string') return res.status(400).json({ error: 'Invalid query' });
  const limitCheck = checkRateLimit(ip);
  if (!limitCheck.allowed) return res.status(429).json({ error: 'Limit reached' });

  const API_KEY = process.env.DEEPSEEK_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'Service not configured' });

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  res.write(`event: rateLimit\ndata: ${JSON.stringify({ remaining: limitCheck.remaining, resetTime: limitCheck.resetTime })}\n\n`);

  try {
    const systemPrompt = getSystemPrompt(relevantChunks, userHistory);

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        max_tokens: 150,
        temperature: 0.6,
        stream: true,
        stream_options: { include_usage: true }
      })
    });

    if (!response.ok) {
      res.write(`event: error\ndata: ${JSON.stringify({ message: 'API failed' })}\n\n`);
      return res.end();
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Stream Error:', error);
    res.end();
  }
});

/**
 * Generate temporary token for AssemblyAI (Voice-to-Text)
 * This avoids exposing the master API key to the frontend.
 */
app.get('/api/voice/token', async (req, res) => {
  const ASSEMBLY_KEY = process.env.ASSEMBLYAI_API_KEY;
  if (!ASSEMBLY_KEY) {
    console.error('ASSEMBLYAI_API_KEY environment variable is not set');
    return res.status(500).json({ error: 'Voice service key not configured' });
  }

  try {
    const response = await fetch('https://streaming.assemblyai.com/v3/token?expires_in_seconds=600', {
      method: 'GET',
      headers: {
        'Authorization': ASSEMBLY_KEY
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`AssemblyAI token API error: ${response.status} - ${errorBody}`);
      return res.status(502).json({
        error: 'AssemblyAI rejected the token request',
        status: response.status,
        details: errorBody
      });
    }

    const data = await response.json();
    res.json({ token: data.token });
  } catch (error) {
    console.error('Voice Token Error:', error);
    res.status(500).json({ error: 'Failed to generate voice token', details: error.message });
  }
});

/**
 * Generate embeddings endpoint (for RAG)
 */
app.post('/api/embeddings', async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Invalid text input' });
  }

  try {
    const embedding = await generateEmbedding(text);
    res.json({ embedding });
  } catch (error) {
    console.error('Embedding error:', error);
    res.status(500).json({ error: 'Failed to generate embedding' });
  }
});

/**
 * Custom Quote Request endpoint
 */
app.post('/api/quote', async (req, res) => {
  const { solutionType, budget, timeline, name, email, company, phone, details } = req.body;

  // Basic validation
  if (!name || !email || !details) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content for the admin
    const mailOptions = {
      from: `"Portfolio Quote Bot" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `🚀 New Project Quote Request: ${solutionType}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">New Quote Request</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #f9fafb;">
              <td style="padding: 10px; font-weight: bold; width: 150px;">Architecture:</td>
              <td style="padding: 10px;">${solutionType}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Budget/Investment:</td>
              <td style="padding: 10px;">${budget}</td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 10px; font-weight: bold;">Target Timeline:</td>
              <td style="padding: 10px;">${timeline}</td>
            </tr>
          </table>

          <h3 style="color: #4f46e5; margin-top: 20px;">Contact Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #f9fafb;">
              <td style="padding: 10px; font-weight: bold; width: 150px;">Name:</td>
              <td style="padding: 10px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Email:</td>
              <td style="padding: 10px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 10px; font-weight: bold;">Company:</td>
              <td style="padding: 10px;">${company || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Phone:</td>
              <td style="padding: 10px;">${phone || 'N/A'}</td>
            </tr>
          </table>

          <h3 style="color: #4f46e5; margin-top: 20px;">Technical Objectives / Details</h3>
          <div style="background: #f9fafb; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
            ${details}
          </div>

          <p style="font-size: 12px; color: #6b7280; margin-top: 30px; text-align: center;">
            This email was sent from your portfolio's auto-quote system.
          </p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Quote request sent successfully!' });
  } catch (error) {
    console.error('SMTP Error:', error);
    res.status(500).json({ error: 'Failed to send quote request. Please try again later.' });
  }
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Secure AI Backend running on http://localhost:${PORT}`);
  console.log(`📊 Rate Limit: ${CHATS_PER_WINDOW} messages per ${WINDOW_DURATION_MS / 1000 / 60 / 60} hours`);
  console.log(`🔒 API Key: ${process.env.DEEPSEEK_API_KEY ? '✓ Configured' : '✗ Missing'}`);
});

// Cleanup old rate limit entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of chatLimits.entries()) {
    if (now >= data.resetTime) {
      chatLimits.delete(ip);
    }
  }
  console.log(`🧹 Cleaned up rate limits. Active IPs: ${chatLimits.size}`);
}, 60 * 60 * 1000);
