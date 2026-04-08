import dotenv from 'dotenv';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabaseAdmin } from './supabaseAdmin.js';

dotenv.config({ path: join(process.cwd(), '.env') });
dotenv.config({ path: join(process.cwd(), '.env.local'), override: true });

const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const TIMEZONE = process.env.INSIGHTS_TIMEZONE || 'Asia/Singapore';
const DAILY_RUN_TIME = process.env.DAILY_INSIGHT_RUN_TIME || '08:00';
const MAX_RETRIES = 3;
const SOURCE_NAME = 'gemini-daily';

const CATEGORY_OPTIONS = ['LLM', 'Multimodal', 'Open Source', 'Agents', 'AI Safety', 'Hardware'];
const COLOR_OPTIONS = ['indigo', 'cyan', 'blue', 'purple'];

function requireConfigured(value, message) {
  if (!value) {
    throw new Error(message);
  }

  return value;
}

function cleanText(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeTimeString(value) {
  const match = String(value || '').trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    return '08:00';
  }

  const hour = Math.min(23, Math.max(0, Number(match[1])));
  const minute = Math.min(59, Math.max(0, Number(match[2])));
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function getZonedClock(date = new Date(), timeZone = TIMEZONE) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(date);

  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: map.year,
    month: map.month,
    day: map.day,
    hour: Number(map.hour),
    minute: Number(map.minute)
  };
}

export function getTodayDateString(timeZone = TIMEZONE) {
  const { year, month, day } = getZonedClock(new Date(), timeZone);
  return `${year}-${month}-${day}`;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function normaliseParagraphs(body) {
  if (Array.isArray(body)) {
    return body.map(cleanText).filter(Boolean);
  }

  if (typeof body === 'string') {
    return body
      .split(/\n+/)
      .map(cleanText)
      .filter(Boolean);
  }

  return [];
}

function estimateReadTime(title, excerpt, body) {
  const text = [title, excerpt, ...(body || [])].join(' ');
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 190));
  return `${minutes} min read`;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function extractJson(text) {
  const cleaned = String(text ?? '').trim();
  const fencedMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const payload = fencedMatch ? fencedMatch[1].trim() : cleaned;
  const start = payload.indexOf('{');
  const end = payload.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Gemini did not return a JSON object.');
  }

  return JSON.parse(payload.slice(start, end + 1));
}

function buildPrompt({ dateString, recentPosts }) {
  const recentSummary = recentPosts.length > 0
    ? recentPosts
        .map((post, index) => `${index + 1}. ${post.title} [${post.category}] - ${cleanText(post.excerpt).slice(0, 120)}`)
        .join('\n')
    : 'No recent posts yet.';

  return [
    'You are writing one daily article for a portfolio insights page named Neural Digest.',
    `Date: ${dateString}`,
    '',
    'Write a fresh, high-signal AI and tech post that feels current and editorial, not generic marketing copy.',
    'Avoid repeating the topics, angles, and wording from recent posts.',
    '',
    `Allowed categories: ${CATEGORY_OPTIONS.join(', ')}`,
    `Allowed colors: ${COLOR_OPTIONS.join(', ')}`,
    '',
    'Return valid JSON only, with these keys:',
    '{',
    '  "title": string,',
    '  "excerpt": string,',
    '  "body": [string, string, string],',
    '  "category": string,',
    '  "color": string,',
    '  "tags": [string, string, string, string],',
    '  "featured": boolean,',
    '  "status": "published",',
    '  "source": "gemini-daily"',
    '}',
    '',
    'Content rules:',
    '- title: 8 to 14 words.',
    '- excerpt: 1 to 2 sentences, under 240 characters if possible.',
    '- body: 3 compact paragraphs, each 1 to 3 sentences.',
    '- tags: lowercase, short, relevant, and non-redundant.',
    '- featured: true.',
    '- status: published.',
    '- source: gemini-daily.',
    '- Do not include markdown fences, numbering, or commentary.',
    '',
    'Recent posts to avoid duplicating:',
    recentSummary
  ].join('\n');
}

function validatePayload(payload) {
  const title = cleanText(payload.title);
  const excerpt = cleanText(payload.excerpt);
  const category = CATEGORY_OPTIONS.includes(payload.category) ? payload.category : 'LLM';
  const color = COLOR_OPTIONS.includes(payload.color) ? payload.color : 'indigo';
  const tags = Array.isArray(payload.tags)
    ? [...new Set(payload.tags.map((tag) => cleanText(tag).toLowerCase()).filter(Boolean))].slice(0, 6)
    : [];
  const body = normaliseParagraphs(payload.body).slice(0, 6);

  if (!title) {
    throw new Error('Generated payload is missing a title.');
  }

  if (!excerpt) {
    throw new Error('Generated payload is missing an excerpt.');
  }

  if (body.length < 3) {
    throw new Error('Generated payload must include at least 3 body paragraphs.');
  }

  if (tags.length < 4) {
    throw new Error('Generated payload must include at least 4 tags.');
  }

  return {
    title,
    excerpt,
    body,
    category,
    color,
    tags,
    featured: Boolean(payload.featured),
    status: 'published',
    source: SOURCE_NAME
  };
}

