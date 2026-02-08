import React from "react";
import { motion } from "framer-motion";
import { useUI } from "../context/UIContext";

const skills = [
  { name: "Frontend", tools: ["React", "Next.js", "TypeScript", "TailwindCSS"] },
  { name: "Backend", tools: ["Node.js", "Python", "Supabase", "PostgreSQL"] },
  { name: "Motion", tools: ["Framer Motion", "WebGL", "Three.js", "GSAP"] },
  { name: "Intelligence", tools: ["LangChain", "OpenAI", "RAG Systems", "MCP Agents"] }
];

const TechStack = () => {
  const { themeMode, blueprintMode, themed, playSound } = useUI();

  return (
    <section id="section-tech" className={`py-24 md:py-32 px-4 md:px-8 border-t transition-colors duration-700 ${themed('bg-white border-neutral-100', 'bg-[#0a0a0a] border-neutral-800', 'bg-[#050505] border-blue-900/40', 'bg-[#fdf6e3] border-[#433422]/10')}`}>
      <div className="max-w-7xl mx-auto">
        {/* Consistent Header Style */}
        <div className={`mb-24 flex items-end justify-between border-b pb-10 transition-colors duration-700 ${themed('border-neutral-100', 'border-neutral-800', 'border-blue-900/50', 'border-[#433422]/10')}`}>
          <div>
            <span className={`text-xs font-bold uppercase tracking-widest block mb-4 transition-colors ${themed('text-blue-600', 'text-blue-500', 'text-blue-400', 'text-[#856404]')}`}>Tech Stack</span>
            <h2 className={`text-4xl md:text-5xl font-bold tracking-tight transition-colors duration-700 ${themed('text-neutral-900', 'text-neutral-100', 'text-blue-500', 'text-[#433422]')}`}>Core Infrastructure.</h2>
          </div>
          <p className={`hidden md:block font-medium text-sm transition-colors ${themed('text-neutral-400', 'text-neutral-500', 'text-blue-900/30', 'text-[#433422]/30')}`}>MODERN CAPABILITIES</p>
        </div>

        {/* Clean Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {skills.map((skill, idx) => (
            <motion.div
              key={idx}
              onMouseEnter={() => playSound('hover')}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`space-y-8 p-6 rounded-2xl transition-all ${blueprintMode ? 'blueprint-active-outline' : ''}`}
              data-blueprint-label={`TECH_GRID_0${idx+1}`}
            >
              <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold border transition-colors duration-700 ${themed('bg-neutral-50 border-neutral-100 text-blue-600', 'bg-neutral-900 border-neutral-700 text-neutral-300', 'bg-[#0a0a0a] border-blue-500/30 text-blue-500', 'bg-[#eee8d5] border-[#433422]/10 text-[#856404]')}`}>
                   0{idx + 1}
                 </div>
                  <h3 className={`text-xl font-bold transition-colors duration-700 ${themed('text-neutral-900', 'text-blue-500', 'text-blue-400', 'text-[#433422]')}`}>{skill.name}</h3>
              </div>

              <ul className="space-y-4">
                {skill.tools.map((tool, i) => (
                  <li key={i} className={`flex items-center gap-3 font-medium group cursor-default transition-colors duration-700 ${themed('text-neutral-500', 'text-neutral-400', 'text-blue-400/60', 'text-[#433422]/70')}`}>
                    <div className={`w-1 h-1 rounded-full transition-colors ${themed('bg-neutral-200 group-hover:bg-blue-600', 'bg-neutral-600 group-hover:bg-neutral-300', 'bg-blue-500/40 group-hover:bg-blue-400', 'bg-[#433422]/20 group-hover:bg-[#856404]')}`}></div>
                    {tool}
                  </li>
                ))}
              </ul>

              {blueprintMode && (
                  <div className="pt-4 mt-4 border-t border-blue-900/30">
                      <div className="font-mono text-[8px] text-blue-500/30">MODULE: LOADED</div>
                      <div className="font-mono text-[8px] text-blue-500/30">INTEGRITY: 100</div>
                  </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
