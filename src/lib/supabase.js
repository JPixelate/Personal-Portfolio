import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    })
  : null;

export const supabaseConfig = {
  url: supabaseUrl,
  hasAnonKey: Boolean(supabaseAnonKey)
};

const buildResult = (overrides) => ({
  ok: false,
  configured: isSupabaseConfigured,
  ...supabaseConfig,
  ...overrides
});

export async function checkSupabaseConnection() {
  if (!isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) {
    return buildResult({
      stage: 'config',
      message: 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env'
    });
  }

  try {
    const [healthResponse, settingsResponse] = await Promise.all([
      fetch(`${supabaseUrl}/auth/v1/health`, {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`
        }
      }),
      fetch(`${supabaseUrl}/auth/v1/settings`, {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`
        }
      })
    ]);

    const settingsText = await settingsResponse.text();
    let settingsBody = settingsText;

    try {
      settingsBody = JSON.parse(settingsText);
    } catch {
      // Keep the raw body if the response is not JSON.
    }

    return buildResult({
      ok: healthResponse.ok && settingsResponse.ok,
      stage: healthResponse.ok && settingsResponse.ok ? 'connected' : 'http',
      health: {
        ok: healthResponse.ok,
        status: healthResponse.status
      },
      settings: {
        ok: settingsResponse.ok,
        status: settingsResponse.status,
        body: settingsBody
      },
      message: healthResponse.ok && settingsResponse.ok
        ? 'Supabase is reachable and the anon key is working.'
        : 'Supabase responded, but one of the health checks failed.'
    });
  } catch (error) {
    return buildResult({
      stage: 'network',
      error: error instanceof Error ? error.message : String(error),
      message: 'Could not reach Supabase from the browser.'
    });
  }
}
