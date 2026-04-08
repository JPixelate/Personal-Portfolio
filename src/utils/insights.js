import { Brain, Bot, Code2, Cpu, Globe, Zap } from 'lucide-react';

export const CATEGORY_ICON_MAP = {
  LLM: Brain,
  Multimodal: Globe,
  'Open Source': Code2,
  Agents: Bot,
  'AI Safety': Zap,
  Hardware: Cpu
};

export const COLOR_MAP = {
  indigo: { text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  cyan: { text: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  blue: { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  purple: { text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' }
};

export function mapInsightRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: Array.isArray(row.body) ? row.body : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    category: row.category,
    categoryIcon: CATEGORY_ICON_MAP[row.category] || Brain,
    date: formatInsightDate(row.published_at),
    readTime: row.read_time,
    color: row.color || 'indigo',
    featured: Boolean(row.featured),
    status: row.status,
    source: row.source
  };
}

export function formatInsightDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}
