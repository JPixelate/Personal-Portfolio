import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import meHero from "../assets/images/uss52.webp";
import { useUI } from "../context/UIContext";

const Hero = () => {
  const { blueprintMode, playSound } = useUI();
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile to disable scroll animations
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Disable parallax on mobile for better performance
  const yImage = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, 100]);

  return (
    <section
      ref={containerRef}
      id="section-hero"
      className={`relative min-h-screen w-full pt-24 md:pt-0 pb-20 px-4 md:px-8 flex items-center overflow-hidden transition-colors duration-700 ${
        blueprintMode ? 'bg-[#050505]' : 'bg-white'
      }`}
    >
      {/* Prototypical Grid Background */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 transition-opacity duration-700 ${blueprintMode ? 'opacity-40' : 'opacity-100'}`}>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f61a_1px,transparent_1px),linear-gradient(to_bottom,#3b82f61a_1px,transparent_1px)] [background-size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_20%,#000,transparent)]" />
        </div>
        
        {!blueprintMode && (
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_20%,#000,transparent)]" />
        )}

        {!blueprintMode && (
          <>
            {/* Static blobs on mobile, animated on desktop */}
            {isMobile ? (
              <>
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-100/20 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-indigo-100/15 rounded-full blur-[140px]" />
              </>
            ) : (
              <>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.15, 0.3, 0.15],
                    x: [0, 50, 0],
                  }}
                  transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-100/30 rounded-full blur-[140px]"
                />
                <motion.div
                  animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.15, 0.25, 0.15],
                    x: [0, -30, 0],
                  }}
                  transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-indigo-100/20 rounded-full blur-[140px]"
                />
              </>
            )}
          </>
        )}

        {/* Vignette Fades */}
        <div className={`absolute inset-0 transition-colors duration-700 ${blueprintMode ? 'bg-gradient-to-b from-[#050505] via-transparent to-[#050505]' : 'bg-gradient-to-b from-white via-transparent to-white'}`} />
        <div className={`absolute inset-0 transition-colors duration-700 ${blueprintMode ? 'bg-gradient-to-r from-[#050505] via-transparent to-[#050505]' : 'bg-gradient-to-r from-white via-transparent to-white'}`} />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-end">
          
          {/* Main Copy */}
          <div className="lg:col-span-8 order-2 lg:order-1 relative z-10">
             <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={blueprintMode ? "blueprint-active-outline" : ""}
              data-blueprint-label="HERO_COPY"
            >
              <div className="mb-12">
                <span className={`text-xs font-bold uppercase tracking-widest block mb-6 transition-colors ${blueprintMode ? 'text-blue-400' : 'text-blue-600'}`}>Introduction</span>
                <h1 className={`text-5xl sm:text-7xl md:text-8xl lg:text-[110px] font-bold tracking-tight leading-[0.9] mb-12 transition-colors duration-700 ${blueprintMode ? 'text-blue-500' : 'text-neutral-900'}`}>
                  Engineering <br className="hidden sm:block" />
                  Digital Highs<span className="text-blue-600">.</span>
                </h1>
              </div>

              <div className={`flex flex-col md:flex-row gap-12 items-start lg:items-center justify-between border-t pt-12 transition-colors duration-700 ${blueprintMode ? 'border-blue-900/50' : 'border-neutral-100'}`}>
                <p className={`text-xl font-medium max-w-xl leading-relaxed transition-colors duration-700 ${blueprintMode ? 'text-blue-400/80' : 'text-neutral-500'}`}>
                 <span className={`inline-block px-5 py-1.5 border-2 rounded-full mx-3 text-md lg:text-md align-middle font-bold tracking-tight transition-all duration-700 ${blueprintMode ? 'border-blue-500 text-blue-500 bg-blue-500/10' : 'border-blue-600 text-blue-600'}`}>Jonald Penpillo</span> — Full-Stack Web Developer specializing in automated workflows, scalable digital architecture, and high-performance system engineering.
                </p>
                <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span className={`text-sm font-bold uppercase tracking-widest transition-colors duration-700 ${blueprintMode ? 'text-blue-400' : 'text-neutral-900'}`}>Open to Work</span>
                   </div>
                   <span className={`text-xs font-medium transition-colors duration-700 ${blueprintMode ? 'text-blue-900/60' : 'text-neutral-400'}`}>Based in General Santos City, PH</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* High-End Visual Card */}
          <div className="lg:col-span-4 order-1 lg:order-2 mb-20 lg:mb-0 pt-2 lg:pt-0">
             <motion.div
               style={{ y: yImage }}
               initial={false}
               animate={{ opacity: 1, scale: 1 }}
               className="relative group"
             >
                {/* 1. Full Stack - Top Right Offset */}
                <div className={`absolute -top-8 right-0 sm:-top-12 sm:right-12 z-[30] px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl border flex items-center gap-2 sm:gap-3 scale-90 sm:scale-100 whitespace-nowrap transition-all duration-700 ${blueprintMode ? 'bg-[#050505] border-blue-500/50 text-blue-400' : 'bg-white border-neutral-100 text-neutral-900'}` }>
                   <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-blue-600"></div>
                   <div>
                      <span className="text-[10px] sm:text-xs font-bold block leading-tight">Full-Stack Dev</span>
                      <span className={`text-[8px] sm:text-[10px] font-bold transition-colors ${blueprintMode ? 'text-blue-900' : 'text-neutral-400'}`}>React & Modern UI</span>
                   </div>
                </div>

                {/* 2. AI - Left Side */}
                <div className={`absolute top-1/2 -left-2 sm:-top-4 sm:-left-20 z-[30] px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl border flex items-center gap-2 sm:gap-3 scale-90 sm:scale-100 whitespace-nowrap transition-all duration-700 ${blueprintMode ? 'bg-[#050505] border-blue-500/50 text-blue-400' : 'bg-white border-neutral-100 text-neutral-900'}`}>
                   <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-orange-500"></div>
                   <div>
                      <span className="text-[10px] sm:text-xs font-bold block leading-tight">AI Automation</span>
                      <span className={`text-[8px] sm:text-[10px] font-bold transition-colors ${blueprintMode ? 'text-blue-900' : 'text-neutral-400'}`}>n8n & Chatbots</span>
                   </div>
                </div>

                {/* 3. Backend - Right Side Offset */}
                <div className={`absolute top-1/3 -right-2 sm:top-20 sm:-right-8 z-[30] px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl border flex items-center gap-2 sm:gap-3 scale-90 sm:scale-100 whitespace-nowrap transition-all duration-700 ${blueprintMode ? 'bg-[#050505] border-blue-500/50 text-blue-400' : 'bg-white border-neutral-100 text-neutral-900'}`}>
                   <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-indigo-500"></div>
                   <div>
                      <span className="text-[10px] sm:text-xs font-bold block leading-tight">Backend Arch.</span>
                      <span className={`text-[8px] sm:text-[10px] font-bold transition-colors ${blueprintMode ? 'text-blue-900' : 'text-neutral-400'}`}>PHP & Secure Data</span>
                   </div>
                </div>

                <div className={`aspect-[3/5] rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-700 border relative ${blueprintMode ? 'bg-[#0a0a0a] border-blue-500/30' : 'bg-neutral-100 border-neutral-100 shadow-blue-500/10'}`}>
                   <img 
                    src={meHero} 
                    alt="Creative Direction"
                    className={`w-full h-full object-cover transition-all duration-700 ${blueprintMode ? 'opacity-40 grayscale brightness-50' : 'opacity-100'}`}
                   />
                   {/* Blueprint Labels Overlay */}
                   {blueprintMode && (
                     <div className="absolute inset-0 p-4 font-mono text-[8px] text-blue-500/50 pointer-events-none">
                        <div className="border-b border-blue-500/20 mb-1">BOUNDING_BOX: [340 x 560]</div>
                        <div className="border-b border-blue-500/20 mb-1">IMAGE_SOURCE: uss52.webp</div>
                        <div className="border-b border-blue-500/20">TRANSFORM: translateZ(0)</div>
                     </div>
                   )}
                </div>

                {/* Bottom Trigger */}
                <motion.div
                  animate={isMobile ? {} : { y: [0, 10, 0] }}
                  transition={isMobile ? {} : { duration: 3, repeat: Infinity }}
                  onMouseEnter={() => playSound('hover')}
                  onClick={() => {
                    playSound('click');
                    document.getElementById('section-projects')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="absolute -bottom-10 right-10 w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl cursor-pointer pointer-events-auto z-[40] hover:bg-neutral-900 transition-colors"
                >
                   <ArrowDownRight size={32} />
                </motion.div>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
