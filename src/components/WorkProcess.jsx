import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { X, ArrowRight, CheckCircle2, Activity } from "lucide-react";
import { useUI } from "../context/UIContext";
import automationHero from "../assets/images/automation_hero.webp";

const steps = [
  {
    id: "step-1",
    title: "Strategic Architecture",
    label: "01 / Architecture",
    desc: "Jonald defines high-performance roadmaps and digital frameworks tailored to enterprise goals, with a focus on security and scalability.",
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
    modalContent: {
      headline: "Blueprinting Digital Success",
      details: "His architectural phase focuses on translating business requirements into a robust technical roadmap. He prioritizes modularity and security from day one, ensuring that every line of code serves a long-term purpose.",
      points: ["High-Level System Design", "Database Normalization", "API Contract Definition", "Tech Stack Selection"]
    }
  },
  {
    id: "step-2",
    title: "Precision Engineering",
    label: "02 / Development",
    desc: "Rigorous full-stack implementation using PHP (CodeIgniter) and React. He builds robust management systems and secure industrial platforms.",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    modalContent: {
      headline: "Code That Scales",
      details: "Execution matters. He utilizes modern frameworks and strict coding standards to ensure the codebase is maintainable, testable, and performant under load.",
      points: ["React & TypeScript Frontend", "Secure PHP/Node.js Backend", "CI/CD Pipeline Integration", "Automated Testing"]
    }
  },
  {
    id: "step-3",
    title: "Intelligent Automation",
    label: "03 / Evolution",
    desc: "Jonald scales operations through AI-powered n8n workflows and smart companion applications that drive measurable business innovation.",
    img: automationHero,
    modalContent: {
      headline: "The AI Advantage",
      details: "Beyond code, he integrates intelligence. By embedding AI agents and automated workflows, he transforms static applications into dynamic operational assets that learn and adapt.",
      points: ["n8n Workflow Automation", "Custom LLM Integration", "Process Auto-Scaling", "Real-time Analytics"]
    }
  }
];