async function loadRecentPosts(limit = 5) {
  const client = requireConfigured(supabaseAdmin, 'Supabase admin client is not configured.');
  const { data, error } = await client
    .from('insights_posts')
    .select('title, excerpt, category, published_at, slug')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data || [];
}

async function loadExistingGeneration(dateString) {
  const client = requireConfigured(supabaseAdmin, 'Supabase admin client is not configured.');
  const { data, error } = await client
    .from('insight_generation_runs')
    .select('id, generated_for_date, status, post_slug, content_hash, error_message')
    .eq('generated_for_date', dateString)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function saveGenerationRun(client, values) {
  const { error } = await client
    .from('insight_generation_runs')
    .upsert(values, { onConflict: 'generated_for_date' });

  if (error) {
    throw error;
  }
}

async function updateGenerationRun(client, generatedForDate, values) {
  const { error } = await client
    .from('insight_generation_runs')
    .update(values)
    .eq('generated_for_date', generatedForDate);

  if (error) {
    throw error;
  }
}

async function contentHashExists(client, contentHash) {
  const { data, error } = await client
    .from('insights_posts')
    .select('id, slug')
    .eq('content_hash', contentHash)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

async function insertPost(client, post) {
  const { data, error } = await client
    .from('insights_posts')
    .insert(post)
    .select('id, slug, title')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function generatePostPayload({ recentPosts, dateString, attempt }) {
  const apiKey = requireConfigured(process.env.GEMINI_API_KEY?.trim(), 'GEMINI_API_KEY is missing from .env.');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.85,
      topP: 0.95,
      maxOutputTokens: 2500,
      responseMimeType: 'application/json'
    }
  });

  const prompt = buildPrompt({ dateString, recentPosts });
  const retryHint = attempt > 1
    ? `\nThis is attempt ${attempt}. Make the content materially different from prior attempts while staying on theme.`
    : '';

  const result = await model.generateContent(`${prompt}${retryHint}`);
  const response = result.response;
  const primaryText = response?.text?.();
  const resolvedPrimaryText = primaryText && typeof primaryText.then === 'function'
    ? await primaryText
    : primaryText;
  const candidateText = response?.candidates?.[0]?.content?.parts
    ?.map((part) => part?.text ?? '')
    .join('') || '';
  const text = cleanText(resolvedPrimaryText) || cleanText(candidateText);

  if (!text) {
    const finishReason = response?.candidates?.[0]?.finishReason || 'unknown';
    const promptFeedback = response?.promptFeedback ? JSON.stringify(response.promptFeedback) : 'none';
    throw new Error(`Gemini returned no text. finishReason=${finishReason}. promptFeedback=${promptFeedback}`);
  }

  let parsed;
  try {
    parsed = extractJson(text);
  } catch (error) {
    throw new Error(`${error instanceof Error ? error.message : String(error)}\nRaw output:\n${text.slice(0, 2000)}`);
  }

  return {
    prompt: `${prompt}${retryHint}`,
    rawText: text,
    payload: validatePayload(parsed)
  };
}

