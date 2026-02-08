import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight, Cpu, Moon, BookOpen, Sun, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import resumePdf from "../assets/documents/Resume-of-Jonald_Penpillo.pdf";
import quillLogo from "../assets/images/quill_logo.png";
import { useUI } from "../context/UIContext";

const navLinks = [
  { id: "section-hero", name: "Overview" },
  { id: "section-process", name: "Process" },
  { id: "section-projects", name: "Portfolio" },
  { id: "section-about", name: "Manifesto" },
  { id: "section-experience", name: "Journey" },
  { id: "section-tech", name: "Stack" },
];

const FloatingNavbar = () => {
  const { themeMode, blueprintMode, darkMode, isDark, themed, cycleTheme, playSound } = useUI();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${themed(
          "bg-white py-3 md:py-4",
          "bg-[#0a0a0a]/90 backdrop-blur-md py-3 md:py-4",
          "bg-[#050505]/90 backdrop-blur-md py-3 md:py-4",
          "bg-[#fdf6e3]/90 backdrop-blur-md py-3 md:py-4 border-b border-[#433422]/10"
        )}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between pl-2 lg:pl-0">

          <Link
            onMouseEnter={() => playSound('hover')}
            onClick={() => playSound('click')}
            to="/"
            className="flex-1 lg:flex-none transition-all duration-300 flex items-center group/logo"
          >
            <div className="flex items-center gap-0.5">
              <motion.img
                src={quillLogo}
                alt="Quill"
                className={`h-8 object-contain transition-all duration-500 ${
                  blueprintMode
                    ? '' 
                    : darkMode 
                      ? 'invert brightness-100' 
                      : themeMode === 'reading' 
                        ? 'sepia-[0.5] brightness-[0.9]' 
                        : ''
                }`}
                style={{ 
                  transformOrigin: '50% 100%',
                  filter: blueprintMode ? 'invert(71%) sepia(87%) saturate(1475%) hue-rotate(185deg) brightness(101%) contrast(101%)' : 'none'
                }}
                animate={{
                  rotate: [0, -0.8, 0, 0.6, 0, -0.3, 0],
                  y: [0, -0.5, 0, -0.3, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <span className={`relative z-10 font-logo text-2xl tracking-wide transition-colors duration-500 ${themed('text-neutral-800', 'text-neutral-200', 'text-blue-400', 'text-[#433422]')}`}>
                penpillo.j
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-12">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onMouseEnter={() => playSound('hover')}
                onClick={() => handleNavClick(link.id)}
                className="group relative"
              >
                <span className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${themed(
                  'text-neutral-400 group-hover:text-neutral-900',
                  'text-neutral-400 group-hover:text-white',
                  'text-blue-400 group-hover:text-blue-100',
                  'text-[#433422]/60 group-hover:text-[#433422]'
                )}`}>
                  {link.name}
                </span>
                <span className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-500 group-hover:w-full ${themed('bg-blue-600', 'bg-neutral-400', 'bg-blue-400', 'bg-[#b58900]')}`}></span>
              </button>
            ))}

            <div className={`w-px h-6 mx-2 transition-colors ${themed('bg-neutral-100', 'bg-neutral-700', 'bg-blue-900/50', 'bg-[#433422]/10')}`}></div>

            <a
              onMouseEnter={() => playSound('hover')}
              onClick={() => playSound('click')}
              href={resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] group transition-colors ${themed(
                'text-neutral-900',
                'text-neutral-200 group-hover:text-white',
                'text-blue-400 group-hover:text-blue-100',
                'text-[#433422] group-hover:text-[#b58900]'
              )}`}
            >
               Resume
               <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all transform group-hover:rotate-45 ${themed(
                 'border-neutral-200 group-hover:bg-neutral-900 group-hover:text-white',
                 'border-neutral-600 group-hover:bg-neutral-200 group-hover:text-neutral-900',
                 'border-blue-900 group-hover:bg-blue-600 group-hover:text-white',
                 'border-[#433422]/20 group-hover:bg-[#433422] group-hover:text-[#fdf6e3]'
               )}`}>
                  <ArrowUpRight size={14} />
               </div>
            </a>
          </div>

          {/* Mobile UI */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
               onMouseEnter={() => playSound('hover')}
               onClick={() => cycleTheme()}
               className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${themed(
                 'bg-neutral-100 text-neutral-900',
                 'bg-neutral-800 text-neutral-200',
                 'bg-blue-900/20 text-blue-500',
                 'bg-[#433422]/10 text-[#433422]'
               )}`}
               title="Switch Theme"
            >
               {themeMode === 'light' && <Sun size={20} />}
               {themeMode === 'reading' && <BookOpen size={20} />}
               {themeMode === 'dark' && <Moon size={20} />}
               {themeMode === 'blueprint' && <Layers size={20} className="animate-pulse" />}
            </button>

            <button
              onMouseEnter={() => playSound('hover')}
              onClick={() => {
                  playSound('click');
                  setIsOpen(!isOpen);
              }}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${themed(
                'text-neutral-900 hover:bg-neutral-100',
                'text-neutral-200 hover:bg-neutral-800',
                'text-blue-500 hover:bg-blue-900/20',
                'text-[#433422] hover:bg-[#433422]/10'
              )}`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[120] flex flex-col p-6 sm:p-12 lg:p-24 transition-colors duration-700 ${themed('bg-white', 'bg-[#0a0a0a]', 'bg-[#050505]', 'bg-[#fdf6e3]')}`}
          >
             <div className="flex justify-between items-start mb-12 sm:mb-24">
                 <div className="flex-1"></div>
                 <button
                    onMouseEnter={() => playSound('hover')}
                    onClick={() => {
                        playSound('click');
                        setIsOpen(false);
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${themed(
                      'bg-neutral-50 text-neutral-900',
                      'bg-neutral-800 text-neutral-200',
                      'bg-blue-900/20 text-blue-500',
                      'bg-[#433422]/10 text-[#433422]'
                    )}`}
                 >
                    <X size={24} />
                 </button>
             </div>

             <div className="flex flex-col gap-4 sm:gap-6 overflow-y-auto flex-1">
                {navLinks.map((link, idx) => (
                  <button
                    key={link.id}
                    onMouseEnter={() => playSound('hover')}
                    onClick={() => handleNavClick(link.id)}
                    className={`text-2xl sm:text-4xl lg:text-6xl font-black tracking-tighter uppercase text-left transition-all flex items-end gap-3 group ${themed(
                      'text-neutral-900 hover:text-blue-600',
                      'text-neutral-200 hover:text-white',
                      'text-blue-500 hover:text-blue-100',
                      'text-[#433422] hover:text-[#b58900]'
                    )}`}
                  >
                    <span className={`text-[8px] sm:text-[10px] font-bold mb-1.5 sm:mb-2 transition-colors ${themed(
                      'text-neutral-300 group-hover:text-blue-600',
                      'text-neutral-700 group-hover:text-neutral-300',
                      'text-blue-900/40 group-hover:text-blue-400',
                      'text-[#433422]/20 group-hover:text-[#b58900]'
                    )}`}>0{idx + 1}</span>
                    {link.name}
                  </button>
                ))}

                <div className="mt-8">
                  <a
                    onMouseEnter={() => playSound('hover')}
                    onClick={() => playSound('click')}
                    href={resumePdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-4 px-8 py-4 rounded-full text-sm font-black uppercase tracking-[0.3em] transition-all shadow-xl group ${themed(
                      'bg-neutral-900 text-white shadow-neutral-200 hover:bg-blue-600',
                      'bg-white text-neutral-900 shadow-neutral-950/40 hover:bg-neutral-200',
                      'bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-400',
                      'bg-[#b58900] text-[#fdf6e3] shadow-[#b58900]/20 hover:bg-[#433422]'
                    )}`}
                  >
                    Download Resume
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all group-hover:rotate-45 ${themed(
                      'border-white/20',
                      'border-neutral-900/20',
                      'border-white/20',
                      'border-[#fdf6e3]/20'
                    )}`}>
                      <ArrowUpRight size={16} />
                    </div>
                  </a>
                </div>
             </div>

             <div className={`mt-auto flex flex-col md:flex-row justify-between items-center md:items-end border-t pt-6 sm:pt-12 gap-4 sm:gap-8 transition-colors ${themed('border-neutral-100', 'border-neutral-800', 'border-blue-900/50', 'border-[#433422]/10')}`}>
                <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
                    <a onMouseEnter={() => playSound('hover')} href="https://www.linkedin.com/in/jonald-penpillo" target="_blank" rel="noopener noreferrer" className={`cursor-pointer transition-colors ${themed('text-neutral-400 hover:text-neutral-900', 'text-neutral-500 hover:text-neutral-200', 'text-blue-500/60 hover:text-blue-400', 'text-[#433422]/60 hover:text-[#433422]')}`}>LinkedIn</a>
                    <a onMouseEnter={() => playSound('hover')} href="https://www.instagram.com/h4kuna_11/" target="_blank" rel="noopener noreferrer" className={`cursor-pointer transition-colors ${themed('text-neutral-400 hover:text-neutral-900', 'text-neutral-500 hover:text-neutral-200', 'text-blue-500/60 hover:text-blue-400', 'text-[#433422]/60 hover:text-[#433422]')}`}>Instagram</a>
                </div>
                <p className={`text-[10px] font-bold uppercase tracking-[0.4em] text-center md:text-right transition-colors ${themed('text-neutral-200', 'text-neutral-600', 'text-blue-900', 'text-[#433422]/40')}`}>Architecting Digital Futures</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingNavbar;
