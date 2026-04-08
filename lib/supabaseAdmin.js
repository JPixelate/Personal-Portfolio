import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { join } from 'node:path';

dotenv.config({ path: join(process.cwd(), '.env') });
dotenv.config({ path: join(process.cwd(), '.env.local'), override: true });

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      })
    : null;

function requireAdmin() {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client is not configured');
  }
  return supabaseAdmin;
}

export async function listPublishedInsights() {
  const client = requireAdmin();
  return client
    .from('insights_posts')
    .select('id, slug, title, excerpt, body, tags, category, color, featured, read_time, published_at, status, source')
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('published_at', { ascending: false });
}

export async function getPublishedInsight(slug) {
  const client = requireAdmin();
  return client
    .from('insights_posts')
    .select('id, slug, title, excerpt, body, tags, category, color, featured, read_time, published_at, status, source')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
}
