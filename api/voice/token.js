import { ASSEMBLYAI_API_KEY } from '../_config.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!ASSEMBLYAI_API_KEY) {
    console.error('ASSEMBLYAI_API_KEY environment variable is not set');
    return res.status(500).json({ error: 'Voice service key not configured' });
  }

  try {
    const response = await fetch('https://streaming.assemblyai.com/v3/token?expires_in_seconds=600', {
      method: 'GET',
      headers: {
        'Authorization': ASSEMBLYAI_API_KEY
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
    res.status(200).json({ token: data.token });
  } catch (error) {
    console.error('Voice Token Error:', error);
    res.status(500).json({ error: 'Failed to generate voice token', details: error.message });
  }
}
