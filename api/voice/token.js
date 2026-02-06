import { ASSEMBLYAI_API_KEY } from '../_config.js';

export default async function handler(req, res) {
  if (!ASSEMBLYAI_API_KEY) {
    return res.status(500).json({ error: 'Voice service key not configured' });
  }

  try {
    const response = await fetch('https://api.assemblyai.com/v2/realtime/token', {
      method: 'POST',
      headers: {
        'Authorization': ASSEMBLYAI_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ expires_in: 3600 })
    });

    if (!response.ok) throw new Error('Failed to generate voice token');
    
    const data = await response.json();
    res.status(200).json({ token: data.token });
  } catch (error) {
    console.error('Voice Token Error:', error);
    res.status(500).json({ error: 'Failed to generate voice token', details: error.message });
  }
}
