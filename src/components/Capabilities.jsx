import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useUI } from "../context/UIContext";

const expertise = [
  {
    id: "01",
    title: "AI & Workflow Automation",
    desc: "Architecting intelligent systems using n8n to automate complex business workflows and develop award-winning AI companions.",
    img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "02",
    title: "Full-Stack Architecture",
    desc: "Engineering scalable web platforms with PHP (CodeIgniter), React, and secure backend systems for enterprise operations.",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
  },
  {
    id: "03",
    title: "Integrated Creative Media",
    desc: "Leveraging a background in professional video editing and graphic design to craft immersive digital experiences and brand assets.",
    img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
  }
];

const Capabilities = () => {
  const { themeMode, blueprintMode, isDark, themed, playSound } = useUI();
  const [hoveredIndex, setHoveredIndex] = useState(0);

  return (
    <section id="section-services" className={`py-24 md:py-32 px-4 md:px-8 relative overflow-hidden border-y transition-colors duration-700 ${themed('bg-neutral-50 border-neutral-100/50', 'bg-[#0a0a0a] border-neutral-800', 'bg-[#050505] border-blue-900/30', 'bg-[#eee8d5] border-[#433422]/10')}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">

        {/* Sticky Preview - Desktop */}
        <div className={`hidden lg:block lg:col-span-5 sticky top-32 h-[500px] overflow-hidden rounded-2xl border shadow-sm transition-all duration-700 ${themed('bg-neutral-50 border-neutral-100', 'bg-neutral-900 border-neutral-700', 'bg-[#0a0a0a] border-blue-500/30', 'bg-[#fdf6e3] border-[#433422]/10')}`}>
          <AnimatePresence mode="wait">
            <motion.img
              key={hoveredIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              src={expertise[hoveredIndex].img}
              className={`w-full h-full object-cover transition-all duration-700 ${blueprintMode ? 'opacity-20 grayscale brightness-50' : (themeMode === 'reading' ? 'sepia-[0.3]' : '')}`}
              alt="Expertise preview"
            />
          </AnimatePresence>
          {blueprintMode && (
            <div className="absolute inset-0 p-6 pointer-events-none flex flex-col justify-between">
                <div className="bg-black/60 backdrop-blur-sm p-3 border border-blue-500/20 rounded-lg">
                    <span className="font-mono text-[8px] text-blue-500/60 block">BUFFER_STATE: RENDER_READY</span>
                    <span className="font-mono text-[8px] text-blue-500/60 block">SAMPLING_RATE: 44.1kHz</span>
                </div>
            </div>
          )}
        </div>

        {/* Interactive List */}
        <div className="lg:col-span-7">
          <div className="mb-12 lg:mb-16">
            <h2 className={`text-xs font-bold uppercase tracking-[0.2em] mb-4 transition-colors ${themed('text-blue-600', 'text-blue-500', 'text-blue-400', 'text-[#b58900]')}`}>Core Expertise</h2>
            <h3 className={`text-4xl md:text-5xl font-bold tracking-tight transition-colors duration-700 ${themed('text-neutral-900', 'text-neutral-100', 'text-blue-500', 'text-[#433422]')}`}>Technical Mastery.</h3>
          </div>

          <div className="space-y-8 lg:space-y-4">
            {expertise.map((skill, idx) => (
              <motion.div
                key={idx}
                onMouseEnter={() => {
                    setHoveredIndex(idx);
                    playSound('hover');
                }}
                onClick={() => {
                    setHoveredIndex(idx);
                    playSound('click');
                }}
                className={`group border-b py-6 lg:py-10 lg:cursor-pointer transition-colors duration-700 ${themed('border-neutral-100', 'border-neutral-800', 'border-blue-900/50', 'border-[#433422]/10')} ${blueprintMode ? 'blueprint-active-outline' : ''}`}
                data-blueprint-label={`TECH_NODE: ${skill.id}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                {/* Mobile: Image for each item */}
                <div className={`lg:hidden h-40 mb-4 overflow-hidden rounded-2xl border transition-all duration-700 ${themed('border-neutral-100', 'border-neutral-700', 'border-blue-500/30', 'border-[#433422]/10')}`}>
                  <img
                    src={skill.img}
                    className={`w-full h-full object-cover transition-all duration-700 ${blueprintMode ? 'opacity-20 grayscale brightness-50' : (themeMode === 'reading' ? 'sepia-[0.3]' : '')}`}
                    alt={skill.title}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 lg:gap-8">
                    {/* Numbering hidden on mobile */}
                    <span className={`hidden lg:block text-sm font-bold transition-colors ${themed('text-neutral-300', 'text-neutral-600', 'text-blue-900', 'text-[#433422]/40')}`}>{skill.id}</span>
                    <h4 className={`text-2xl lg:text-4xl font-bold transition-colors duration-500 ${hoveredIndex === idx ? themed("text-blue-600", "text-neutral-200", "text-blue-400", "text-[#b58900]") : themed("text-neutral-900 lg:group-hover:text-blue-600", "text-neutral-300 lg:group-hover:text-neutral-200", "text-blue-900", "text-[#433422] lg:group-hover:text-[#b58900]")}`}>
                      {skill.title}
                    </h4>
                  </div>
                  <ArrowRight className={`hidden lg:block transition-all ${hoveredIndex === idx ? themed("text-blue-600 translate-x-2", "text-blue-500 translate-x-2", "text-blue-400 translate-x-2", "text-[#b58900] translate-x-2") : themed("text-neutral-200 group-hover:text-blue-600 group-hover:translate-x-2", "text-neutral-600 group-hover:text-blue-500 group-hover:translate-x-2", "text-blue-900", "text-[#433422]/20 group-hover:text-[#b58900] group-hover:translate-x-2")}`} />
                </div>

                {/* Mobile: Always visible | Desktop: Expandable on hover */}
                <div className="mt-4 lg:mt-0">
                  {/* Mobile description - always visible */}
                  <p className={`lg:hidden text-sm leading-relaxed font-normal transition-colors duration-700 ${themed('text-neutral-500', 'text-neutral-400', 'text-blue-400/60', 'text-[#433422]/70')}`}>
                    {skill.desc}
                  </p>

                  {/* Desktop description - expandable on hover */}
                  <div className={`hidden lg:block overflow-hidden transition-all duration-500 ${hoveredIndex === idx ? "max-h-32 opacity-100 mt-6" : "max-h-0 opacity-0"}`}>
                    <p className={`leading-relaxed font-normal transition-colors duration-700 ${themed('text-neutral-500', 'text-neutral-400', 'text-blue-400/60', 'text-[#433422]/70')}`}>
                      {skill.desc}
                    </p>
                    {blueprintMode && (
                        <div className="mt-4 font-mono text-[8px] text-blue-500/40">
                            LOG: HANDLER_INVOKED_AT_${Date.now()}
                        </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