const WorkProcess = () => {
  const { themeMode, blueprintMode, isDark, themed, playSound } = useUI();
  const [selectedStep, setSelectedStep] = useState(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <section id="section-process" ref={containerRef} className={`relative transition-colors duration-700 ${themed('bg-white', 'bg-[#0a0a0a]', 'bg-[#050505]', 'bg-[#fdf6e3]')}`}>

      {/* Interactive Logic Lines (SVG Background) */}
      <div className="absolute inset-0 pointer-events-none z-0">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <motion.path
                d="M 20 10 Q 50 20 80 10 T 20 30"
                stroke={themed("#2563eb", "#525252", "#3b82f6", "#856404")}
                strokeWidth="0.05"
                fill="none"
                style={{ pathLength, opacity: 0.1 }}
                className="connector-line"
              />
          </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32 relative z-10">
        {/* Standardized Header - Fixed at Top */}
        <div className={`mb-24 flex items-end justify-between border-b transition-colors duration-700 ${themed('border-neutral-100', 'border-neutral-800', 'border-blue-900/50', 'border-[#433422]/10')}`}>
          <div>
            <span className={`text-xs font-bold uppercase tracking-widest block mb-4 transition-colors ${themed('text-blue-600', 'text-blue-500', 'text-blue-400', 'text-[#856404]')}`}>The Methodology</span>
            <h2 className={`text-4xl md:text-5xl font-bold tracking-tight transition-colors duration-700 ${themed('text-neutral-900', 'text-neutral-100', 'text-blue-500', 'text-[#433422]')}`}>Systematic Growth.</h2>
          </div>
          {blueprintMode && (
              <div className="flex items-center gap-3 text-blue-500 font-mono text-[10px]">
                  <Activity size={14} />
                  <span>PROCESS_FLOW: ACTIVE</span>
              </div>
          )}
          <p className="hidden md:block text-neutral-400 font-medium text-sm">MY WORKFLOW</p>
        </div>

        {/* Vertical Stack - Refined Gaps */}
        <div className="space-y-48 pb-16">
          {steps.map((step, idx) => (
            <ProcessStep
              key={idx}
              step={step}
              index={idx}
              onOpen={() => {
                playSound('click');
                setSelectedStep(step);
              }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedStep && (
          <ProcessModal step={selectedStep} onClose={() => setSelectedStep(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

const ProcessStep = ({ step, index, onOpen }) => {
  const { themeMode, blueprintMode, isDark, themed, playSound } = useUI();
  const stepRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: stepRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <motion.div
      ref={stepRef}
      style={{ opacity, scale }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center"
    >
      {/* Visual Component */}
      <div className={`lg:col-span-6 ${index % 2 === 0 ? 'order-2' : 'order-2 lg:order-1'}`}>
         <div className={`aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 border relative group ${themed('bg-neutral-50 shadow-blue-500/5 border-neutral-100', 'bg-neutral-900 border-neutral-800', 'bg-[#0a0a0a] border-blue-500/30', 'bg-[#eee8d5] border-[#433422]/10')}`}>
            <motion.img
              style={{ y: yImage }}
              src={step.img}
              alt={step.title}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              className={`w-full h-[calc(100%+50px)] object-cover transition-all duration-700 ${blueprintMode ? 'opacity-20 grayscale' : (themeMode === 'reading' ? 'sepia-[0.3] group-hover:sepia-0' : 'grayscale group-hover:grayscale-0')}`}
            />
            <div className={`absolute inset-0 transition-colors ${themed('bg-blue-600/5 mix-blend-overlay', 'bg-blue-500/10', 'bg-blue-600/20 mix-blend-overlay', 'bg-[#856404]/5 mix-blend-multiply')}`}></div>

            {blueprintMode && (
                <div className="absolute top-4 left-4 p-4 font-mono text-[8px] text-blue-500/60 pointer-events-none bg-black/40 backdrop-blur-sm rounded-lg border border-blue-500/20">
                    <div>MODULE_ID: {step.id}</div>
                    <div>STATUS: OPTIMIZED</div>
                </div>
            )}
         </div>
      </div>

      {/* Text Component */}
      <div className={`lg:col-span-6 space-y-8 ${index % 2 === 0 ? 'order-1' : 'order-1 lg:order-2'} ${blueprintMode ? 'blueprint-active-outline' : ''}`} data-blueprint-label={`STEP_${index+1}`}>
        <div className="flex items-center gap-4">
           <span className={`w-12 h-px transition-colors ${themed('bg-blue-600', 'bg-neutral-400', 'bg-blue-500', 'bg-[#856404]')}`}></span>
           <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${themed('text-blue-600', 'text-blue-500', 'text-blue-400', 'text-[#856404]/60')}`}>{step.label}</span>
        </div>

        <h3 className={`text-2xl md:text-3xl font-bold tracking-tight leading-tight transition-colors duration-700 ${themed('text-neutral-900', 'text-neutral-100', 'text-blue-500', 'text-[#433422]')}`}>
          {step.title}
        </h3>

        <p className={`text-xl font-medium leading-relaxed max-w-lg transition-colors duration-700 ${themed('text-neutral-500', 'text-neutral-400', 'text-blue-400/70', 'text-[#433422]/70')}`}>
          {step.desc}
        </p>

        <div className="pt-8">
            <button
              onMouseEnter={() => playSound('hover')}
              onClick={onOpen}
              className="flex items-center gap-4 group"
            >
               <span className={`text-xs font-bold uppercase tracking-widest border-b-2 pb-1 transition-colors pointer-events-auto ${themed('text-neutral-900 border-neutral-900 group-hover:text-blue-600 group-hover:border-blue-600', 'text-blue-500 border-blue-500 group-hover:text-blue-400 group-hover:border-blue-400', 'text-blue-400 border-blue-400 group-hover:text-blue-200 group-hover:border-blue-200', 'text-[#433422] border-[#433422] group-hover:text-[#856404] group-hover:border-[#856404]')}`}>Documentation</span>
               <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${themed('border-neutral-200 group-hover:bg-neutral-900 group-hover:text-white', 'border-neutral-800 text-neutral-400 group-hover:bg-neutral-400 group-hover:text-black', 'border-blue-900 text-blue-400 group-hover:bg-blue-600 group-hover:text-white', 'border-[#433422]/20 text-[#433422] group-hover:bg-[#433422] group-hover:text-[#fdf6e3]')}`}>
                  <ArrowRight size={16} />
               </div>
            </button>
        </div>
      </div>
    </motion.div>
  );
};

const ProcessModal = ({ step, onClose }) => {
  const { themeMode, blueprintMode, isDark, themed, playSound } = useUI();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-neutral-900/60 backdrop-blur-md p-2 sm:p-4"
      onClick={() => {
        playSound('click');
        onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`fixed inset-4 sm:relative sm:inset-auto w-auto sm:w-full sm:max-w-2xl sm:max-h-[85vh] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border transition-colors duration-700 flex flex-col ${themed('bg-white border-neutral-100', 'bg-neutral-900 border-neutral-800 shadow-black/20', 'bg-[#0a0a0a] border-blue-500/30 shadow-blue-500/10', 'bg-[#fdf6e3] border-[#433422]/10 shadow-[#433422]/10')}`}
      >
        <div className="relative h-28 sm:h-48 bg-neutral-100 flex-shrink-0">
           <img
              src={step.img}
              alt={step.title}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-all duration-700 ${blueprintMode ? 'opacity-30 grayscale' : (themeMode === 'reading' ? 'sepia-[0.3]' : '')}`}
           />
           <div className={`absolute inset-0 flex items-end p-4 sm:p-8 bg-gradient-to-t ${themed('from-black/60 to-transparent', 'from-neutral-900/80 to-transparent', 'from-blue-950/80 to-transparent', 'from-[#433422]/60 to-transparent')}`}>
              <div>
                <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1 sm:mb-2 block ${themed('text-white/80', 'text-neutral-400', 'text-blue-400', 'text-[#fdf6e3]/80')}`}>{step.label}</span>
                <h3 className={`text-xl sm:text-3xl font-bold ${themed('text-white', 'text-neutral-100', 'text-blue-500', 'text-[#fdf6e3]')}`}>{step.title}</h3>
              </div>
           </div>
           <button
              onMouseEnter={() => playSound('hover')}
              onClick={() => {
                playSound('click');
                onClose();
              }}
              aria-label="Close process details"
              className="absolute top-3 right-3 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 bg-black/20 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-black/40 transition-colors"
           >
              <X size={18} />
           </button>
        </div>

        <div className="p-4 sm:p-8 md:p-10 overflow-y-auto flex-1 min-h-0">
           <h4 className={`text-base sm:text-xl font-bold mb-2 sm:mb-4 ${themed('text-neutral-900', 'text-neutral-200', 'text-blue-400', 'text-[#433422]')}`}>{step.modalContent.headline}</h4>
           <p className={`text-sm leading-relaxed mb-4 sm:mb-8 ${themed('text-neutral-500', 'text-neutral-400', 'text-blue-500/70', 'text-[#433422]/70')}`}>
              {step.modalContent.details}
           </p>

           <div className="space-y-1.5 sm:space-y-3">
              {step.modalContent.points.map((point, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle2 size={14} className={`flex-shrink-0 sm:w-4 sm:h-4 ${themed("text-blue-600", "text-neutral-400", "text-blue-400", "text-[#856404]")}`} />
                      <span className={`text-xs sm:text-sm font-bold ${themed('text-neutral-700', 'text-neutral-400', 'text-blue-500/80', 'text-[#433422]/80')}`}>{point}</span>
                  </div>
              ))}
           </div>

           <div className={`mt-4 sm:mt-10 pt-4 sm:pt-8 border-t flex justify-end transition-colors ${themed('border-neutral-100', 'border-neutral-800', 'border-blue-900/50', 'border-[#433422]/10')}`}>
              <button
                onMouseEnter={() => playSound('hover')}
                onClick={() => {
                    playSound('click');
                    onClose();
                }}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full transition-all ${themed('bg-neutral-900 text-white hover:bg-blue-600', 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700', 'bg-blue-600 text-white hover:bg-blue-400', 'bg-[#856404] text-[#fdf6e3] hover:bg-[#433422]')}`}
              >
                Close
              </button>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WorkProcess;
