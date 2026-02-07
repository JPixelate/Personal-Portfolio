import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Activity, X, ArrowUpRight } from 'lucide-react';
import { useFPS } from '../hooks/useFPS';
import { SOURCE_SNIPPETS } from '../utils/sourceSnippets';
import { useUI } from '../context/UIContext';
import { useNavigate } from 'react-router-dom';

export const ArchitectureViewer = () => {
    const { blueprintMode } = useUI();
    const navigate = useNavigate();

    if (!blueprintMode) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed top-6 left-6 z-[100] hidden lg:flex flex-col gap-3 group"
        >
            <div className="flex items-center gap-3 border border-blue-500/30 bg-blue-500/5 backdrop-blur-sm p-3 rounded-xl shadow-2xl">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                    <Activity size={18} className="text-blue-400" />
                </div>
                <div>
                    <div className="text-[10px] font-mono text-blue-500 uppercase tracking-widest leading-none mb-1">Architecture</div>
                    <div className="text-xs font-bold text-blue-500 flex items-center gap-2">
                        System Overview
                        <button 
                          onClick={() => navigate('/services/web-architecture')}
                          className="hover:text-blue-400 transition-colors"
                        >
                           <ArrowUpRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tech Pills */}
            <div className="flex flex-wrap gap-2 max-w-[240px] px-1">
                {['React', 'Vite', 'RAG', 'DeepSeek'].map(tech => (
                    <span key={tech} className="px-2 py-0.5 border border-blue-500/10 bg-blue-500/5 rounded text-[8px] font-mono text-blue-400/60 uppercase tracking-tighter">
                        {tech}
                    </span>
                ))}
            </div>
        </motion.div>
    );
};

export const BlueprintStats = ({ componentName = "MainApp", bundleSize = '24.8kb', global = false }) => {
  const { blueprintMode } = useUI();
  const fps = useFPS(blueprintMode);
  const [showCode, setShowCode] = useState(false);

  if (!blueprintMode) return null;

  const snippet = SOURCE_SNIPPETS[componentName] || '// No snippet available for this module';

  return (
    <div className={global ? "fixed top-6 right-6 z-[100] hidden lg:block" : "absolute top-2 right-2 z-[60]"}>
      <div className="flex items-center gap-4 border border-blue-500/40 bg-blue-500/5 text-blue-400 px-4 py-2 rounded-xl backdrop-blur-sm shadow-2xl transition-all hover:border-blue-500/60">
         <div className="flex items-center gap-2 border-r border-blue-500/20 pr-3">
            <Activity size={12} className="text-blue-500 animate-pulse" />
            <span className="font-mono text-[10px] font-bold tracking-tighter">{fps} FPS</span>
         </div>
         <div className="flex items-center gap-2 border-r border-blue-500/20 pr-3">
            <span className="font-mono text-[10px] font-bold tracking-tighter">{bundleSize}</span>
         </div>
         <button 
           onClick={(e) => {
             e.stopPropagation();
             setShowCode(true);
           }}
           className="flex items-center gap-1.5 hover:text-white transition-colors group/btn"
         >
            <Code size={12} className="group-hover/btn:scale-110 transition-transform" />
            <span className="font-mono text-[10px] uppercase font-black tracking-widest">Source_Code</span>
         </button>
      </div>

      <AnimatePresence>
        {showCode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
            onClick={() => setShowCode(false)}
          >
            <div 
              className="bg-[#0b0d11] border border-blue-500/20 rounded-2xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-[0_0_100px_rgba(59,130,246,0.15)] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-blue-500/10 bg-[#12141a]">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/30" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
                  </div>
                  <div className="h-4 w-px bg-blue-500/20 mx-2" />
                  <span className="font-mono text-[10px] font-black text-blue-400/80 uppercase tracking-[0.3em]">Module::{componentName}.jsx</span>
                </div>
                <button 
                  onClick={() => setShowCode(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-8 bg-[#0b0d11]">
                <pre className="font-mono text-xs md:text-sm leading-relaxed text-blue-300/80 whitespace-pre-wrap">
                  <code>{snippet}</code>
                </pre>
              </div>
              <div className="p-4 border-t border-blue-500/10 bg-[#12141a] flex justify-between items-center text-[8px] font-mono text-blue-500/40 uppercase tracking-[0.4em]">
                <span>Kernel_Build: 1.0.4-LTS</span>
                <span>Runtime_Active</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
