import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { supabaseAdmin } from '../lib/supabaseAdmin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_URL = 'https://penpillo-portfolio.vercel.app';
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

async function loadPublishedInsightSlugs() {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client is not configured. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }

  const { data, error } = await supabaseAdmin
    .from('insights_posts')
    .select('slug, published_at, updated_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

function formatDate(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function buildSitemap(posts) {
  const staticUrls = [
    { loc: '/', lastmod: '2026-04-07', changefreq: 'weekly', priority: '1.0' },
    { loc: '/process', lastmod: '2026-04-07', changefreq: 'monthly', priority: '0.8' },
    { loc: '/about', lastmod: '2026-04-07', changefreq: 'monthly', priority: '0.8' },
    { loc: '/deploy', lastmod: '2026-04-07', changefreq: 'monthly', priority: '0.5' },
    { loc: '/services/web-architecture', lastmod: '2026-04-07', changefreq: 'monthly', priority: '0.7' },
    { loc: '/services/ai-automation', lastmod: '2026-04-07', changefreq: 'monthly', priority: '0.7' },
    { loc: '/services/mcp-chatbots', lastmod: '2026-04-07', changefreq: 'monthly', priority: '0.7' },
    { loc: '/insights', lastmod: '2026-04-07', changefreq: 'daily', priority: '0.9' }
  ];

  const insightUrls = posts.map((post) => ({
    loc: `/insights/${post.slug}`,
    lastmod: formatDate(post.updated_at || post.published_at),
    changefreq: 'daily',
    priority: post.featured ? '0.85' : '0.75'
  }));

  const entries = [...staticUrls, ...insightUrls];

  const urlXml = entries.map((entry) => (
    `  <url>\n` +
    `    <loc>${ROOT_URL}${entry.loc}</loc>\n` +
    `    <lastmod>${entry.lastmod}</lastmod>\n` +
    `    <changefreq>${entry.changefreq}</changefreq>\n` +
    `    <priority>${entry.priority}</priority>\n` +
    `  </url>`
  )).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urlXml}\n` +
    `</urlset>\n`;
}

async function main() {
  const posts = await loadPublishedInsightSlugs();
  const sitemap = buildSitemap(posts);
  await fs.writeFile(OUTPUT_PATH, sitemap, 'utf8');
  console.log(`Generated sitemap with ${posts.length} insight URLs at ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error('Failed to generate sitemap:');
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
});
