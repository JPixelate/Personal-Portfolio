import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, AlertTriangle } from "lucide-react";

import { PROJECTS } from "../constants/projects";
import { useUI } from "../context/UIContext";

const ProjectGrid = () => {
  const { themeMode, blueprintMode, isDark, themed, trackProjectView } = useUI();
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpenProject = (project) => {
    setSelectedProject(project);
    trackProjectView(project);
  };

  useEffect(() => {
    const handleRemoteOpen = (e) => {
      const projectTitle = e.detail;
      const project = PROJECTS.find(p => p.title === projectTitle);
      if (project) {
        setSelectedProject(project);
        trackProjectView(project);
      }
    };

    window.addEventListener('portfolio:open-project', handleRemoteOpen);
    return () => window.removeEventListener('portfolio:open-project', handleRemoteOpen);
  }, []);

  return (
    <section id="section-projects" className={`py-24 md:py-32 px-4 md:px-8 transition-colors duration-700 ${themed('bg-white border-neutral-100', 'bg-[#0a0a0a] border-neutral-800', 'bg-[#050505] border-blue-900/40', 'bg-[#fdf6e3] border-[#433422]/10')}`}>
      <div className="max-w-7xl mx-auto">
        {/* Standardized Header - Consistent with Section3 */}
        <div className={`mb-24 flex items-end justify-between border-b pb-10 transition-colors duration-700 ${themed('border-neutral-100', 'border-neutral-800', 'border-blue-900/50', 'border-[#433422]/10')}`}>
          <div>
            <span className={`text-xs font-bold uppercase tracking-widest block mb-4 transition-colors ${themed('text-blue-600', 'text-blue-600', 'text-blue-400', 'text-[#b58900]')}`}>Portfolio</span>
            <h2 className={`text-5xl md:text-6xl font-bold tracking-tight transition-colors duration-700 ${themed('text-neutral-900', 'text-neutral-100', 'text-blue-500', 'text-[#433422]')}`}>Selected Works.</h2>
          </div>
          <p className={`hidden md:block font-medium text-sm transition-colors ${themed('text-neutral-400', 'text-neutral-500', 'text-blue-900/40', 'text-[#433422]/30')}`}>(07) CASE STUDIES</p>
        </div>

        {/* Asymmetric Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-20">
          {PROJECTS.map((project, idx) => (
            <ProjectItem
              key={idx}
              project={project}
              index={idx}
              onOpen={() => handleOpenProject(project)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

const ProjectItem = ({ project, index, onOpen }) => {
  const { themeMode, blueprintMode, isDark, themed, playSound } = useUI();
  const isLarge = project.size === "large";

  const colSpanClass = isLarge
    ? "md:col-span-8"
    : "md:col-span-4";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => playSound('hover')}
      onClick={() => {
          playSound('click');
          onOpen();
      }}
      className={`group cursor-pointer flex flex-col gap-6 ${colSpanClass} ${blueprintMode ? 'blueprint-active-outline' : ''}`}
      data-blueprint-label={`PROJECT_UID:${project.id || index}`}
    >
      {/* Image Container */}
      <div className={`overflow-hidden rounded-2xl aspect-[4/3] relative border transition-all duration-700 ${themed('bg-neutral-100 border-neutral-100/50', 'bg-neutral-900 border-neutral-700', 'bg-[#0a0a0a] border-blue-500/30', 'bg-[#eee8d5] border-[#433422]/10')}`}>
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          src={project.thumbnail || project.img}
          alt={project.title}
          className={`w-full h-full object-cover object-top transition-all duration-700 ${blueprintMode ? 'opacity-20 grayscale brightness-50' : (themeMode === 'reading' ? 'sepia-[0.3]' : 'opacity-100')}`}
        />

        {/* Dark Overlay - Always visible on mobile, hover on desktop (Light mode only) */}
        <div className={`absolute inset-0 transition-all duration-300 ${themed('bg-transparent', 'bg-transparent', 'bg-transparent', 'bg-[#433422]/5')}`} />

        {/* Floating Action Button - Always visible on mobile, hover reveal on desktop */}
        <div className={`absolute bottom-4 right-4 md:bottom-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-10 ${themed('bg-white text-neutral-900 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0', 'bg-neutral-800 text-neutral-200 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0', 'bg-blue-600 text-white', 'bg-[#b58900] text-[#fdf6e3] md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0')}`}>
            <ArrowUpRight size={18} className="md:w-5 md:h-5" />
        </div>

        {blueprintMode && (
             <div className="absolute inset-x-0 bottom-0 p-4 font-mono text-[8px] text-blue-500/50 pointer-events-none bg-black/60 backdrop-blur-sm">
                <div>TEX_MAP: {project.thumbnail?.split('/').pop() || 'STATIC_ASSET'}</div>
                <div>RENDER_PASS: PBR_Opaque</div>
             </div>
        )}
      </div>

      {/* Info Block - Below Image for Clean Look */}
      <div className={`flex justify-between items-start border-t pt-6 transition-colors duration-700 ${themed('border-neutral-100', 'border-neutral-800', 'border-blue-900/50', 'border-[#433422]/10')}`}>
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full transition-colors ${themed('bg-blue-600', 'bg-blue-600', 'bg-blue-400', 'bg-[#b58900]')}`}></span>
              <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${themed('text-neutral-500', 'text-neutral-500', 'text-blue-500', 'text-[#433422]/60')}`}>{project.category}</span>
           </div>
           <h3 className={`text-3xl font-bold tracking-tight leading-tight transition-colors duration-300 ${themed('text-neutral-900 group-hover:text-blue-600', 'text-neutral-100 group-hover:text-blue-400', 'text-blue-500 group-hover:text-blue-300', 'text-[#433422] group-hover:text-[#b58900]')}`}>
             {project.title}
           </h3>
        </div>
        <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${themed('text-neutral-300', 'text-neutral-500', 'text-blue-900/40', 'text-[#433422]/20')}`}>{project.year}</span>
      </div>
    </motion.div>
  );
};

const ProjectModal = ({ project, onClose }) => {
  const { themeMode, blueprintMode, isDark, themed, playSound } = useUI();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 md:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className={`w-full max-w-7xl h-[90vh] rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.3)] flex flex-col transition-all duration-700 ${themed('bg-white', 'bg-neutral-900 border border-neutral-800', 'bg-[#050505] border border-blue-500/20', 'bg-[#fdf6e3] border border-[#433422]/10')}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className={`flex items-center justify-between p-6 md:p-8 border-b transition-colors duration-700 z-10 ${themed('border-neutral-100 bg-white', 'border-neutral-800 bg-[#0a0a0a]', 'border-blue-900/30 bg-[#050505]', 'border-[#fdf6e3] bg-[#fdf6e3]')}`}>
           <div className="flex-1">
              <span className={`text-xs font-bold uppercase tracking-widest ${themed('text-neutral-400', 'text-neutral-500', 'text-blue-500/60', 'text-[#433422]/40')}`}>{project.category}</span>
              <h3 className={`text-2xl md:text-3xl font-bold ${themed('text-neutral-900', 'text-neutral-100', 'text-blue-400', 'text-[#433422]')}`}>{project.title}</h3>
              <p className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-md mt-2 ${themed('text-amber-600 bg-amber-50', 'text-amber-500 bg-amber-950/20', 'text-amber-400 bg-amber-900/10', 'text-[#b58900] bg-[#b58900]/10')}`}>
                <AlertTriangle size={14} />
                Portfolio Website is on Staging Environment — Live Demo is unavailable
              </p>
           </div>

           <div className="flex items-center gap-4">
              <span
                className={`hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest cursor-not-allowed transition-colors ${themed('bg-neutral-100 text-neutral-400', 'bg-neutral-900 text-neutral-700', 'bg-blue-950/30 text-blue-900', 'bg-[#eee8d5] text-[#b58900]/30')}`}
              >
                Visit Live Project <ArrowUpRight size={14} />
              </span>
              <button
                onClick={onClose}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all transform hover:rotate-90 ${themed('bg-neutral-100 text-neutral-900 hover:bg-neutral-900 hover:text-white', 'bg-neutral-800 text-neutral-200 hover:bg-white hover:text-black', 'bg-blue-900/20 text-blue-400 hover:bg-blue-600 hover:text-white', 'bg-[#433422]/10 text-[#433422] hover:bg-[#433422] hover:text-[#fdf6e3]')}`}
              >
                <X size={20} />
              </button>
           </div>
        </div>

        {/* Scrollable Content */}
        <div className={`flex-1 overflow-y-auto transition-colors duration-700 ${themed('bg-neutral-50/30', 'bg-black', 'bg-[#050505]', 'bg-[#eee8d5]/30')}`}>
           <div className="max-w-6xl mx-auto p-6 md:p-12">

              {/* Project Details Stack */}
              <div className="flex flex-col gap-10 mb-16">
                  {/* Row 1: Description */}
                  <div className="space-y-4">
                      <span className={`text-xs font-bold uppercase tracking-widest ${themed('text-blue-600', 'text-blue-500', 'text-blue-400', 'text-[#b58900]')}`}>Description</span>
                      <p className={`text-xl leading-relaxed font-medium max-w-4xl ${themed('text-neutral-800', 'text-neutral-200', 'text-blue-100', 'text-[#433422]')}`}>
                         {project.description}
                      </p>
                  </div>

                  {/* Row 2: Purpose */}
                  <div className="space-y-4">
                      <span className={`text-xs font-bold uppercase tracking-widest ${themed('text-neutral-400', 'text-neutral-500', 'text-blue-500/60', 'text-[#433422]/40')}`}>Purpose</span>
                      <p className={`text-lg leading-relaxed max-w-4xl ${themed('text-neutral-600', 'text-neutral-400', 'text-blue-400/80', 'text-[#433422]/70')}`}>
                         {project.purpose}
                      </p>
                  </div>

                  {/* Row 3: Tech Stack */}
                  <div className="space-y-4">
                      <span className={`text-xs font-bold uppercase tracking-widest ${themed('text-neutral-400', 'text-neutral-500', 'text-blue-500/60', 'text-[#433422]/40')}`}>Tech Stack</span>
                      <div className="flex flex-wrap gap-3">
                          {project.stack?.map((tech, idx) => (
                              <span key={idx} className={`px-4 py-2 border rounded-2xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all ${themed('bg-white border-neutral-200 text-neutral-700 hover:border-blue-300', 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-white', 'bg-blue-950/20 border-blue-900/30 text-blue-400 hover:border-blue-500', 'bg-[#fdf6e3] border-[#433422]/20 text-[#433422] hover:border-[#b58900]')}`}>
                                  {tech}
                              </span>
                          ))}
                      </div>
                  </div>
              </div>

              {/* Main Visualization */}
              <div className={`rounded-2xl overflow-hidden shadow-2xl border transition-colors duration-700 ${themed('border-neutral-200 bg-white', 'border-neutral-800 bg-neutral-900', 'border-blue-900/30 bg-[#0a0a0a]', 'border-[#433422]/10 bg-[#fdf6e3]')}`}>
                 <img
                    src={project.img}
                    alt={project.title}
                    className={`w-full h-auto object-contain transition-all duration-700 ${themeMode === 'reading' ? 'sepia-[0.3]' : ''}`}
                 />
              </div>

              {/* Additional Screenshots Gallery */}
              {project.screenshots && project.screenshots.length > 0 && (
                <div className="mt-12">
                  <h4 className={`text-xs font-bold uppercase tracking-widest mb-6 ${themed('text-neutral-400', 'text-neutral-500', 'text-blue-500/60', 'text-[#433422]/40')}`}>Additional Screenshots</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.screenshots.map((screenshot, idx) => (
                      <div key={idx} className={`rounded-2xl overflow-hidden shadow-lg border transition-all duration-300 hover:shadow-2xl ${themed('border-neutral-200 bg-white', 'border-neutral-800 bg-neutral-900', 'border-blue-900/30 bg-[#0a0a0a]', 'border-[#433422]/10 bg-[#fdf6e3]')}`}>
                        <img
                          src={screenshot}
                          alt={`${project.title} screenshot ${idx + 1}`}
                          className={`w-full h-auto object-contain transition-all duration-700 ${themeMode === 'reading' ? 'sepia-[0.3]' : ''}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectGrid;
