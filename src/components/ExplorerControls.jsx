import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Terminal, Moon, Sun, BookOpen } from 'lucide-react';
import { useUI } from '../context/UIContext';

const ExplorerControls = () => {
  const { themeMode, blueprintMode, setTheme, themed, playSound } = useUI();

  const modes = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'reading', icon: BookOpen, label: 'Reading' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'blueprint', icon: Layers, label: 'Blueprint' },
  ];

  return (
    <div className="fixed bottom-8 left-8 flex flex-col items-center gap-4 z-[100] hidden lg:flex">
      {modes.map((mode) => {
        const isActive = themeMode === mode.id;
        const IconComp = mode.icon;

        return (
          <motion.div
            key={mode.id}
            className="relative group"
          >
            <motion.button
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(mode.id)}
              onMouseEnter={() => playSound('hover')}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl border ${
                isActive 
                  ? mode.id === 'blueprint' 
                    ? 'bg-blue-600 text-white border-blue-400 shadow-blue-500/40' 
                    : mode.id === 'reading'
                      ? 'bg-[#b58900] text-[#fdf6e3] border-[#b58900] shadow-[#b58900]/40'
                      : themed('bg-neutral-900 text-white border-neutral-800', 'bg-white text-neutral-900 border-white', 'bg-blue-600 text-white border-blue-400')
                  : themed(
                      'bg-white text-neutral-400 border-neutral-100 hover:text-neutral-900', 
                      'bg-neutral-900 text-neutral-500 border-neutral-800 hover:text-white', 
                      'bg-[#050505] text-blue-500/50 border-blue-900/30 hover:text-blue-400',
                      'bg-[#fdf6e3] text-[#433422]/40 border-[#433422]/10 hover:text-[#433422]'
                    )
              }`}
              title={mode.label}
            >
              <IconComp size={20} className={isActive && mode.id === 'blueprint' ? 'animate-pulse' : ''} />
              
              {/* Active Indicator Dot */}
              {isActive && (
                <motion.div 
                    layoutId="activeThemeDot"
                    className={`absolute -right-1 top-0 w-3 h-3 rounded-full border-2 ${
                        mode.id === 'blueprint' ? 'bg-blue-400 border-[#050505]' : 
                        mode.id === 'reading' ? 'bg-[#433422] border-[#fdf6e3]' :
                        'bg-green-500 border-white dark:border-[#0a0a0a]'
                    }`}
                />
              )}
            </motion.button>

            {/* Tooltip on hover */}
            <div className={`absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl border transform translate-x-2 group-hover:translate-x-0 ${
              themed(
                'bg-white text-neutral-900 border-neutral-100', 
                'bg-neutral-900 text-white border-neutral-800', 
                'bg-[#050505] text-blue-400 border-blue-500/30', 
                'bg-[#433422] text-[#fdf6e3] border-[#433422]'
              )
            }`}>
              {mode.label}
              <div className={`absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border-l border-b ${
                 themed('bg-white border-neutral-100', 'bg-neutral-900 border-neutral-800', 'bg-[#050505] border-blue-500/30', 'bg-[#433422] border-[#433422]')
              }`}></div>
            </div>
          </motion.div>
        );
      })}

      <AnimatePresence>
        {blueprintMode && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute bottom-60 left-0 bg-[#050505] border border-blue-500/30 p-4 rounded-xl shadow-2xl w-64 pointer-events-none"
          >
            <div className="flex items-center gap-2 mb-3 text-blue-500">
                <Terminal size={14} />
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest">Architecture Viewer</span>
            </div>
            <div className="space-y-3 font-mono text-[9px] text-blue-400/60">
                {/* Tech Stack */}
                <div className="space-y-1">
                    <div className="text-[8px] uppercase tracking-widest opacity-50 mb-1">Tech Stack</div>
                    <div className="flex justify-between">
                        <span>CORE:</span>
                        <span className="text-blue-400">React + Vite</span>
                    </div>
                    <div className="flex justify-between">
                        <span>STYLING:</span>
                        <span className="text-blue-400">Tailwind CSS</span>
                    </div>
                    <div className="flex justify-between">
                        <span>ANIMATION:</span>
                        <span className="text-blue-400">Framer Motion</span>
                    </div>
                </div>

                {/* AI Functions */}
                <div className="space-y-1 pt-2 border-t border-blue-900/30">
                    <div className="text-[8px] uppercase tracking-widest opacity-50 mb-1">AI Functions (DeepSeek)</div>
                    <div className="flex justify-between">
                        <span>MODEL:</span>
                        <span className="text-blue-400">DeepSeek-Chat</span>
                    </div>
                    <div className="flex justify-between">
                        <span>MEMORY:</span>
                        <span className="text-blue-400">Vector Embeddings</span>
                    </div>
                    <div className="flex justify-between">
                        <span>RETRIEVAL:</span>
                        <span className="text-blue-400">Local RAG System</span>
                    </div>
                    <div className="flex justify-between">
                        <span>SECURITY:</span>
                        <span className="text-blue-400">Guardrails API</span>
                    </div>
                </div>

                <div className="w-full h-1 bg-blue-900/30 mt-4 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-full bg-blue-500"
                    />
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExplorerControls;
