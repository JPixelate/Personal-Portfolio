import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Terminal } from 'lucide-react';
import { useUI } from '../context/UIContext';

const ExplorerControls = () => {
  const { blueprintMode, toggleBlueprint, playSound } = useUI();

  return (
    <div className="fixed bottom-8 left-8 flex-col gap-4 z-[100] hidden lg:flex">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
            toggleBlueprint();
        }}
        onMouseEnter={() => playSound('hover')}
        className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 shadow-xl ${
          blueprintMode 
          ? 'bg-blue-600 border-blue-400 text-white shadow-blue-500/40' 
          : 'bg-white border-neutral-100 text-neutral-500'
        }`}
        title="Toggle Project Blueprint"
      >
        <Layers size={20} className={blueprintMode ? 'animate-pulse' : ''} />
      </motion.button>

      <AnimatePresence>
        {blueprintMode && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute bottom-16 left-0 bg-[#050505] border border-blue-500/30 p-4 rounded-xl shadow-2xl w-64 pointer-events-none"
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
