import { DEEPSEEK_API_KEY } from './_config.js';

// rate limiting in serverless is tricky because memory is volatile
// For a true persistent limit, you'd use Upstash Redis, but for now 
// we'll use a basic implementation.

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, relevantChunks } = req.body;

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API key not configured in Vercel Dashboard' });
  }

  try {
    const SYSTEM_INSTRUCTION = `
You are the AI Assistant for Jonald Penpillo's portfolio website. Answer questions about Jonald—his skills, projects, and experience.
STRICT SCOPE: Only answer about Jonald. Refuse general programming or unrelated tasks.

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
        temperature: 0.7
      })
    });

    const data = await response.json();
    res.status(200).json({ response: data.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ error: 'Failed to process request' });
  }
}
