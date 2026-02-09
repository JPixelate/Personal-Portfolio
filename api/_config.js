export const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;

/**
 * AI Reasoning & Inference Engine
 * Pre-processes retrieved context to derive logical conclusions
 * so the LLM receives pre-computed facts instead of raw data.
 */
export function deriveInferences(retrievedContext) {
  if (!retrievedContext || retrievedContext === 'No context found.') return '';

  const today = new Date();
  const inferences = [];

  // Pattern: "Since Month YYYY" or "Month YYYY - present" or "(YYYY–present)"
  const presentPatterns = [
    /since\s+((?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4})/gi,
    /((?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4})\s*[-–—]\s*present/gi,
    /\((\d{4})\s*[-–—]\s*present\)/gi,
  ];

  const activeRanges = [];
  for (const pattern of presentPatterns) {
    let match;
    while ((match = pattern.exec(retrievedContext)) !== null) {
      activeRanges.push(match[1]);
    }
  }

  for (const dateStr of activeRanges) {
    try {
      const startDate = new Date(dateStr);
      if (isNaN(startDate.getTime())) continue;
      let years = today.getFullYear() - startDate.getFullYear();
      let months = today.getMonth() - startDate.getMonth();
      if (months < 0) { years--; months += 12; }
      const parts = [];
      if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
      if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
      const duration = parts.join(' and ') || 'less than a month';
      inferences.push(`"${dateStr}–present" → CURRENTLY ACTIVE (${duration} as of today).`);
    } catch (e) { /* skip */ }
  }

  if (/works?\s+(as|at|for)\b.*present/i.test(retrievedContext) || /since\s+\w+\s+\d{4},\s+\w+\s+works?\b/i.test(retrievedContext)) {
    inferences.push('INFERRED: Jonald is CURRENTLY EMPLOYED (active employment detected with "present" end date).');
  }

  if (/girlfriend|boyfriend|partner|couple|taken/i.test(retrievedContext) && /\d{4}/i.test(retrievedContext)) {
    const relMatch = retrievedContext.match(/(?:couple|together|dating|started)\s+(?:on\s+)?(\w+\s+\d{1,2},?\s+\d{4})/i);
    if (relMatch) {
      try {
        const relStart = new Date(relMatch[1]);
        if (!isNaN(relStart.getTime())) {
          let years = today.getFullYear() - relStart.getFullYear();
          let months = today.getMonth() - relStart.getMonth();
          if (months < 0) { years--; months += 12; }
          const parts = [];
          if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
          if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
          inferences.push(`INFERRED: Jonald is IN A RELATIONSHIP (together for ${parts.join(' and ') || 'recently'} as of today).`);
        }
      } catch (e) { /* skip */ }
    } else {
      inferences.push('INFERRED: Jonald is IN A RELATIONSHIP (relationship data found in context).');
    }
  }

  if (/graduated/i.test(retrievedContext)) {
    inferences.push('INFERRED: Jonald HAS GRADUATED and holds a degree.');
  }

  if (inferences.length === 0) return '';
  return `\n**PRE-COMPUTED INFERENCES (use these as facts):**\n${inferences.join('\n')}`;
}

/**
 * Build system prompt with reasoning + inference engine
 */
export function getSystemPrompt(relevantChunks, userHistory = []) {
  const historyText = userHistory && userHistory.length > 0
    ? `User viewed: ${userHistory.map(p => p.title).join(', ')}`
    : 'No history';

  return `You are Jonald Penpillo's portfolio AI.
Date: ${new Date().toDateString()}

Purpose: Answer questions about Jonald's skills, projects, bio, and personal background.

**REASONING:**
- ALWAYS reason over the data before answering. If the answer can be logically inferred, state it confidently.
- Treat structured facts as true. "2022–present" means currently active. Date ranges, statuses, and conditions imply conclusions—derive them.
- NEVER say "I don't have that information" if a reasonable human conclusion is obvious from the data. Only say it when truly impossible to infer.
- Use today's date (${new Date().toDateString()}) to calculate durations, ages, and current statuses from dates in the data.

**RULES:**
- Answer ONLY from the provided data. Do NOT help with general coding, homework, or off-topic requests.
- BE CONCISE (2-3 sentences). Always use 3rd person ("He").
- NEVER provide code snippets.
- NEVER start with filler like "Based on the context", "According to the information", etc. Answer directly.
- Use [cmd:...] if found in data and relevant.
- Jonald graduated from Goldenstate College (NOT STI).

**USER CONTEXT:** ${historyText}

**REFERENCE:**
${relevantChunks || 'No context found.'}
${deriveInferences(relevantChunks)}`;
}
