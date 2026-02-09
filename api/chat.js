import { DEEPSEEK_API_KEY, getSystemPrompt } from './_config.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, relevantChunks, userHistory } = req.body;

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API key not configured in Vercel Dashboard' });
  }

  try {
    const systemPrompt = getSystemPrompt(relevantChunks, userHistory);

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
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
