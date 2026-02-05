import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, PenTool, Bot, Rocket, ArrowRight, ArrowLeft, CheckCircle2, Cpu, Shield, Zap, Code2, Database, Network, Activity, Terminal, Layers, Box, Share2, Globe, Command } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProcessPage = () => {
    const navigate = useNavigate();
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const steps = [
        {
            id: "01",
            title: "Discovery & Blueprinting",
            subtitle: "Phase 01",
            icon: Search,
            color: "cyan",
            details: [
                "Deep-dive audit of existing digital systems.",
                "Identification of high-impact automation opportunities.",
                "Technical blueprinting of the solution stack.",
                "Security and compliance risk assessment."
            ],
            description: "We dissect your current workflows through a technical excavation, identifying exactly where manual effort can be replaced by autonomous code.",
            bgPattern: "bg-[radial-gradient(#06b6d415_1px,transparent_1px)] [background-size:30px_30px]"
        },
        {
            id: "02",
            title: "Web Architecture & Dev",
            subtitle: "Phase 02",
            icon: PenTool,
            color: "blue",
            details: [
                "High-performance React/Next.js frontend development.",
                "Scalable serverless backend infrastructure.",
                "API-first design for seamless integrations.",
                "Performance optimization for <100ms latency."
            ],
            description: "We build rock-solid foundations using scalable code and high-performance interfaces that ensure your digital presence is future-proof.",
            bgPattern: "bg-[linear-gradient(to_right,#3b82f608_1px,transparent_1px),linear-gradient(to_bottom,#3b82f608_1px,transparent_1px)] [background-size:60px_60px]"
        },
        {
            id: "03",
            title: "Intelligence Injection",
            subtitle: "Phase 03",
            icon: Bot,
            color: "indigo",
            details: [
                "Custom MCP (Model Context Protocol) agent deployment.",
                "RAG (Retrieval-Augmented Generation) setup.",
                "n8n and Python workflow automation.",
                "Context-aware AI training on proprietary data."
            ],
            description: "We inject autonomous intelligence into your systems, creating context-aware workers that never sleep and always remember.",
            bgPattern: "bg-[repeating-linear-gradient(45deg,#6366f105_0,#6366f105_1px,transparent_0,transparent_50%)] [background-size:15px_15px]"
        },
        {
            id: "04",
            title: "Deployment & Autonomy",
            subtitle: "Phase 04",
            icon: Rocket,
            color: "purple",
            details: [
                "Continuous Integration / Continuous Deployment (CI/CD).",
                "Real-time performance monitoring and logging.",
                "Iterative AI model refinement based on usage.",
                "Full system handover and autonomy training."
            ],
            description: "We ensure your systems are self-sustaining, monitoring every signal to optimize for maximum growth and operational efficiency.",
            bgPattern: "bg-[linear-gradient(to_bottom,#a855f705_1px,transparent_1px)] [background-size:100%_30px]"
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white selection:bg-cyan-500/30 relative overflow-hidden">
            {/* --- GLOBAL ARCHITECTURAL GRID --- */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.05]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            {/* --- HERO SECTION --- */}
            <section className="relative pt-40 pb-20 px-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="max-w-7xl mx-auto relative z-10"
                >
                    <motion.button
                        variants={itemVariants}
                        onClick={() => navigate('/')}
                        className="mb-8 flex items-center gap-2 text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </motion.button>

                    <motion.span variants={itemVariants} className="text-cyan-600 dark:text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase mb-4 block">
                        The Methodology
                    </motion.span>
                    <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-[1.1]">
                        Engineering <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
                            Digital Autonomy
                        </span>
                    </motion.h1>
                    <motion.p variants={itemVariants} className="text-lg md:text-xl text-neutral-600 dark:text-gray-400 max-w-3xl font-light leading-relaxed">
                        Our process is a fusion of rigorous software engineering and cutting-edge AI orchestration.
                        We architect ecosystems that evolve with your business.
                    </motion.p>
                </motion.div>
            </section>

            {/* --- ALTERNATING STEPS WITH ZIGZAG PATH --- */}
            <section className="py-20 relative z-10">
                <div className="max-w-7xl mx-auto relative">

                    {/* SVG Zigzag Path */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block" style={{ zIndex: -1 }}>
                        <motion.path
                            d="M 40 0 L 40 300 L 1240 300 L 1240 600 L 40 600 L 40 900 L 1240 900"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            className="text-neutral-200 dark:text-neutral-800"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />
                    </svg>

                    <div className="space-y-0">
                        {steps.map((step, index) => {
                            const isEven = index % 2 === 0;
                            const colorHex = {
                                cyan: '#06b6d4',
                                blue: '#3b82f6',
                                indigo: '#6366f1',
                                purple: '#a855f7',
                            }[step.color];

                            return (
                                <div key={step.id} className="relative">
                                    {/* Full-width background pattern for the phase */}
                                    <div className={`absolute inset-0 pointer-events-none ${step.bgPattern} opacity-100`}></div>

                                    <motion.div
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: "-100px" }}
                                        variants={containerVariants}
                                        className={`relative max-w-7xl mx-auto px-8 py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-stretch ${!isEven ? 'lg:flex-row-reverse' : ''}`}
                                    >
                                        {/* Phase Marker Dot */}
                                        <div className={`absolute top-24 w-4 h-4 rounded-full bg-current shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] hidden lg:block ${isEven ? 'left-[32px]' : 'right-[32px]'}`}
                                            style={{ color: colorHex }}
                                        />

                                        {/* Content Column */}
                                        <div className={`lg:col-span-5 py-12 ${!isEven ? 'lg:order-2' : ''}`}>
                                            <span className={`font-mono text-xs tracking-[0.3em] uppercase mb-4 block`} style={{ color: colorHex }}>
                                                {step.subtitle}
                                            </span>
                                            <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white mb-6 tracking-tight leading-tight">
                                                {step.title}
                                            </h2>
                                            <p className="text-neutral-600 dark:text-gray-400 text-lg font-light leading-relaxed mb-8">
                                                {step.description}
                                            </p>
                                            <div className="space-y-4">
                                                {step.details.map((detail, i) => (
                                                    <div key={i} className="flex items-center gap-4 group">
                                                        <div className={`w-1.5 h-1.5 rounded-full bg-current group-hover:scale-150 transition-transform`} style={{ color: colorHex }} />
                                                        <span className="text-sm text-neutral-500 dark:text-gray-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">{detail}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Visual Column */}
                                        <div className={`lg:col-span-7 flex flex-col ${!isEven ? 'lg:order-1' : ''}`}>
                                            <div className="flex-grow relative rounded-[2.5rem] border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-md overflow-hidden group mb-6">
                                                {/* Subtle Color Glow */}
                                                <div className="absolute inset-0 opacity-5 bg-current" style={{ color: colorHex }}></div>

                                                {/* Step-Specific Visuals */}
                                                <div className="absolute inset-0 p-10 flex flex-col">
                                                    {/* Header Bar */}
                                                    <div className="flex justify-between items-center mb-10">
                                                        <div className="flex gap-2">
                                                            <div className="w-2.5 h-2.5 rounded-full bg-black/10 dark:bg-white/10" />
                                                            <div className="w-2.5 h-2.5 rounded-full bg-black/10 dark:bg-white/10" />
                                                            <div className="w-2.5 h-2.5 rounded-full bg-black/10 dark:bg-white/10" />
                                                        </div>
                                                        <div className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center gap-2">
                                                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse`} style={{ backgroundColor: colorHex }} />
                                                            <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest">System_Active</span>
                                                        </div>
                                                    </div>

                                                    {/* Main Visual Area */}
                                                    <div className="flex-grow flex items-center justify-center relative">
                                                        {index === 0 && (
                                                            <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
                                                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border border-cyan-500/20 rounded-full border-dashed" />
                                                                <div className="relative z-10 text-center">
                                                                    <Search className="w-20 h-20 text-cyan-500 mb-4 mx-auto group-hover:scale-110 transition-transform duration-700" />
                                                                    <div className="h-1 w-32 bg-cyan-500/20 rounded-full mx-auto overflow-hidden">
                                                                        <motion.div animate={{ x: [-128, 128] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="h-full w-1/2 bg-cyan-500/60" />
                                                                    </div>
                                                                </div>
                                                                {[...Array(4)].map((_, i) => (
                                                                    <div key={i} className="absolute w-10 h-10 bg-white dark:bg-neutral-900 border border-cyan-500/20 rounded-lg flex items-center justify-center shadow-lg" style={{ top: i < 2 ? '10%' : '80%', left: i % 2 === 0 ? '10%' : '80%' }}>
                                                                        <Database className="w-5 h-5 text-cyan-500/40" />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {index === 1 && (
                                                            <div className="w-full max-w-md space-y-4">
                                                                {[...Array(3)].map((_, i) => (
                                                                    <motion.div key={i} initial={{ x: isEven ? -20 : 20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.2 }} className="p-5 bg-white dark:bg-neutral-900 border border-blue-500/10 rounded-2xl flex items-center gap-5 group-hover:border-blue-500/30 transition-colors">
                                                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                                            {i === 0 ? <Layers className="w-5 h-5 text-blue-500" /> : i === 1 ? <Code2 className="w-5 h-5 text-blue-500" /> : <Box className="w-5 h-5 text-blue-500" />}
                                                                        </div>
                                                                        <div className="flex-grow space-y-2">
                                                                            <div className="h-1.5 w-1/3 bg-blue-500/20 rounded" />
                                                                            <div className="h-1.5 w-full bg-blue-500/5 rounded" />
                                                                        </div>
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {index === 2 && (
                                                            <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
                                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent)] rounded-full animate-pulse" />
                                                                <div className="relative z-10 grid grid-cols-2 gap-6">
                                                                    {[...Array(4)].map((_, i) => (
                                                                        <motion.div key={i} whileHover={{ y: -5 }} className="p-5 bg-white dark:bg-neutral-900 border border-indigo-500/10 rounded-2xl flex flex-col items-center gap-3 shadow-xl">
                                                                            <Bot className="w-8 h-8 text-indigo-500" />
                                                                            <div className="w-12 h-1 bg-indigo-500/20 rounded" />
                                                                        </motion.div>
                                                                    ))}
                                                                </div>
                                                                <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute inset-[-20px] border border-indigo-500/5 rounded-full" />
                                                            </div>
                                                        )}

                                                        {index === 3 && (
                                                            <div className="w-full max-w-lg space-y-6">
                                                                <div className="h-40 border border-purple-500/20 rounded-2xl bg-purple-500/5 p-6 flex items-end gap-1.5">
                                                                    {[...Array(20)].map((_, i) => (
                                                                        <motion.div key={i} animate={{ height: [`${20 + Math.random() * 60}%`, `${20 + Math.random() * 60}%`] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.04 }} className="flex-1 bg-purple-500/20 border-t border-purple-500/40 rounded-t-sm" />
                                                                    ))}
                                                                </div>
                                                                <div className="flex justify-between items-center px-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <Globe className="w-5 h-5 text-purple-500/40" />
                                                                        <div className="h-1 w-24 bg-purple-500/10 rounded" />
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                                                        <span className="text-[10px] font-mono opacity-40 uppercase">Live_Sync</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Footer Bar */}
                                                    <div className="mt-10 flex justify-between items-end">
                                                        <div className="space-y-1.5">
                                                            <div className="h-1 w-20 bg-black/5 dark:bg-white/5 rounded" />
                                                            <div className="h-1 w-12 bg-black/5 dark:bg-white/5 rounded" />
                                                        </div>
                                                        <span className="font-mono text-[9px] opacity-30 uppercase tracking-[0.2em]">
                                                            {step.color}_module_v4.0
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="h-6" />
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProcessPage;
