import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight, Cpu } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import quillLogo from "../assets/images/quill_logo.png";
import resumePdf from "../assets/documents/Resume-of-Jonald_Penpillo.pdf";
import { useUI } from "../context/UIContext";

const navLinks = [
  { id: "section-hero", name: "Overview" },
  { id: "section-services", name: "Expertise" },
  { id: "section-projects", name: "Portfolio" },
  { id: "section-about", name: "Manifesto" },
  { id: "section-experience", name: "Journey" },
  { id: "section-tech", name: "Stack" },
];

const FloatingNavbar = () => {
  const { blueprintMode, playSound } = useUI();
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle Scroll state for padding reduction
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const handleNavClick = (id) => {
    playSound('click');
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      setIsOpen(false);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
      });
      setIsOpen(false);
    } else {
      navigate(`/#${id}`);
      setIsOpen(false);
    }
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          scrolled 
          ? (blueprintMode ? "bg-[#050505]/90 backdrop-blur-md border-b border-blue-900/50 py-4 shadow-lg shadow-blue-500/5" : "bg-white border-b border-neutral-100 py-4 shadow-sm") 
          : "bg-transparent py-8"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <Link 
            onMouseEnter={() => playSound('hover')}
            onClick={() => playSound('click')}
            to="/" 
            className="flex-1 lg:flex-none transition-all duration-300 flex items-center group/logo"
          >
            <motion.img 
              src={quillLogo} 
              alt="Logo" 
              className={`w-10 h-10 object-contain group-hover/logo:rotate-12 transition-all duration-500 -mr-1 ${blueprintMode ? 'invert brightness-50 sepia-[1] hue-rotate-[180deg] saturate-[10]' : ''}`}
              whileHover={{ scale: 1.1 }}
            />
             <div className="flex items-baseline relative">
               <span className={`font-logo text-2xl transition-colors upright-script ${blueprintMode ? 'text-blue-500 group-hover/logo:text-blue-200' : 'text-neutral-900 group-hover/logo:text-blue-600'}`}>penpillo.</span>
               <span className={`font-fancy text-3xl transition-colors upright-script ml-0.5 ${blueprintMode ? 'text-blue-500 group-hover/logo:text-blue-200' : 'text-neutral-900 group-hover/logo:text-blue-600'}`}>j</span>
            </div>
          </Link>

          {/* Clean Typographic Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-12">
            {blueprintMode && (
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full">
                    <Cpu size={12} className="text-blue-400 animate-pulse" />
                    <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest">Blueprint: ON</span>
                </div>
            )}
            {navLinks.map((link) => (
              <button
                key={link.id}
                onMouseEnter={() => playSound('hover')}
                onClick={() => handleNavClick(link.id)}
                className="group relative"
              >
                <span className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${blueprintMode ? 'text-blue-400 group-hover:text-blue-100' : 'text-neutral-400 group-hover:text-neutral-900'}`}>
                  {link.name}
                </span>
                <span className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-500 group-hover:w-full ${blueprintMode ? 'bg-blue-400' : 'bg-blue-600'}`}></span>
              </button>
            ))}
            
            <div className={`w-px h-6 mx-2 transition-colors ${blueprintMode ? 'bg-blue-900/50' : 'bg-neutral-100'}`}></div>
            
            <a 
              onMouseEnter={() => playSound('hover')}
              onClick={() => playSound('click')}
              href={resumePdf} 
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] group transition-colors ${blueprintMode ? 'text-blue-400 group-hover:text-blue-100' : 'text-neutral-900'}`}
            >
               Resume
               <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all transform group-hover:rotate-45 ${blueprintMode ? 'border-blue-900 group-hover:bg-blue-600 group-hover:text-white' : 'border-neutral-200 group-hover:bg-neutral-900 group-hover:text-white'}`}>
                  <ArrowUpRight size={14} />
               </div>
            </a>
          </div>

          {/* Mobile UI */}
          <button
            onMouseEnter={() => playSound('hover')}
            onClick={() => {
                playSound('click');
                setIsOpen(!isOpen);
            }}
            className={`lg:hidden w-10 h-10 flex items-center justify-center transition-colors ${blueprintMode ? 'text-blue-500 hover:text-blue-300' : 'text-neutral-900'}`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Clean Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[120] flex flex-col p-12 lg:p-24 transition-colors duration-700 ${blueprintMode ? 'bg-[#050505]' : 'bg-white'}`}
          >
             <div className="flex justify-between items-start mb-24">
                 <div className="flex-1"></div>
                 <button 
                    onMouseEnter={() => playSound('hover')}
                    onClick={() => {
                        playSound('click');
                        setIsOpen(false);
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${blueprintMode ? 'bg-blue-900/20 text-blue-500' : 'bg-neutral-50 text-neutral-900'}`}
                 >
                    <X size={24} />
                 </button>
             </div>

             <div className="flex flex-col gap-6">
                {navLinks.map((link, idx) => (
                  <button
                    key={link.id}
                    onMouseEnter={() => playSound('hover')}
                    onClick={() => handleNavClick(link.id)}
                    className={`text-6xl sm:text-8xl font-black tracking-tighter uppercase text-left transition-all flex items-end gap-6 group ${blueprintMode ? 'text-blue-500 hover:text-blue-100' : 'text-neutral-900 hover:text-blue-600'}`}
                  >
                    <span className={`text-xs font-bold mb-4 transition-colors ${blueprintMode ? 'text-blue-900 group-hover:text-blue-400' : 'text-neutral-200 group-hover:text-blue-600'}`}>0{idx + 1}</span>
                    {link.name}
                  </button>
                ))}
             </div>
             
             <div className={`mt-auto flex flex-col md:flex-row justify-between items-center md:items-end border-t pt-12 gap-8 transition-colors ${blueprintMode ? 'border-blue-900/50' : 'border-neutral-100'}`}>
                <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
                    <a onMouseEnter={() => playSound('hover')} href="https://www.linkedin.com/in/jonald-penpillo" target="_blank" rel="noopener noreferrer" className={`cursor-pointer transition-colors ${blueprintMode ? 'text-blue-500/60 hover:text-blue-400' : 'text-neutral-400 hover:text-neutral-900'}`}>LinkedIn</a>
                    <a onMouseEnter={() => playSound('hover')} href="https://www.instagram.com/h4kuna_11/" target="_blank" rel="noopener noreferrer" className={`cursor-pointer transition-colors ${blueprintMode ? 'text-blue-500/60 hover:text-blue-400' : 'text-neutral-400 hover:text-neutral-900'}`}>Instagram</a>
                </div>
                <p className={`text-[10px] font-bold uppercase tracking-[0.4em] text-center md:text-right transition-colors ${blueprintMode ? 'text-blue-900' : 'text-neutral-200'}`}>Architecting Digital Futures</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingNavbar;
