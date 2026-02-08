import React from 'react';
import { motion } from 'framer-motion';
import meAbout from "../assets/images/yubuf.webp";
import { useUI } from "../context/UIContext";

const Manifesto = () => {
  const { themeMode, blueprintMode, isDark, themed, playSound } = useUI();

  return (
    <section
      id="section-about"
      className={`relative w-full py-24 md:py-32 px-4 md:px-8 overflow-hidden transition-colors duration-700 ${themed('bg-white', 'bg-[#0a0a0a]', 'bg-[#050505]', 'bg-[#fdf6e3]')}`}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">

          {/* Manifesto Content */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`text-xs font-bold uppercase tracking-[0.2em] mb-10 transition-colors ${themed('text-blue-600', 'text-blue-500', 'text-blue-400', 'text-[#856404]')}`}
            >
              Philosophy
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`text-2xl md:text-3xl lg:text-4xl font-light leading-[1.3] transition-colors duration-700 ${themed('text-neutral-800', 'text-neutral-300', 'text-blue-400/80', 'text-[#433422]/90')}`}
            >
              "Jonald builds scalable, business-critical systems that <span className={`font-bold italic transition-colors ${themed('text-neutral-900', 'text-blue-500', 'text-blue-400', 'text-[#856404]')}`}>perform</span>. Every workflow is a bridge between
              <span className={`inline-block px-5 py-1.5 border-2 rounded-full mx-3 text-lg lg:text-2xl align-middle font-bold tracking-tight transition-all ${themed('border-blue-600 text-blue-600', 'border-blue-500 text-blue-500', 'border-blue-500 text-blue-500 bg-blue-500/5', 'border-[#856404] text-[#856404] bg-[#856404]/5')}`}>automation</span>
              and human impact."
            </motion.p>

            <motion.div
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.5 }}
               className={`mt-16 grid grid-cols-2 gap-12 border-t pt-16 transition-colors duration-700 ${themed('border-neutral-100', 'border-neutral-800', 'border-blue-900/50', 'border-[#433422]/10')}`}
            >
               <div className={blueprintMode ? 'blueprint-active-outline' : ''} data-blueprint-label="VAL_01">
                  <h4 className={`text-sm font-bold mb-2 uppercase tracking-widest transition-colors ${themed('text-neutral-900', 'text-blue-500', 'text-blue-400', 'text-[#856404]')}`}>Innovation</h4>
                  <p className={`leading-relaxed font-normal transition-colors ${themed('text-neutral-500', 'text-neutral-400', 'text-blue-500/60', 'text-[#433422]/60')}`}>
                     Integrating AI-powered solutions to streamline processes and drive award-winning business growth.
                  </p>
               </div>
               <div className={blueprintMode ? 'blueprint-active-outline' : ''} data-blueprint-label="VAL_02">
                  <h4 className={`text-sm font-bold mb-2 uppercase tracking-widest transition-colors ${themed('text-neutral-900', 'text-blue-500', 'text-blue-400', 'text-[#856404]')}`}>Reliability</h4>
                  <p className={`leading-relaxed font-normal transition-colors ${themed('text-neutral-500', 'text-neutral-400', 'text-blue-500/60', 'text-[#433422]/60')}`}>
                     Architecting robust, maintainable, and secure platforms aligned with strategic business goals.
                  </p>
               </div>
            </motion.div>
          </div>

          {/* Visual Element - Matching the Card Style */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative border transition-all duration-700 ${themed('bg-neutral-50 border-neutral-100 shadow-blue-500/5', 'bg-neutral-900 border-neutral-700 shadow-blue-500/5', 'bg-[#0a0a0a] border-blue-500/30 shadow-blue-500/5', 'bg-[#eee8d5] border-[#433422]/10 shadow-[#433422]/5')}`}
            >
               <img
                src={meAbout}
                alt="Architect"
                className={`w-full h-full object-cover transition-all duration-700 ${blueprintMode ? 'opacity-20 grayscale brightness-50' : (themeMode === 'reading' ? 'sepia-[0.3]' : '')}`}
               />
               <div className={`absolute inset-0 mix-blend-overlay transition-colors ${themed('', 'bg-blue-500/10', 'bg-blue-600/20', 'bg-[#856404]/10')}`}></div>
               {blueprintMode && (
                   <div className="absolute top-6 left-6 font-mono text-[8px] text-blue-500/40 pointer-events-none">
                       <div>ID: MANIFESTO_CARD_01</div>
                       <div>Z_ORDER: 10</div>
                   </div>
               )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Subtle Background Watermark Layer */}
      <div className="absolute top-1/2 left-0 w-full flex justify-center opacity-[0.02] pointer-events-none select-none">
          <h2 className={`text-[30vw] font-black uppercase tracking-tighter transition-colors duration-700 ${themed('text-neutral-900', 'text-neutral-200', 'text-blue-500', 'text-[#433422]')}`}>About</h2>
      </div>
    </section>
  );
};

export default Manifesto;