export async function runDailyInsightGeneration(options = {}) {
  const {
    force = false,
    dryRun = false,
    dateString = getTodayDateString(),
    logger = console
  } = options;

  const client = requireConfigured(
    supabaseAdmin,
    'Supabase admin client is not configured. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
  );

  const existingRun = await loadExistingGeneration(dateString);
  if (existingRun && existingRun.status === 'completed' && !force) {
    return { skipped: true, reason: 'already_completed', postSlug: existingRun.post_slug };
  }

  const existingDailyPost = await client
    .from('insights_posts')
    .select('id, slug, title')
    .eq('published_at', dateString)
    .eq('source', SOURCE_NAME)
    .maybeSingle()
    .then(({ data, error }) => {
      if (error) throw error;
      return data;
    });

  if (existingDailyPost && !force) {
    return { skipped: true, reason: 'already_exists', postSlug: existingDailyPost.slug };
  }

  const recentPosts = await loadRecentPosts();
  const prompt = buildPrompt({
    dateString,
    recentPosts
  });

  await saveGenerationRun(client, {
    generated_for_date: dateString,
    prompt,
    model_name: MODEL_NAME,
    status: 'pending',
    content_hash: null,
    post_slug: null,
    raw_output: null,
    error_message: null
  });

  try {
    let generated = null;
    let contentHash = null;
    let attempt = 1;
    let duplicateFound = false;

    while (attempt <= MAX_RETRIES) {
      generated = await generatePostPayload({
        recentPosts,
        dateString,
        attempt
      });

      const normalized = [
        generated.payload.title,
        generated.payload.excerpt,
        ...generated.payload.body
      ].map(cleanText).join(' | ');
      contentHash = sha256(normalized);

      const duplicateExists = await contentHashExists(client, contentHash);
      if (!duplicateExists || force) {
        duplicateFound = false;
        break;
      }

      duplicateFound = true;
      attempt += 1;
    }

    if (!generated) {
      throw new Error('Gemini did not return a usable payload.');
    }

    if (duplicateFound && !force) {
      throw new Error('Gemini kept generating duplicate content. Try again with --force or adjust the prompt.');
    }

    const finalPayload = generated.payload;
    const post = {
      slug: `${dateString}-${slugify(finalPayload.title)}`,
      title: finalPayload.title,
      excerpt: finalPayload.excerpt,
      body: finalPayload.body,
      tags: finalPayload.tags,
      category: finalPayload.category,
      color: finalPayload.color,
      featured: true,
      read_time: estimateReadTime(finalPayload.title, finalPayload.excerpt, finalPayload.body),
      published_at: dateString,
      status: 'published',
      source: SOURCE_NAME,
      content_hash: contentHash,
      prompt: generated.prompt,
      model_name: MODEL_NAME
    };

    if (dryRun) {
      logger.log(JSON.stringify({ dateString, post }, null, 2));
      await updateGenerationRun(client, dateString, {
        status: 'completed',
        content_hash: contentHash,
        post_slug: post.slug,
        raw_output: { dryRun: true, post },
        error_message: null
      });
      return { dryRun: true, post };
    }

    const inserted = await insertPost(client, post);

    await updateGenerationRun(client, dateString, {
      status: 'completed',
      content_hash: contentHash,
      post_slug: inserted.slug,
      raw_output: { post },
      error_message: null
    });

    return { inserted, post };
  } catch (error) {
    await updateGenerationRun(client, dateString, {
      status: 'failed',
      error_message: error instanceof Error ? error.message : String(error)
    }).catch(() => null);

    throw error;
  }
}

function getRunMinuteCount(timeValue) {
  const normalized = normalizeTimeString(timeValue);
  const [hour, minute] = normalized.split(':').map(Number);
  return hour * 60 + minute;
}

function shouldRunNow(date = new Date(), timeZone = TIMEZONE, runTime = DAILY_RUN_TIME) {
  const { hour, minute } = getZonedClock(date, timeZone);
  const currentMinutes = hour * 60 + minute;
  return currentMinutes >= getRunMinuteCount(runTime);
}

export function startDailyInsightScheduler(options = {}) {
  const enabled = process.env.ENABLE_DAILY_INSIGHT_SCHEDULER !== 'false';
  if (!enabled) {
    return { stop() {} };
  }

  const logger = options.logger || console;
  const timeZone = options.timeZone || TIMEZONE;
  const runTime = normalizeTimeString(options.runTime || DAILY_RUN_TIME);

  let timer = null;
  let running = false;
  let lastRunDate = null;

  async function attemptRun(trigger = 'interval') {
    if (running) {
      return;
    }

    const now = new Date();
    const today = getTodayDateString(timeZone);
    const clock = getZonedClock(now, timeZone);
    const currentMinutes = clock.hour * 60 + clock.minute;
    const targetMinutes = getRunMinuteCount(runTime);

    if (trigger !== 'startup' && currentMinutes < targetMinutes) {
      return;
    }

    if (lastRunDate === today) {
      return;
    }

    running = true;
    try {
      const result = await runDailyInsightGeneration({ dateString: today, logger });
      lastRunDate = today;

      if (result?.skipped) {
        logger.log(`[insights] Daily insight skipped for ${today} (${result.reason}).`);
      } else {
        logger.log(`[insights] Daily insight generated for ${today}.`);
      }
    } catch (error) {
      logger.error('[insights] Daily insight generation failed:', error instanceof Error ? error.stack || error.message : String(error));
    } finally {
      running = false;
    }
  }

  attemptRun('startup').catch(() => null);
  timer = setInterval(() => {
    attemptRun('interval').catch(() => null);
  }, 60 * 1000);

  logger.log(`[insights] Daily scheduler enabled. Time zone: ${timeZone}. Run time: ${runTime}.`);

  return {
    stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
  };
}

export const dailyInsightSchedule = {
  modelName: MODEL_NAME,
  timeZone: TIMEZONE,
  runTime: DAILY_RUN_TIME
};
