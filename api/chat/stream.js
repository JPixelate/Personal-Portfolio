import { DEEPSEEK_API_KEY } from '../_config.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, relevantChunks } = req.body;

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Invalid query' });
  }

  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  try {
    const SYSTEM_INSTRUCTION = `
You are the AI Assistant for Jonald Penpillo's portfolio website. Answer questions about Jonald—his skills, projects, and experience.
STRICT SCOPE: Only answer about Jonald. Refuse general programming or unrelated tasks.
BE CONCISE: 2-3 sentences max. Use bullet points for lists (max 3 items).
ALWAYS refer to Jonald in 3rd person. NEVER use 1st person.

### RETRIEVED CONTEXT:
${relevantChunks || 'No specific context retrieved.'}
`;

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_INSTRUCTION },
          { role: 'user', content: query }
        ],
        max_tokens: 200,
        temperature: 0.7,
        stream: true
      })
    });

    if (!response.ok) {
      res.write(`event: error\ndata: ${JSON.stringify({ message: 'DeepSeek API error' })}\n\n`);
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
    console.error('Streaming Chat Error:', error);
    if (!res.writableEnded) {
      res.write(`event: error\ndata: ${JSON.stringify({ message: error.message })}\n\n`);
      res.end();
    }
  }
}
