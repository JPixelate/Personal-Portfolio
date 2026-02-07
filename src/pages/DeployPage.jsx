import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, ChevronRight, Cpu, Globe, Workflow, MessageSquare, Shield, Zap, Send, Mail, User, Building, Phone, Calendar, DollarSign, Target, Sparkles, Code, Database, Cloud, Loader2, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import SEO from '../components/SEO.jsx';

const DeployPage = () => {
    const navigate = useNavigate();
    const { themed, blueprintMode, playSound } = useUI();
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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                            <span className={`text-xs font-bold uppercase tracking-widest block mb-4 ${accentText}`}>Deployment Protocol</span>
                            <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${themed('text-neutral-900', 'text-neutral-100', 'text-blue-500', 'text-[#433422]')}`}>Initialize Solution.</h1>
                        </div>
                        {blueprintMode && (
                            <div className="flex items-center gap-3 text-blue-500 font-mono text-[10px]">
                                <Activity size={14} />
                                <span>AUTH_HANDSHAKE: OK</span>
                            </div>
                        )}
                        <p className="hidden md:block text-neutral-400 font-medium text-sm">ARCHITECT_SYNC</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
                        {/* Left Column: Progress & Logic */}
                        <div className="lg:col-span-4 space-y-12">
                            <div className={`p-10 rounded-[2rem] border ${cardBg} ${accentBorder} ${blueprintMode ? 'blueprint-active-outline' : ''}`} data-blueprint-label="PHASE_LOG">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-12 opacity-30">Workflow_Status</h3>
                                <div className="space-y-10">
                                    {[
                                        { id: 1, label: 'Architecture', sub: 'Select core build' },
                                        { id: 2, label: 'Parameters', sub: 'Define scope & timeline' },
                                        { id: 3, label: 'Identity', sub: 'Authentication details' },
                                        { id: 4, label: 'Execution', sub: 'Final review' }
                                    ].map((item) => (
                                        <div key={item.id} className={`flex gap-6 transition-all duration-500 ${step >= item.id ? 'opacity-100' : 'opacity-20'}`}>
                                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${step >= item.id ? `${themed('bg-neutral-900 text-white border-neutral-900', 'bg-blue-500 text-black border-blue-500', 'bg-blue-500 text-black border-blue-500', 'bg-[#433422] text-[#fdf6e3] border-[#433422]')}` : 'border-neutral-200'}`}>
                                                {step > item.id ? <Check size={12} strokeWidth={4} /> : `0${item.id}`}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold uppercase tracking-widest">{item.label}</p>
                                                <p className="text-[10px] font-medium opacity-50 uppercase">{item.sub}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="hidden lg:block space-y-4 opacity-40 px-6">
                                <div className="flex items-center gap-3 opacity-60">
                                    <Shield size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">End_to_End_Encryption</span>
                                </div>
                                <div className="flex items-center gap-3 opacity-60">
                                    <Zap size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">High_Prio_Transmission</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Execution Interface */}
                        <div className="lg:col-span-8">
                            <div className={`min-h-[600px] p-8 md:p-16 rounded-[2rem] border transition-all duration-700 ${cardBg} ${accentBorder} ${blueprintMode ? 'blueprint-active-outline' : ''}`} data-blueprint-label="TERMINAL_UI">
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
                                                    <div className="mb-12">
                                                        <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Select Architecture</h3>
                                                        <p className="opacity-50 text-sm font-medium">Choose the foundation for your technical ecosystem.</p>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {solutionTypes.map((type) => (
                                                            <button 
                                                                key={type.id} 
                                                                onClick={() => { playSound('click'); setFormData({...formData, solutionType: type.id}); setStep(2); }}
                                                                className={`p-10 rounded-[2rem] border text-left transition-all duration-500 group relative overflow-hidden ${formData.solutionType === type.id ? `${themed('bg-neutral-100 border-neutral-900', 'bg-neutral-800 border-white', 'bg-blue-900/40 border-blue-400', 'bg-[#fdf6e3] border-[#433422]')}` : `${inputBorder} hover:border-neutral-400`}`}
                                                            >
                                                                <type.icon size={32} className={`mb-8 transition-colors ${formData.solutionType === type.id ? type.color : 'opacity-40'}`} />
                                                                <h4 className="font-extrabold text-xl mb-2 uppercase tracking-tight">{type.title}</h4>
                                                                <p className="text-xs font-medium opacity-50 mb-8">{type.desc}</p>
                                                                <div className="flex gap-2">
                                                                    {type.features.map((f, i) => (<span key={i} className="text-[8px] font-black uppercase tracking-tighter opacity-30">{f}</span>))}
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {step === 2 && (
                                                <motion.div key="s2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-16">
                                                    {/* Selected Breadcrumb Style */}
                                                    <div className="flex items-center gap-6 p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-800/40 border border-transparent">
                                                        <div className={`w-12 h-12 rounded-xl ${selectedSolution?.solidBg} flex items-center justify-center text-white shadow-lg`}>
                                                            {selectedSolution?.icon && <selectedSolution.icon size={24} />}
                                                        </div>
                                                        <p className="text-xs font-black uppercase tracking-[0.2em]">{selectedSolution?.title} <span className="opacity-30 ml-2">ARCH_ID_LOCKED</span></p>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                        <div className="space-y-6">
                                                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-2">Investment_Range</label>
                                                            <div className="grid grid-cols-1 gap-3">
                                                                {['$2k - $5k', '$5k - $10k', '$10k - $25k', '$25k+'].map(b => (
                                                                    <button key={b} onClick={() => { playSound('click'); setFormData({...formData, budget: b})}} className={`py-5 px-8 rounded-xl border text-sm font-black transition-all text-left ${formData.budget === b ? `${themed('bg-neutral-900 text-white border-neutral-900', 'bg-blue-500 text-black border-blue-500', 'bg-blue-500 text-black border-blue-500', 'bg-[#433422] text-[#fdf6e3] border-[#433422]')}` : 'bg-transparent border-neutral-200 opacity-60 hover:opacity-100'}`}>
                                                                        {b}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-6">
                                                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-2">Temporal_SLA</label>
                                                            <div className="grid grid-cols-1 gap-3">
                                                                {['< 1 Month', '1-3 Months', '3-6 Months', 'Ongoing'].map(t => (
                                                                    <button key={t} onClick={() => { playSound('click'); setFormData({...formData, timeline: t})}} className={`py-5 px-8 rounded-xl border text-sm font-black transition-all text-left ${formData.timeline === t ? `${themed('bg-neutral-900 text-white border-neutral-900', 'bg-blue-500 text-black border-blue-500', 'bg-blue-500 text-black border-blue-500', 'bg-[#433422] text-[#fdf6e3] border-[#433422]')}` : 'bg-transparent border-neutral-200 opacity-60 hover:opacity-100'}`}>
                                                                        {t}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between pt-12 border-t border-neutral-100 dark:border-neutral-800">
                                                        <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100">Prev.exe</button>
                                                        <button onClick={() => setStep(3)} disabled={!formData.budget || !formData.timeline} className={`px-12 py-5 ${themed('bg-neutral-900 text-white', 'bg-white text-black', 'bg-white text-black', 'bg-[#433422] text-[#fdf6e3]')} rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl disabled:opacity-20`}>Next_Phase</button>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {step === 3 && (
                                                <motion.div key="s3" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-10">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        {['name', 'email', 'company', 'phone'].map(field => (
                                                            <div key={field} className="space-y-3">
                                                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-2">{field}.identity</label>
                                                                <input 
                                                                    type={field === 'email' ? 'email' : 'text'}
                                                                    value={formData[field]}
                                                                    onChange={e => setFormData({...formData, [field]: e.target.value})}
                                                                    className={`w-full p-6 bg-transparent border ${themed('border-neutral-200 focus:border-neutral-900', 'border-neutral-800 focus:border-white', 'border-blue-900/40 focus:border-blue-400', 'border-[#433422]/20 focus:border-[#433422]')} rounded-2xl font-bold transition-all outline-none`}
                                                                    placeholder={`Input ${field} string...`}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-2">requirements.log</label>
                                                        <textarea 
                                                            value={formData.details}
                                                            onChange={e => setFormData({...formData, details: e.target.value})}
                                                            className={`w-full h-40 p-8 bg-transparent border ${themed('border-neutral-200 focus:border-neutral-900', 'border-neutral-800 focus:border-white', 'border-blue-900/40 focus:border-blue-400', 'border-[#433422]/20 focus:border-[#433422]')} rounded-3xl font-bold transition-all outline-none resize-none`}
                                                            placeholder="Synthesize target objectives..."
                                                        />
                                                    </div>
                                                    <div className="flex justify-between pt-8">
                                                        <button onClick={() => setStep(2)} className="text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100">Prev.exe</button>
                                                        <button onClick={() => setStep(4)} disabled={!formData.name || !formData.email || !formData.details} className={`px-12 py-5 ${themed('bg-neutral-900 text-white', 'bg-white text-black', 'bg-white text-black', 'bg-[#433422] text-[#fdf6e3]')} rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl disabled:opacity-20`}>Validate_Sync</button>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {step === 4 && (
                                                <motion.div key="s4" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                                                    <form onSubmit={handleFinalSubmit} className="space-y-12">
                                                        <div className="hidden" aria-hidden="true"><input type="text" name="system_id" /></div>
                                                        <div className={`p-10 rounded-[2rem] border ${themed('bg-neutral-900 text-white', 'bg-white text-neutral-900', 'bg-blue-600 text-white', 'bg-[#433422] text-[#fdf6e3]')} shadow-2xl space-y-12 relative overflow-hidden`}>
                                                             <div className="absolute top-0 right-0 p-12 opacity-10"><Send size={120} /></div>
                                                             <div className="relative z-10 flex items-center gap-8">
                                                                 <div className="w-20 h-20 rounded-[1.5rem] bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                                                     {selectedSolution?.icon && <selectedSolution.icon size={40} />}
                                                                 </div>
                                                                 <div>
                                                                     <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mb-1">Target_Architecture</p>
                                                                     <h3 className="text-4xl font-black uppercase tracking-tighter">{selectedSolution?.title}</h3>
                                                                 </div>
                                                             </div>
                                                             <div className="relative z-10 grid grid-cols-2 gap-12 pt-10 border-t border-white/10">
                                                                 <div>
                                                                     <p className="text-[9px] font-bold uppercase opacity-40 mb-2">Sync_Entity</p>
                                                                     <p className="text-xl font-bold">{formData.name}</p>
                                                                     <p className="text-xs opacity-60">{formData.email}</p>
                                                                 </div>
                                                                 <div>
                                                                     <p className="text-[9px] font-bold uppercase opacity-40 mb-2">Resource_Allocation</p>
                                                                     <p className="text-xl font-bold">{formData.budget}</p>
                                                                     <p className="text-xs opacity-60">{formData.timeline}</p>
                                                                 </div>
                                                             </div>
                                                        </div>

                                                        <div className="flex flex-col gap-6">
                                                            <button type="submit" disabled={isLoading} className={`w-full py-6 ${themed('bg-neutral-900 text-white', 'bg-white text-black', 'bg-blue-500 text-black', 'bg-[#433422] text-[#fdf6e3]')} rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-center gap-6 group hover:scale-[1.01] transition-all`}>
                                                                {isLoading ? <Loader2 className="animate-spin" /> : <><Activity size={18} /> Execute_Transmission <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" /></>}
                                                            </button>
                                                            <button type="button" onClick={() => setStep(3)} className="text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 mx-auto">Re-Configure_Details</button>
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

            {blueprintMode && (
                <div className="fixed bottom-8 right-8 z-[100] font-mono text-[9px] text-blue-500/40 pointer-events-none uppercase tracking-tighter text-right">
                    <div className="mb-1">DEPLOY_MODULE: 0xFD42</div>
                    <div>LATENCY: 14MS_ASYNC</div>
                </div>
            )}
        </main>
    );
};

export default DeployPage;
