import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AppWindow, CheckCircle2, ArrowRight, ArrowLeft, Activity, Layers, Code2, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import SEO from '../components/SEO.jsx';

const WebArchitecturePage = () => {
    const navigate = useNavigate();
    const { themed, blueprintMode, playSound } = useUI();
    const containerRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const serviceData = {
        title: "Custom Web Architecture",
        subtitle: "Client-to-Developer Solutions",
        icon: AppWindow,
        overview: "Our web architecture service goes beyond traditional development. We create scalable, performant, and beautiful digital experiences that convert visitors into customers.",
        features: [
            { title: "Lightning Performance", desc: "Next.js applications with optimized SSR/ISR for sub-second load times." },
            { title: "Responsive Systems", desc: "Fluid design language that adapts flawlessly across all viewport scales." },
            { title: "SEO Optimization", desc: "Technical SEO and schema integration for maximum search engine visibility." },
            { title: "Premium Motion", desc: "Advanced Framer-Motion animations that provide high-end depth and tactile feel." },
            { title: "Headless Ecosystem", desc: "Decoupled CMS architecture for seamless content management and security." },
            { title: "Offline Readiness", desc: "PWA capabilities ensuring persistent functionality in low-connectivity zones." }
        ],
        technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Vercel"],
        deliverables: [
            "Fully responsive web application",
            "Complete source code repository",
            "CI/CD Pipeline documentation",
            "Performance optimization report",
            "Technical support SLA"
        ]
    };

    // Theme-specific styles
    const accentText = themed('text-blue-600', 'text-blue-500', 'text-blue-400', 'text-[#b58900]');
    const accentBorder = themed('border-neutral-100', 'border-neutral-800', 'border-blue-900/50', 'border-[#433422]/10');
    const cardBg = themed('bg-white shadow-xl shadow-blue-500/5', 'bg-neutral-900', 'bg-[#0a0a0a]', 'bg-[#eee8d5]');
    const cardBorder = themed('border-neutral-100', 'border-neutral-800', 'border-blue-500/30', 'border-[#433422]/10');

    return (
        <main ref={containerRef} className={`min-h-screen transition-colors duration-700 ${themed('bg-white', 'bg-[#0a0a0a]', 'bg-[#050505]', 'bg-[#fdf6e3]')}`}>
            <SEO 
                title="Web Architecture | JPixelate"
                description="Custom high-performance web architecture solutions including React, Next.js, and advanced animations."
            />
            
            {/* Background SVG Grid similar to homepage sections */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <svg className="w-full h-full opacity-[0.03] dark:opacity-[0.015]" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 0 10 L 100 10 M 0 20 L 100 20 M 0 30 L 100 30 M 0 40 L 100 40 M 0 50 L 100 50 M 0 60 L 100 60 M 0 70 L 100 70 M 0 80 L 100 80 M 0 90 L 100 90" stroke="currentColor" strokeWidth="0.1" fill="none" />
                    <path d="M 10 0 L 10 100 M 20 0 L 20 100 M 30 0 L 30 100 M 40 0 L 40 100 M 50 0 L 50 100 M 60 0 L 60 100 M 70 0 L 70 100 M 80 0 L 80 100 M 90 0 L 90 100" stroke="currentColor" strokeWidth="0.1" fill="none" />
                </svg>
            </div>

            <div className="relative pt-40 pb-32 px-4 md:px-8 z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header: Following WorkProcess Header Design */}
                    <div className={`mb-24 flex items-end justify-between border-b pb-8 ${accentBorder}`}>
                        <div>
                            <span className={`text-xs font-bold uppercase tracking-widest block mb-4 ${accentText}`}>Service Stack</span>
                            <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${themed('text-neutral-900', 'text-neutral-100', 'text-blue-500', 'text-[#433422]')}`}>Engineering Performance.</h1>
                        </div>
                        {blueprintMode && (
                            <div className="flex items-center gap-3 text-blue-500 font-mono text-[10px]">
                                <Activity size={14} />
                                <span>SYSTEM_ANALYSIS: ACTIVE</span>
                            </div>
                        )}
                        <p className="hidden md:block text-neutral-400 font-medium text-sm">WEB_ARCHITECT</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                        {/* Left Column: Content */}
                        <div className="lg:col-span-8 space-y-24">
                            {/* Overview Section */}
                            <section className={`${blueprintMode ? 'blueprint-active-outline' : ''}`} data-blueprint-label="OVERVIEW">
                                <div className="flex items-center gap-4 mb-8">
                                    <span className={`w-12 h-px ${themed('bg-blue-600', 'bg-neutral-400', 'bg-blue-500', 'bg-[#b58900]')}`}></span>
                                    <span className={`text-xs font-bold uppercase tracking-widest ${accentText}`}>Briefing</span>
                                </div>
                                <p className={`text-2xl md:text-3xl font-medium leading-relaxed transition-colors duration-700 ${themed('text-neutral-700', 'text-neutral-300', 'text-blue-400/80', 'text-[#433422]/80')}`}>
                                    {serviceData.overview}
                                </p>
                            </section>

                            {/* Features Grid */}
                            <section className="space-y-12">
                                <h2 className={`text-xs font-bold uppercase tracking-widest text-neutral-400`}>Technical Parameters</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {serviceData.features.map((feature, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`p-8 rounded-[2rem] border transition-all duration-500 ${cardBg} ${cardBorder} ${blueprintMode ? 'blueprint-active-outline' : ''}`}
                                            data-blueprint-label={`FEATURE_0${idx+1}`}
                                        >
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${themed('bg-blue-50', 'bg-neutral-800', 'bg-blue-900/40', 'bg-[#b58900]/10')}`}>
                                                <CheckCircle2 size={24} className={accentText} />
                                            </div>
                                            <h3 className={`text-xl font-bold mb-3 ${themed('text-neutral-900', 'text-neutral-100', 'text-blue-500', 'text-[#433422]')}`}>{feature.title}</h3>
                                            <p className={`text-sm font-medium leading-relaxed ${themed('text-neutral-500', 'text-neutral-400', 'text-blue-400/60', 'text-[#433422]/60')}`}>{feature.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Sidebar Specs */}
                        <div className="lg:col-span-4 space-y-12">
                            {/* Tech Stack Module */}
                            <div className={`p-10 rounded-[2rem] border ${cardBg} ${cardBorder} ${blueprintMode ? 'blueprint-active-outline' : ''}`} data-blueprint-label="SPECS_JSON">
                                <h3 className={`text-xs font-bold uppercase tracking-[0.2em] mb-10 opacity-30 ${themed('text-neutral-900', 'text-white', 'text-blue-500', 'text-[#433422]')}`}>Engineering_Stack</h3>
                                <div className="flex flex-wrap gap-3">
                                    {serviceData.technologies.map((tech, idx) => (
                                        <span key={idx} className={`px-4 py-2 rounded-xl text-[11px] font-bold border transition-colors ${themed('bg-neutral-50 border-neutral-200 text-neutral-600', 'bg-neutral-800 border-neutral-700 text-neutral-400', 'bg-blue-900/40 border-blue-500/30 text-blue-400', 'bg-[#fdf6e3] border-[#433422]/20 text-[#433422]/60')}`}>
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Deliverables Module */}
                            <div className={`p-10 rounded-[2rem] border ${themed('bg-neutral-900 text-white', 'bg-white text-neutral-900', 'bg-blue-600 text-white', 'bg-[#433422] text-[#fdf6e3]')} ${cardBorder} ${blueprintMode ? 'blueprint-active-outline' : ''}`} data-blueprint-label="MANIFESTO">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 opacity-40">Output_Log</h3>
                                <ul className="space-y-6">
                                    {serviceData.deliverables.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                                            <span className="text-sm font-bold tracking-tight opacity-80">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button 
                                    onClick={() => {
                                        playSound('click');
                                        navigate('/deploy');
                                    }}
                                    className={`mt-12 w-full py-5 rounded-[1.5rem] flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] shadow-2xl ${themed(
                                        'bg-white text-neutral-900',
                                        'bg-neutral-900 text-white',
                                        'bg-white text-blue-600',
                                        'bg-[#fdf6e3] text-[#433422]'
                                    )}`}
                                >
                                    Initialize Build
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Controls */}
                    <div className="mt-32 pt-12 border-t flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
                         <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
                             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                             <span className="text-[10px] font-bold uppercase tracking-widest">Return to Base</span>
                         </button>
                         <div className="flex gap-12">
                             <span className="text-[10px] font-bold uppercase tracking-widest">EncryptedSession_Active</span>
                             <span className="text-[10px] font-bold uppercase tracking-widest">Version_4.0.2</span>
                         </div>
                    </div>
                </div>
            </div>

            {blueprintMode && (
                <div className="fixed bottom-8 left-8 z-[100] font-mono text-[9px] text-blue-500/40 pointer-events-none uppercase tracking-tighter">
                    <div className="mb-1">NODE_RENDER: WebArchitecturePage.jsx</div>
                    <div className="mb-1">MODULE_ID: 0x93F2</div>
                    <div>STATUS: VISUAL_ORCHESTRATION_OK</div>
                </div>
            )}
        </main>
    );
};

export default WebArchitecturePage;
