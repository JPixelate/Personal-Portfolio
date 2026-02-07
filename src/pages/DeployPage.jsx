import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, ChevronRight, Cpu, Globe, Workflow, MessageSquare, Shield, Zap, Send, Mail, User, Building, Phone, Calendar, DollarSign, Target, Sparkles, Code, Database, Cloud, Loader2, Activity, ShieldCheck, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import SEO from '../components/SEO.jsx';
import DeployGuide from '../components/DeployGuide.jsx';

const DeployPage = () => {
    const navigate = useNavigate();
    const { themed, blueprintMode, playSound, shouldShowDeployGuide, resetDeployGuide } = useUI();
    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        solutionType: '',
        budget: '',
        timeline: '',
        details: '',
        name: '',
        email: '',
        company: '',
        phone: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [showGuide, setShowGuide] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        // Check if this is the first time visiting the deploy page
        const hasSeenGuide = localStorage.getItem('deployGuideCompleted');
        if (!hasSeenGuide) {
            // Show guide after a short delay for better UX
            const timer = setTimeout(() => {
                setShowGuide(true);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, []);

    // Listen for global deploy guide trigger
    useEffect(() => {
        if (shouldShowDeployGuide) {
            setShowGuide(true);
            resetDeployGuide();
        }
    }, [shouldShowDeployGuide, resetDeployGuide]);

    const solutionTypes = [
        {
            id: 'web',
            title: 'Web Architecture',
            icon: Globe,
            desc: 'High-performance React/Next.js platforms with cutting-edge design.',
            features: ['Next.js 14+', 'Optimized SEO'],
            color: themed('text-blue-600', 'text-blue-500', 'text-blue-400', 'text-[#b58900]'),
            solidBg: themed('bg-blue-600', 'bg-blue-500', 'bg-blue-500', 'bg-[#b58900]')
        },
        {
            id: 'auto',
            title: 'Workflow Automation',
            icon: Workflow,
            desc: 'n8n & Python powered efficiency that eliminates manual tasks.',
            features: ['n8n Workflows', 'API Sync'],
            color: themed('text-purple-600', 'text-purple-500', 'text-cyan-400', 'text-orange-700'),
            solidBg: themed('bg-purple-600', 'bg-purple-500', 'bg-cyan-600', 'bg-orange-700')
        },
        {
            id: 'ai',
            title: 'AI Agent Systems',
            icon: MessageSquare,
            desc: 'Context-aware MCP intelligent agents that understand and act.',
            features: ['MCP Protocol', 'RAG Memory'],
            color: themed('text-emerald-600', 'text-emerald-500', 'text-emerald-400', 'text-yellow-700'),
            solidBg: themed('bg-emerald-600', 'bg-emerald-500', 'bg-emerald-600', 'bg-yellow-700')
        },
        {
            id: 'full',
            title: 'Full Ecosystem',
            icon: Cpu,
            desc: 'Complete digital transformation with integrated AI and automation.',
            features: ['Unified Stack', 'SLA Support'],
            color: themed('text-indigo-600', 'text-indigo-500', 'text-blue-500', 'text-amber-800'),
            solidBg: themed('bg-indigo-600', 'bg-indigo-500', 'bg-blue-600', 'bg-amber-800')
        },
    ];

    const accentText = themed('text-blue-600', 'text-blue-500', 'text-blue-400', 'text-[#b58900]');
    const accentBorder = themed('border-neutral-100', 'border-neutral-800', 'border-blue-900/50', 'border-[#433422]/10');
    const mainSolidBg = themed('bg-blue-600', 'bg-blue-500', 'bg-blue-500', 'bg-[#b58900]');
    const cardBg = themed('bg-white', 'bg-neutral-900', 'bg-[#0a0a0a]', 'bg-[#eee8d5]');
    const inputBorder = themed('border-neutral-100', 'border-neutral-800', 'border-blue-500/20', 'border-[#433422]/10');
    
    const containerVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3 } }
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const honeypot = form.elements["system_id"]?.value;
        if (honeypot) return;

        setIsLoading(true);
        setStatusMessage('');

        try {
            const API_URL = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${API_URL}/api/quote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    solutionType: selectedSolution?.title || formData.solutionType
                }),
            });

            if (!response.ok) throw new Error('Failed to transmit request');
            setIsSubmitted(true);
        } catch (err) {
            setStatusMessage("Transmission Error. Please verify connection.");
        } finally {
            setIsLoading(false);
        }
    };

    const selectedSolution = solutionTypes.find(s => s.id === formData.solutionType);

    return (
        <main className={`min-h-screen transition-colors duration-700 ${themed('bg-white', 'bg-[#0a0a0a]', 'bg-[#050505]', 'bg-[#fdf6e3]')}`}>
            <SEO title="Deploy Protocol" description="Initialize your technical build with a high-performance architectural quote." />
            
            {/* Background SVG Grid */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <svg className="w-full h-full opacity-[0.03] dark:opacity-[0.015]" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 0 10 L 100 10 M 0 30 L 100 30 M 0 50 L 100 50 M 0 70 L 100 70 M 0 90 L 100 90" stroke="currentColor" strokeWidth="0.05" fill="none" />
                    <path d="M 10 0 L 10 100 M 30 0 L 30 100 M 50 0 L 50 100 M 70 0 L 70 100 M 90 0 L 90 100" stroke="currentColor" strokeWidth="0.05" fill="none" />
                </svg>
            </div>

            <div className="relative pt-40 pb-32 px-4 md:px-8 z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Standardized Homepage Header */}
                    <div className={`mb-24 flex items-end justify-between border-b pb-8 ${accentBorder}`}>
                        <div>
                            <span className={`text-xs font-bold uppercase tracking-widest block mb-4 ${accentText}`}>Request a Quote</span>
                            <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${themed('text-neutral-900', 'text-neutral-100', 'text-blue-500', 'text-[#433422]')}`}>Start Your Project.</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            {blueprintMode && (
                                <div className="flex items-center gap-3 text-blue-500 font-mono text-[10px]">
                                    <Activity size={14} />
                                    <span>SECURE CONNECTION: ACTIVE</span>
                                </div>
                            )}
                            <button
                                onClick={() => {
                                    playSound('click');
                                    setShowGuide(true);
                                }}
                                className={`group flex items-center gap-2 px-4 py-2 rounded-xl border ${themed('border-neutral-200 hover:border-blue-600 hover:bg-blue-50', 'border-neutral-800 hover:border-blue-500 hover:bg-blue-500/10', 'border-blue-900/50 hover:border-blue-400 hover:bg-blue-900/30', 'border-[#433422]/20 hover:border-[#b58900] hover:bg-[#b58900]/10')} transition-all`}
                                aria-label="Show guided tour"
                            >
                                <HelpCircle size={16} className={`${accentText} group-hover:scale-110 transition-transform`} />
                                <span className={`text-xs font-bold uppercase tracking-wider hidden md:inline ${accentText}`}>Guide</span>
                            </button>
                            <p className="hidden lg:block text-neutral-400 font-medium text-sm">STRATEGY_SYNC</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
                        {/* Left Column: Progress & Logic */}
                        <div className="lg:col-span-4 space-y-8 sticky top-32" data-guide-target="progress-sidebar">
                            <div className={`p-8 rounded-[2rem] border backdrop-blur-md transition-all duration-700 ${themed('bg-white/80 border-neutral-100', 'bg-neutral-900/80 border-neutral-800', 'bg-[#0a0a0a]/80 border-blue-500/20', 'bg-[#eee8d5]/80 border-[#433422]/10')} ${blueprintMode ? 'blueprint-active-outline shadow-[0_0_30px_rgba(59,130,246,0.1)]' : 'shadow-xl'}`} data-blueprint-label="PHASE_LOG">
                                <div className="flex items-center justify-between mb-10 pb-4 border-b border-current opacity-10">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Project Roadmap</h3>
                                    <span className="text-[8px] font-mono">PHASE 0{step}/04</span>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { id: 1, label: 'Solution', sub: 'Select your build' },
                                        { id: 2, label: 'Scope', sub: 'Budget & Timeline' },
                                        { id: 3, label: 'Contact', sub: 'Your details' },
                                        { id: 4, label: 'Review', sub: 'Confirm & Send' }
                                    ].map((item) => (
                                        <div key={item.id} className={`group relative flex gap-6 p-4 rounded-2xl transition-all duration-500 ${step === item.id ? `${themed('bg-neutral-50', 'bg-white/5', 'bg-blue-500/5', 'bg-[#433422]/5')}` : ''} ${step < item.id ? 'opacity-30' : 'opacity-100'}`}>
                                            <div className="relative">
                                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black z-10 relative transition-all duration-500 ${step >= item.id ? `${themed('bg-neutral-900 text-white border-neutral-900', 'bg-blue-500 text-black border-blue-500', 'bg-blue-500 text-black border-blue-500', 'bg-[#433422] text-[#fdf6e3] border-[#433422]')}` : 'border-neutral-200'}`}>
                                                    {step > item.id ? <Check size={12} strokeWidth={4} /> : `0${item.id}`}
                                                </div>
                                                {item.id !== 4 && (
                                                    <div className={`absolute top-8 left-1/2 -translate-x-1/2 w-[2px] h-8 bg-current opacity-10 transition-all duration-500 ${step > item.id ? 'opacity-30' : ''}`}></div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-xs font-black uppercase tracking-widest transition-colors ${step === item.id ? accentText : ''}`}>{item.label}</p>
                                                <p className="text-[9px] font-medium opacity-40 uppercase mt-1 tracking-tighter">{item.sub}</p>
                                            </div>
                                            {step === item.id && (
                                                <motion.div layoutId="active-indicator" className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 rounded-full ${mainSolidBg}`} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 px-6">
                                <div className="flex items-center gap-3 opacity-30 hover:opacity-100 transition-opacity">
                                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                                        <Shield size={12} />
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em]">End-to-End Encrypted</span>
                                </div>
                                <div className="flex items-center gap-3 opacity-30 hover:opacity-100 transition-opacity">
                                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                        <Zap size={12} />
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Priority Processing</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Execution Interface */}
                        <div className="lg:col-span-8">
                            <div className={`min-h-[600px] p-8 rounded-[2rem] border transition-all duration-700 ${cardBg} ${accentBorder} ${blueprintMode ? 'blueprint-active-outline' : ''}`} data-blueprint-label="TERMINAL_UI">
                                <AnimatePresence mode="wait">
                                    {isSubmitted ? (
                                        <motion.div key="success" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
                                            <div className={`w-20 h-20 ${mainSolidBg} text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl`}>
                                                <Check size={40} strokeWidth={3} />
                                            </div>
                                            <h2 className="text-4xl font-black mb-6 uppercase tracking-tight">Transmission OK</h2>
                                            <p className="text-lg opacity-60 max-w-md mx-auto mb-12">Your request has been successfully recorded into the system. Our architecture team will synchronize within 24 hours.</p>
                                            <button onClick={() => navigate('/')} className={`px-12 py-5 ${themed('bg-neutral-900 text-white', 'bg-white text-black', 'bg-white text-black', 'bg-[#433422] text-[#fdf6e3]')} rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl`}>Terminate Session</button>
                                        </motion.div>
                                    ) : (
                                        <>
                                            {step === 1 && (
                                                <motion.div key="s1" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                                                    <div className="mb-12 px-4">
                                                        <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Select Your Foundation</h3>
                                                        <p className="opacity-50 text-sm font-medium">Identify the core technical approach for your next project.</p>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-guide-target="solution-cards">
                                                        {solutionTypes.map((type) => (
                                                            <button 
                                                                key={type.id} 
                                                                onClick={() => { playSound('click'); setFormData({...formData, solutionType: type.id}); setStep(2); }}
                                                                className={`p-10 rounded-[2rem] border text-left transition-all duration-500 group relative overflow-hidden transform hover:scale-[1.02] hover:-translate-y-1 ${formData.solutionType === type.id ? `${themed('bg-neutral-100 border-neutral-900', 'bg-neutral-800 border-white', 'bg-blue-900/40 border-blue-400', 'bg-[#fdf6e3] border-[#433422]')}` : `${inputBorder} hover:border-neutral-400 dark:hover:border-white/40`}`}
                                                            >
                                                                {/* Bottom Corner Accent */}
                                                                <type.icon size={32} className={`mb-8 transition-all duration-500 ${formData.solutionType === type.id ? type.color : 'opacity-40 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-3'}`} />
                                                                <h4 className="font-extrabold text-xl mb-2 uppercase tracking-tight relative z-10 transition-colors group-hover:text-current">{type.title}</h4>
                                                                <p className="text-xs font-medium opacity-50 mb-8 relative z-10">{type.desc}</p>
                                                                <div className="flex gap-2 relative z-10 transition-opacity">
                                                                    {type.features.map((f, i) => (
                                                                        <span key={i} className={`text-[8px] font-black uppercase tracking-tighter transition-all duration-500 ${formData.solutionType === type.id ? 'opacity-100' : 'opacity-30 group-hover:opacity-60'}`}>
                                                                            {f}
                                                                        </span>
                                                                    ))}
                                                                </div>

                                                                {/* Bottom Corner Accent */}
                                                                <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-current opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity duration-700`}></div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {step === 2 && (
                                                <motion.div key="s2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-12">
                                                    {/* Selected Breadcrumb Style */}
                                                    <div className="flex items-center gap-6 p-8 rounded-3xl bg-neutral-100/50 dark:bg-white/5 border border-white/10 backdrop-blur-sm">
                                                        <div className={`w-14 h-14 rounded-2xl ${selectedSolution?.solidBg} flex items-center justify-center text-white shadow-lg overflow-hidden relative`}>
                                                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                                            {selectedSolution?.icon && <selectedSolution.icon size={28} className="relative z-10" />}
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1 leading-none">Selected Solution</p>
                                                            <p className="text-xl font-black uppercase tracking-tight">{selectedSolution?.title}</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10" data-guide-target="scope-section">
                                                        <div className="space-y-6">
                                                            <div className="flex items-center gap-3 ml-2">
                                                                <DollarSign size={14} className={accentText} />
                                                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Monthly Budget</label>
                                                            </div>
                                                            <div className="grid grid-cols-1 gap-3">
                                                                {['$2k - $5k', '$5k - $10k', '$10k - $25k', '$25k+'].map(b => (
                                                                    <button 
                                                                        key={b} 
                                                                        onClick={() => { playSound('click'); setFormData({...formData, budget: b})}} 
                                                                        className={`py-5 px-8 rounded-2xl border text-sm font-black transition-all text-left flex items-center justify-between group ${formData.budget === b ? `${themed('bg-neutral-900 text-white border-neutral-900', 'bg-blue-500 text-black border-blue-500', 'bg-blue-500 text-black border-blue-500', 'bg-[#433422] text-[#fdf6e3] border-[#433422]')}` : 'bg-transparent border-neutral-200/50 dark:border-white/10 opacity-60 hover:opacity-100 hover:border-neutral-400 dark:hover:border-white/30'}`}
                                                                    >
                                                                        {b}
                                                                        {formData.budget === b && <Check size={14} strokeWidth={4} />}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-6">
                                                            <div className="flex items-center gap-3 ml-2">
                                                                <Calendar size={14} className={accentText} />
                                                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Projected Timeline</label>
                                                            </div>
                                                            <div className="grid grid-cols-1 gap-3">
                                                                {['< 1 Month', '1-3 Months', '3-6 Months', 'Ongoing'].map(t => (
                                                                    <button 
                                                                        key={t} 
                                                                        onClick={() => { playSound('click'); setFormData({...formData, timeline: t})}} 
                                                                        className={`py-5 px-8 rounded-2xl border text-sm font-black transition-all text-left flex items-center justify-between group ${formData.timeline === t ? `${themed('bg-neutral-900 text-white border-neutral-900', 'bg-blue-500 text-black border-blue-500', 'bg-blue-500 text-black border-blue-500', 'bg-[#433422] text-[#fdf6e3] border-[#433422]')}` : 'bg-transparent border-neutral-200/50 dark:border-white/10 opacity-60 hover:opacity-100 hover:border-neutral-400 dark:hover:border-white/30'}`}
                                                                    >
                                                                        {t}
                                                                        {formData.timeline === t && <Check size={14} strokeWidth={4} />}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center pt-10 border-t border-neutral-100 dark:border-white/5">
                                                        <button onClick={() => setStep(1)} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-all">
                                                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                                            Previous
                                                        </button>
                                                        <button 
                                                            onClick={() => setStep(3)} 
                                                            disabled={!formData.budget || !formData.timeline} 
                                                            className={`px-12 py-5 ${themed('bg-neutral-900 text-white', 'bg-white text-black', 'bg-white text-black', 'bg-[#433422] text-[#fdf6e3]')} rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] disabled:opacity-20 transform hover:scale-105 active:scale-95 transition-all`}
                                                        >
                                                            Continue
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {step === 3 && (
                                                <motion.div key="s3" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-10" data-guide-target="contact-section">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        {[
                                                            { id: 'name', label: 'Full Name', icon: User, placeholder: 'e.g. John Doe' },
                                                            { id: 'email', label: 'Work Email', icon: Mail, placeholder: 'john@company.com' },
                                                            { id: 'company', label: 'Company / Organization', icon: Building, placeholder: 'Internal / Studio' },
                                                            { id: 'phone', label: 'Phone Number', icon: Phone, placeholder: 'e.g. +1 (555) 000-0000' }
                                                        ].map(field => (
                                                            <div key={field.id} className="space-y-3 group">
                                                                <div className="flex items-center gap-3 ml-2 group-focus-within:translate-x-1 transition-transform">
                                                                    <field.icon size={12} className={accentText} />
                                                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">{field.label}</label>
                                                                </div>
                                                                <input 
                                                                    type={field.id === 'email' ? 'email' : 'text'}
                                                                    value={formData[field.id]}
                                                                    onChange={e => setFormData({...formData, [field.id]: e.target.value})}
                                                                    className={`w-full p-6 bg-neutral-50 dark:bg-white/[0.03] border ${themed('border-neutral-200 focus:border-neutral-900', 'border-neutral-800 focus:border-white', 'border-blue-900/30 focus:border-blue-400', 'border-[#433422]/20 focus:border-[#433422]')} rounded-2xl font-bold transition-all outline-none focus:ring-0 backdrop-blur-sm`}
                                                                    placeholder={field.placeholder}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="space-y-3 group">
                                                        <div className="flex items-center gap-3 ml-2 group-focus-within:translate-x-1 transition-transform">
                                                            <Database size={12} className={accentText} />
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Project Requirements</label>
                                                        </div>
                                                        <textarea 
                                                            value={formData.details}
                                                            onChange={e => setFormData({...formData, details: e.target.value})}
                                                            className={`w-full h-40 p-8 bg-neutral-50 dark:bg-white/[0.03] border ${themed('border-neutral-200 focus:border-neutral-900', 'border-neutral-800 focus:border-white', 'border-blue-900/30 focus:border-blue-400', 'border-[#433422]/20 focus:border-[#433422]')} rounded-3xl font-bold transition-all outline-none resize-none backdrop-blur-sm`}
                                                            placeholder="Tell us about your objectives and any specific constraints..."
                                                        />
                                                    </div>
                                                    <div className="flex justify-between items-center pt-8 border-t border-neutral-100 dark:border-white/5">
                                                        <button onClick={() => setStep(2)} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-all">
                                                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                                            Previous
                                                        </button>
                                                        <button 
                                                            onClick={() => setStep(4)} 
                                                            disabled={!formData.name || !formData.email || !formData.details} 
                                                            className={`px-12 py-5 ${themed('bg-neutral-900 text-white', 'bg-white text-black', 'bg-white text-black', 'bg-[#433422] text-[#fdf6e3]')} rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] disabled:opacity-20 transform hover:scale-105 active:scale-95 transition-all`}
                                                        >
                                                            Review Details
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {step === 4 && (
                                                <motion.div key="s4" variants={containerVariants} initial="hidden" animate="visible" exit="exit" data-guide-target="review-section">
                                                    <form onSubmit={handleFinalSubmit} className="space-y-12">
                                                        <div className="hidden" aria-hidden="true"><input type="text" name="system_id" /></div>
                                                        
                                                        {/* High-Performance Manifest Card */}
                                                        <div className={`p-10 rounded-[2rem] border ${themed('bg-neutral-900 text-white border-neutral-800', 'bg-white text-neutral-900 border-neutral-100', 'bg-[#0a0a0a] text-blue-400 border-blue-500/30', 'bg-[#433422] text-[#fdf6e3] border-[#433422]')} relative overflow-hidden group`}>
                                                             {/* Animated Grid Overlay */}
                                                             <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                                                                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
                                                                 <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                                             </div>

                                                             {/* Scanning Line Animation */}
                                                             <motion.div 
                                                                 animate={{ y: [0, 400, 0] }} 
                                                                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                                                 className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent z-0 opacity-20"
                                                             />

                                                             <div className="relative z-10">
                                                                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                                                                     <div className="flex items-center gap-6">
                                                                         <div className={`w-20 h-20 rounded-2xl ${themed('bg-white/10', 'bg-neutral-900/5', 'bg-blue-500/10', 'bg-white/10')} backdrop-blur-xl flex items-center justify-center border border-white/10 shadow-inner`}>
                                                                             {selectedSolution?.icon && <selectedSolution.icon size={36} className={themed('text-white', 'text-neutral-900', 'text-blue-400', 'text-[#fdf6e3]')} />}
                                                                         </div>
                                                                         <div>
                                                                             <div className="flex items-center gap-2 mb-1">
                                                                                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                                                 <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">Ready to Send</p>
                                                                             </div>
                                                                             <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">{selectedSolution?.title}</h3>
                                                                         </div>
                                                                     </div>
                                                                     <div className="text-right hidden md:block">
                                                                         <p className="text-[10px] font-mono opacity-30 mb-1 leading-none">REF_ID: #{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                                                                         <p className="text-[10px] font-mono opacity-30 leading-none">DATE: {new Date().toLocaleDateString()}</p>
                                                                     </div>
                                                                 </div>

                                                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-white/10">
                                                                     <div className="space-y-4">
                                                                         <div className="flex items-center gap-2 opacity-40">
                                                                             <User size={12} />
                                                                             <p className="text-[9px] font-bold uppercase tracking-widest leading-none">Contact Person</p>
                                                                         </div>
                                                                         <div>
                                                                             <p className="text-lg font-bold truncate">{formData.name}</p>
                                                                             <p className="text-[11px] opacity-50 font-medium truncate">{formData.email}</p>
                                                                         </div>
                                                                     </div>

                                                                     <div className="space-y-4">
                                                                         <div className="flex items-center gap-2 opacity-40">
                                                                             <Target size={12} />
                                                                             <p className="text-[9px] font-bold uppercase tracking-widest leading-none">Allocation</p>
                                                                         </div>
                                                                         <div>
                                                                             <p className="text-lg font-bold">{formData.budget}</p>
                                                                             <p className="text-[11px] opacity-50 font-medium">{formData.timeline}</p>
                                                                         </div>
                                                                     </div>

                                                                     <div className="space-y-4">
                                                                         <div className="flex items-center gap-2 opacity-40">
                                                                             <Building size={12} />
                                                                             <p className="text-[9px] font-bold uppercase tracking-widest leading-none">Organization</p>
                                                                         </div>
                                                                         <div>
                                                                             <p className="text-lg font-bold truncate">{formData.company || 'Not Specified'}</p>
                                                                             <p className="text-[11px] opacity-50 font-medium">{formData.phone || 'No Phone Sync'}</p>
                                                                         </div>
                                                                     </div>
                                                                 </div>
                                                                 
                                                                 <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
                                                                     <div className="flex items-center gap-2 opacity-40">
                                                                         <Database size={12} />
                                                                         <p className="text-[9px] font-bold uppercase tracking-widest leading-none">Project Details</p>
                                                                     </div>
                                                                     <p className="text-xs opacity-60 font-medium leading-relaxed italic line-clamp-2">
                                                                         "{formData.details}"
                                                                     </p>
                                                                 </div>
                                                             </div>

                                                             {/* Decorative Corner Accents */}
                                                             <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/10 to-transparent opacity-20 pointer-events-none"></div>
                                                             <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent opacity-20 pointer-events-none"></div>
                                                        </div>

                                                        {/* Actions & Verification */}
                                                        <div className="flex flex-col gap-8">
                                                            <div className="flex items-center gap-4 px-4">
                                                                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent"></div>
                                                                <div className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-30 flex items-center gap-2">
                                                                    <Shield size={12} className="text-emerald-500" />
                                                                    Privacy Protected
                                                                </div>
                                                                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent"></div>
                                                            </div>

                                                            <div className="flex flex-col md:flex-row gap-6">
                                                                <button 
                                                                    type="button" 
                                                                    onClick={() => { playSound('click'); setStep(3); }}
                                                                    className={`flex-1 py-6 rounded-2xl border ${themed('border-neutral-200 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900', 'border-neutral-800 text-neutral-500 hover:border-white hover:text-white', 'border-blue-900/50 text-blue-500/50 hover:border-blue-400 hover:text-blue-400', 'border-[#433422]/20 text-[#433422]/50 hover:border-[#433422] hover:text-[#433422]')} font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3`}
                                                                >
                                                                    <Code size={14} /> Edit Details
                                                                </button>

                                                                <button 
                                                                    type="submit" 
                                                                    disabled={isLoading} 
                                                                    className={`flex-[2] py-6 relative group overflow-hidden ${themed('bg-neutral-900 text-white', 'bg-white text-black', 'bg-blue-500 text-black', 'bg-[#433422] text-[#fdf6e3]')} rounded-2xl font-black uppercase tracking-[0.5em] text-xs transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50`}
                                                                >
                                                                    {/* Hover Background Shine */}
                                                                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
                                                                    
                                                                    <div className="flex items-center justify-center gap-6 relative z-10">
                                                                        {isLoading ? (
                                                                            <div className="flex items-center gap-4">
                                                                                <Loader2 className="animate-spin" size={18} />
                                                                                <span>Sending...</span>
                                                                            </div>
                                                                        ) : (
                                                                            <>
                                                                                <Activity size={18} className="animate-pulse" /> 
                                                                                <span>Submit Proposal</span> 
                                                                                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            </div>
                                                            
                                                            <div className="flex items-center justify-center gap-6 opacity-20">
                                                                <div className="flex items-center gap-2">
                                                                    <Cloud size={10} />
                                                                    <span className="text-[8px] font-bold uppercase tracking-tighter">SECURE CLOUD SYNC</span>
                                                                </div>
                                                                <div className="w-1 h-1 rounded-full bg-current"></div>
                                                                <div className="flex items-center gap-2">
                                                                    <ShieldCheck size={10} className="lucide-shield-check" />
                                                                    <span className="text-[8px] font-bold uppercase tracking-tighter">DATA INTEGRITY VERIFIED</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </motion.div>
                                            )}
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Footer System Info */}
                    <div className="mt-32 pt-12 border-t flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
                         <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
                             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                             <span className="text-[10px] font-bold uppercase tracking-widest">Abort_Session</span>
                         </button>
                         <div className="flex gap-12">
                             <span className="text-[10px] font-bold uppercase tracking-widest">Identity_Shield_Active</span>
                             <span className="text-[10px] font-bold uppercase tracking-widest">Protocol_v.01.ALPHA</span>
                         </div>
                    </div>
                </div>
            </div>

            {/* Deploy Guide Component */}
            <DeployGuide 
                isOpen={showGuide} 
                onClose={() => setShowGuide(false)}
                currentStep={step}
                onStepChange={setStep}
            />

        </main>
    );
};

export default DeployPage;
