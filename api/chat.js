import { DEEPSEEK_API_KEY } from './_config.js';

// rate limiting in serverless is tricky because memory is volatile
// For a true persistent limit, you'd use Upstash Redis, but for now 
// we'll use a basic implementation.

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, relevantChunks, userHistory } = req.body;

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API key not configured in Vercel Dashboard' });
  }

  try {
    const historyText = userHistory && userHistory.length > 0 
      ? `User viewed: ${userHistory.map(p => p.title).join(', ')}` 
      : 'No history';

    const SYSTEM_INSTRUCTION = `You are Jonald Penpillo's portfolio AI.
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

**USER CONTEXT:** ${historyText}

**RETRIEVED CONTEXT:**
${relevantChunks || 'No context found.'}`;

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
        temperature: 0.7
      })
    });

    const data = await response.json();
    res.status(200).json({ 
      response: data.choices[0].message.content,
      usage: data.usage
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Failed to process request', details: error.message });
  }
}
