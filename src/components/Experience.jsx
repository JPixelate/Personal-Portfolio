import React from "react";
import { motion } from "framer-motion";
import { useUI } from "../context/UIContext";

const experiences = [
  {
    year: "2024 — Present",
    role: "Full-Stack Software Developer",
    company: "Brigada Group | Quality Management",
    description: "Developing intelligent AI-powered solutions, Tour Operator Management Systems, and secure enterprise platforms. Awarded the Innovation Award 2025 for AI companion development."
  },
  {
    year: "2023 — 2024",
    role: "Creative Content Specialist",
    company: "Brigada Group | Corporate PR",
    description: "Led the development and digital maintenance of the primary corporate architecture (brigadagroup.ph) and integrated content-driven web features for marketing campaigns."
  },
  {
    year: "2022 — 2023",
    role: "Video Editor & Creative Media",
    company: "Brigada Mass Media Corp",
    description: "Produced high-impact visual content and brand bumpers for broadcasting platforms, focusing on audience engagement and entertainment value."
  },
  {
    year: "2021 — 2022",
    role: "IT Intern & Web Specialist",
    company: "S1 Marketing / Goldenstate",
    description: "Spearheaded responsive web prototypes and chatbot integrations while mastering WordPress architecture and digital marketing strategies."
  }
];

const Experience = () => {
  const { themeMode, blueprintMode, themed, playSound } = useUI();

  return (
    <section id="section-experience" className={`py-24 md:py-32 px-4 md:px-8 border-y transition-colors duration-700 ${themed('bg-neutral-50 border-neutral-100/50', 'bg-[#0a0a0a] border-neutral-800', 'bg-[#050505] border-blue-900/30', 'bg-[#eee8d5] border-[#433422]/10')}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

          <div className="lg:col-span-4">
             <span className={`text-xs font-bold uppercase tracking-widest block mb-4 transition-colors ${themed('text-blue-600', 'text-blue-500', 'text-blue-400', 'text-[#b58900]')}`}>The Journey</span>
             <h2 className={`text-4xl md:text-5xl font-bold tracking-tight mb-8 transition-colors duration-700 ${themed('text-neutral-900', 'text-neutral-100', 'text-blue-500', 'text-[#433422]')}`}>Professional History.</h2>
             <p className={`max-w-xs leading-relaxed transition-colors duration-700 ${themed('text-neutral-500', 'text-neutral-400', 'text-blue-400/60', 'text-[#433422]/60')}`}>
                A timeline of my professional growth and the companies I've helped succeed.
             </p>
             {blueprintMode && (
                 <div className="mt-8 font-mono text-[8px] text-blue-500/40 p-4 border border-blue-500/20 rounded-lg">
                    <div>DB_ID: XP_RELATIONAL_01</div>
                    <div>FETCH_DELAY: 12ms</div>
                 </div>
             )}
          </div>

          <div className="lg:col-span-8">
            <div className="space-y-16">
              {experiences.map((exp, idx) => (
                <motion.div
                  key={idx}
                  onMouseEnter={() => playSound('hover')}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group flex flex-col md:flex-row items-start gap-8 border-b pb-16 last:border-0 transition-colors duration-700 ${themed('border-neutral-100', 'border-neutral-800', 'border-blue-900/40', 'border-[#433422]/10')} ${blueprintMode ? 'blueprint-active-outline' : ''}`}
                  data-blueprint-label={`XP_NODE_${idx+1}`}
                >
                  <span className={`text-sm font-bold w-32 shrink-0 transition-colors ${themed('text-neutral-400', 'text-neutral-500', 'text-blue-900', 'text-[#433422]/40')}`}>{exp.year}</span>
                  <div>
                    <h3 className={`text-3xl font-bold mb-2 transition-colors duration-500 ${themed('text-neutral-900 group-hover:text-blue-600', 'text-neutral-200 group-hover:text-blue-500', 'text-blue-400 group-hover:text-blue-200', 'text-[#433422] group-hover:text-[#b58900]')}`}>{exp.role}</h3>
                    <p className={`text-sm font-bold uppercase tracking-widest mb-6 transition-colors ${themed('text-neutral-400', 'text-neutral-500', 'text-blue-500/50', 'text-[#b58900]/50')}`}>{exp.company}</p>
                    <p className={`text-lg leading-relaxed font-normal transition-colors duration-700 ${themed('text-neutral-500', 'text-neutral-400', 'text-blue-400/70', 'text-[#433422]/80')}`}>{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Experience;
