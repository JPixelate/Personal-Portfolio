import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Database, Loader2, ShieldCheck, Globe } from 'lucide-react';
import { checkSupabaseConnection, supabaseConfig, isSupabaseConfigured } from '../lib/supabase.js';
import { useUI } from '../context/UIContext';
import SEO from '../components/SEO.jsx';

const statusTone = {
  connected: 'text-emerald-500',
  http: 'text-amber-500',
  network: 'text-red-500',
  config: 'text-red-500',
  idle: 'text-neutral-400'
};

const SupabaseCheckPage = () => {
  const { themed } = useUI();
  const [result, setResult] = useState({
    stage: 'idle',
    ok: false,
    message: 'Running checks...'
  });

  useEffect(() => {
    let active = true;

    const runCheck = async () => {
      const response = await checkSupabaseConnection();
      if (active) setResult(response);
    };

    runCheck();

    return () => {
      active = false;
    };
  }, []);

  const isReady = result.stage !== 'idle';
  const tone = statusTone[result.stage] || statusTone.idle;

  return (
    <main className={`min-h-screen px-4 md:px-8 py-24 transition-colors duration-700 ${themed('bg-neutral-50 text-neutral-900', 'bg-neutral-950 text-neutral-100', 'bg-[#050505] text-blue-50', 'bg-[#fdf6e3] text-[#433422]')}`}>
      <SEO
        title="Supabase Check | Jonald Penpillo"
        description="Browser diagnostic page for verifying Supabase environment variables and connectivity."
      />

      <div className="max-w-3xl mx-auto">
        <div className={`rounded-3xl border p-8 md:p-10 shadow-2xl ${themed('bg-white border-neutral-200', 'bg-neutral-900 border-neutral-800', 'bg-[#0a0a0a] border-blue-500/20', 'bg-[#eee8d5] border-[#433422]/10')}`}>
          <div className="flex items-start justify-between gap-6 mb-10">
            <div>
              <p className={`text-[10px] font-black uppercase tracking-[0.35em] mb-4 ${themed('text-neutral-400', 'text-neutral-500', 'text-blue-400', 'text-[#856404]')}`}>
                Supabase Diagnostics
              </p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">Connection Check</h1>
              <p className={`mt-4 text-sm md:text-base max-w-xl ${themed('text-neutral-500', 'text-neutral-400', 'text-blue-200/70', 'text-[#433422]/70')}`}>
                This page verifies that the browser can reach your Supabase project and that the anon key is accepted.
              </p>
            </div>
            <div className={`p-4 rounded-2xl border ${themed('bg-neutral-50 border-neutral-200', 'bg-white/5 border-white/10', 'bg-blue-500/10 border-blue-500/20', 'bg-[#433422]/5 border-[#433422]/10')}`}>
              <Database className={tone} size={28} />
            </div>
          </div>

          <div className={`flex items-center gap-3 mb-8 text-sm font-bold uppercase tracking-wider ${tone}`}>
            {isReady ? (
              result.ok ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />
            ) : (
              <Loader2 size={18} className="animate-spin" />
            )}
            <span>{result.message}</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard
              label="Environment"
              value={isSupabaseConfigured ? 'Configured' : 'Missing'}
              detail={isSupabaseConfigured ? 'Both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are present.' : 'Check your .env values and restart Vite.'}
              ok={isSupabaseConfigured}
            />
            <InfoCard
              label="Project URL"
              value={supabaseConfig.url || 'Not set'}
              detail="This should point to your Supabase project domain."
              ok={Boolean(supabaseConfig.url)}
            />
            <InfoCard
              label="Health Endpoint"
              value={result.health ? `HTTP ${result.health.status}` : 'Pending'}
              detail="Checks /auth/v1/health on the Supabase auth service."
              ok={Boolean(result.health?.ok)}
            />
            <InfoCard
              label="Settings Endpoint"
              value={result.settings ? `HTTP ${result.settings.status}` : 'Pending'}
              detail="Checks /auth/v1/settings with the anon key headers."
              ok={Boolean(result.settings?.ok)}
            />
          </div>

          <div className={`mt-8 rounded-2xl border p-5 md:p-6 ${themed('bg-neutral-50 border-neutral-200', 'bg-black/20 border-white/10', 'bg-blue-500/5 border-blue-500/10', 'bg-[#f8f1dc] border-[#433422]/10')}`}>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={16} className={tone} />
              <span className="text-xs font-black uppercase tracking-[0.3em] opacity-70">Debug Output</span>
            </div>
            <pre className={`whitespace-pre-wrap break-words text-xs md:text-sm leading-relaxed ${themed('text-neutral-600', 'text-neutral-300', 'text-blue-100/80', 'text-[#433422]/80')}`}>
{JSON.stringify(result, null, 2)}
            </pre>
          </div>

          <div className={`mt-8 flex items-center gap-3 text-xs font-medium ${themed('text-neutral-400', 'text-neutral-500', 'text-blue-200/60', 'text-[#433422]/60')}`}>
            <Globe size={14} />
            <span>If this shows connected, your Supabase env setup is good.</span>
          </div>
        </div>
      </div>
    </main>
  );
};

const InfoCard = ({ label, value, detail, ok }) => {
  const { themed } = useUI();

  return (
    <div className={`rounded-2xl border p-5 ${themed('bg-neutral-50 border-neutral-200', 'bg-white/5 border-white/10', 'bg-white/5 border-blue-500/10', 'bg-[#f8f1dc] border-[#433422]/10')}`}>
      <div className="flex items-center justify-between gap-4 mb-3">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">{label}</p>
        <span className={`text-[10px] font-black uppercase tracking-wider ${ok ? 'text-emerald-500' : 'text-red-500'}`}>{ok ? 'OK' : 'Check'}</span>
      </div>
      <p className="text-sm font-bold break-all">{value}</p>
      <p className={`mt-2 text-xs leading-relaxed ${themed('text-neutral-500', 'text-neutral-400', 'text-blue-100/70', 'text-[#433422]/70')}`}>{detail}</p>
    </div>
  );
};

export default SupabaseCheckPage;
