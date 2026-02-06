import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, AlertTriangle } from "lucide-react";

import { PROJECTS } from "../constants/projects";
import { useUI } from "../context/UIContext";

const ProjectGrid = () => {
  const { blueprintMode } = useUI();
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const handleRemoteOpen = (e) => {
      const projectTitle = e.detail;
      const project = PROJECTS.find(p => p.title === projectTitle);
      if (project) {
        setSelectedProject(project);
      }
    };

    window.addEventListener('portfolio:open-project', handleRemoteOpen);
    return () => window.removeEventListener('portfolio:open-project', handleRemoteOpen);
  }, []);

  return (
    <section id="section-projects" className={`py-24 md:py-32 px-4 md:px-8 transition-colors duration-700 ${blueprintMode ? 'bg-[#050505] border-blue-900/40' : 'bg-white border-neutral-100'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Standardized Header - Consistent with Section3 */}
        <div className={`mb-24 flex items-end justify-between border-b pb-10 transition-colors duration-700 ${blueprintMode ? 'border-blue-900/50' : 'border-neutral-100'}`}>
          <div>
            <span className={`text-xs font-bold uppercase tracking-widest block mb-4 transition-colors ${blueprintMode ? 'text-blue-400' : 'text-blue-600'}`}>Portfolio</span>
            <h2 className={`text-5xl md:text-6xl font-bold tracking-tight transition-colors duration-700 ${blueprintMode ? 'text-blue-500' : 'text-neutral-900'}`}>Selected Works.</h2>
          </div>
          <p className={`hidden md:block font-medium text-sm transition-colors ${blueprintMode ? 'text-blue-900/40' : 'text-neutral-400'}`}>(07) CASE STUDIES</p>
        </div>

        {/* Asymmetric Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-20">
          {PROJECTS.map((project, idx) => (
            <ProjectItem 
              key={idx} 
              project={project} 
              index={idx} 
              onOpen={() => setSelectedProject(project)}
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
  const { blueprintMode, playSound } = useUI();
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
      <div className={`overflow-hidden rounded-2xl bg-neutral-100 aspect-[4/3] relative border transition-colors duration-700 ${blueprintMode ? 'bg-[#0a0a0a] border-blue-500/30' : 'border-neutral-100/50'}`}>
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          src={project.thumbnail || project.img}
          alt={project.title}
          className={`w-full h-full object-cover object-top transition-all duration-700 ${blueprintMode ? 'opacity-20 grayscale brightness-50' : 'opacity-90 group-hover:opacity-100'}`}
        />
        
        {/* Subtle Overlay on Hover */}
        <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/5 transition-colors duration-300" />

        {/* Mobile Only: View Details Button */}
        <div className="absolute inset-0 flex items-center justify-center md:hidden">
          <span className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest shadow-[0_8px_32px_rgba(0,0,0,0.25)] ${blueprintMode ? 'bg-blue-600/90 text-white backdrop-blur-md border border-blue-400/30' : 'bg-white/80 text-neutral-900 backdrop-blur-md border border-white/50'}`}>
            View Details <ArrowUpRight size={14} />
          </span>
        </div>

        {/* Floating Action Button (Desktop) */}
        <div className={`absolute bottom-6 right-6 w-12 h-12 rounded-full shadow-lg items-center justify-center transition-all duration-300 z-10 hidden md:flex ${blueprintMode ? 'bg-blue-600 text-white' : 'bg-white text-neutral-900 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0'}`}>
            <ArrowUpRight size={20} />
        </div>

        {blueprintMode && (
             <div className="absolute inset-x-0 bottom-0 p-4 font-mono text-[8px] text-blue-500/50 pointer-events-none bg-black/60 backdrop-blur-sm">
                <div>TEX_MAP: {project.thumbnail?.split('/').pop() || 'STATIC_ASSET'}</div>
                <div>RENDER_PASS: PBR_Opaque</div>
             </div>
        )}
      </div>

      {/* Info Block - Below Image for Clean Look */}
      <div className={`flex justify-between items-start border-t pt-6 transition-colors duration-700 ${blueprintMode ? 'border-blue-900/50' : 'border-neutral-100'}`}>
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full transition-colors ${blueprintMode ? 'bg-blue-400' : 'bg-blue-600'}`}></span>
              <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${blueprintMode ? 'text-blue-500' : 'text-neutral-500'}`}>{project.category}</span>
           </div>
           <h3 className={`text-3xl font-bold tracking-tight leading-tight transition-colors duration-300 ${blueprintMode ? 'text-blue-500 group-hover:text-blue-300' : 'text-neutral-900 group-hover:text-blue-600'}`}>
             {project.title}
           </h3>
        </div>
        <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${blueprintMode ? 'text-blue-900/40' : 'text-neutral-300'}`}>{project.year}</span>
      </div>
    </motion.div>
  );
};

const ProjectModal = ({ project, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/95 backdrop-blur-xl p-4 md:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full h-full max-w-7xl bg-white rounded-3xl overflow-hidden flex flex-col relative"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-neutral-100 bg-white z-10">
           <div className="flex-1">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{project.category}</span>
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-900">{project.title}</h3>
              <p className="inline-flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md mt-2">
                <AlertTriangle size={14} />
                Portfolio Website is on Staging Environment — Live Demo is unavailable for security reasons
              </p>
           </div>

           <div className="flex items-center gap-4">
              <span
                className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-neutral-300 text-neutral-500 text-xs font-bold uppercase tracking-widest rounded-full cursor-not-allowed"
              >
                Visit Live Project <ArrowUpRight size={14} />
              </span>
              <button
                onClick={onClose}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-all transform hover:rotate-90"
              >
                <X size={20} />
              </button>
           </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-neutral-50/30">
           <div className="max-w-6xl mx-auto p-6 md:p-12">
              
              {/* Project Details Stack */}
              <div className="flex flex-col gap-10 mb-16">
                  {/* Row 1: Description */}
                  <div className="space-y-4">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Description</span>
                      <p className="text-xl text-neutral-800 leading-relaxed font-medium max-w-4xl">
                         {project.description}
                      </p>
                  </div>

                  {/* Row 2: Purpose */}
                  <div className="space-y-4">
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Purpose</span>
                      <p className="text-lg text-neutral-600 leading-relaxed max-w-4xl">
                         {project.purpose}
                      </p>
                  </div>

                  {/* Row 3: Tech Stack */}
                  <div className="space-y-4">
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Tech Stack</span>
                      <div className="flex flex-wrap gap-3">
                          {project.stack?.map((tech, idx) => (
                              <span key={idx} className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-bold text-neutral-700 uppercase tracking-wider shadow-sm hover:border-blue-300 transition-colors">
                                  {tech}
                              </span>
                          ))}
                      </div>
                  </div>
              </div>
              
              {/* Main Visualization */}
              <div className="rounded-xl overflow-hidden shadow-2xl border border-neutral-200 bg-white">
                 <img 
                    src={project.img} 
                    alt={project.title} 
                    className="w-full h-auto object-contain"
                 />
              </div>

              {/* Additional Screenshots Gallery */}
              {project.screenshots && project.screenshots.length > 0 && (
                <div className="mt-12">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">Additional Screenshots</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.screenshots.map((screenshot, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden shadow-lg border border-neutral-200 bg-white hover:shadow-2xl transition-shadow duration-300">
                        <img 
                          src={screenshot} 
                          alt={`${project.title} screenshot ${idx + 1}`} 
                          className="w-full h-auto object-contain"
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