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

    </div>
  );
};

export default ExplorerControls;
