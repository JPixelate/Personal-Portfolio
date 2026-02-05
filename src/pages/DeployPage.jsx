import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, ChevronRight, Cpu, Globe, Workflow, MessageSquare, Shield, Zap, Send, Mail, User, Building, Phone, Calendar, DollarSign, Target, Sparkles, Code, Database, Cloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import SEO from '../components/SEO.jsx';

const DeployPage = () => {
    const navigate = useNavigate();
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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const solutionTypes = [
        {
            id: 'web',
            title: 'Web Architecture',
            icon: Globe,
            desc: 'High-performance React/Next.js platforms with cutting-edge design.',
            features: ['Next.js 14+', 'Headless CMS', 'SEO Optimized', 'Framer Motion'],
            color: 'text-blue-400',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'auto',
            title: 'Workflow Automation',
            icon: Workflow,
            desc: 'n8n & Python powered efficiency that eliminates manual tasks.',
            features: ['n8n Workflows', 'Python Scripts', 'API Integration', 'Error Handling'],
            color: 'text-purple-400',
            gradient: 'from-purple-500 to-pink-500'
        },
        {
            id: 'ai',
            title: 'AI Agent Systems',
            icon: MessageSquare,
            desc: 'Context-aware MCP intelligent agents that understand and act.',
            features: ['MCP Protocol', 'RAG Setup', 'Multi-Channel', 'Fine-Tuning'],
            color: 'text-emerald-400',
            gradient: 'from-emerald-500 to-teal-500'
        },
        {
            id: 'full',
            title: 'Full Ecosystem',
            icon: Cpu,
            desc: 'Complete digital transformation with integrated AI and automation.',
            features: ['All Services', 'Custom Stack', 'Full Support', 'Scalable'],
            color: 'text-indigo-400',
            gradient: 'from-indigo-500 to-purple-500'
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: "easeIn" } }
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleFinalSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const honeypot = form.elements["system_id"]?.value;

        if (honeypot) {
            console.warn("Bot detected.");
            return;
        }

        setIsSubmitted(true);
        console.log("Deploy Request Initialized:", formData);
    };

    const selectedSolution = solutionTypes.find(s => s.id === formData.solutionType);

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white selection:bg-indigo-500/30 pt-40 pb-20 px-8 relative overflow-hidden">
            <SEO
                title="Start a Project"
                description="Get a custom quote for your web architecture, workflow automation, or AI agent system needs."
            />
            {/* Enhanced Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(#00000002_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#4f46e505,transparent_50%)] pointer-events-none"></div>

            {/* Animated Gradient Orbs */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"
            ></motion.div>
            <motion.div
                animate={{
                    x: [0, -80, 0],
                    y: [0, 60, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"
            ></motion.div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => navigate('/')}
                    className="mb-8 flex items-center gap-2 text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </motion.button>

                {/* Enhanced Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span className="text-indigo-400 font-mono text-xs tracking-[0.3em] uppercase">
                            Service Inquiry
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-5xl font-black tracking-tight mb-6">
                        Get a Custom
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 ml-4">
                            Quote
                        </span>
                    </h1>
                    <p className="text-base md:text-lg text-neutral-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Let's architect your vision into reality. Our deployment process is designed to understand your unique requirements and deliver a solution that scales with your ambitions.
                    </p>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center gap-4 mt-12">
                        {[
                            { num: 1, label: 'Solution' },
                            { num: 2, label: 'Scope' },
                            { num: 3, label: 'Details' },
                            { num: 4, label: 'Review' }
                        ].map((item, i) => (
                            <div key={item.num} className="flex items-center gap-2">
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${step >= item.num
                                        ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]'
                                        : 'bg-black/5 dark:bg-white/5 text-neutral-500 dark:text-gray-500 border border-black/10 dark:border-white/10'
                                        }`}>
                                        {step > item.num ? <Check className="w-5 h-5" /> : item.num}
                                    </div>
                                    <span className={`text-xs font-medium transition-colors ${step >= item.num ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-500 dark:text-gray-500'
                                        }`}>
                                        {item.label}
                                    </span>
                                </div>
                                {i < 3 && (
                                    <div className={`w-16 h-px mt-[-20px] transition-colors duration-500 ${step > item.num ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-black/10 dark:bg-white/10'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Enhanced Form Container */}
                <div className="bg-white/80 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                    <AnimatePresence mode="wait">
                        {isSubmitted ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-16 relative z-10"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(99,102,241,0.4)]"
                                >
                                    <Check className="text-white w-12 h-12" />
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-4xl font-black mb-4 text-neutral-900 dark:text-white"
                                >
                                    Request Received
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-neutral-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed mb-8"
                                >
                                    Your architecture parameters have been transmitted. Our lead engineers will review the request and contact you within <span className="font-bold text-indigo-600 dark:text-indigo-400">24 hours</span>.
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex flex-col sm:flex-row gap-4 justify-center"
                                >
                                    <button
                                        onClick={() => window.location.href = '/'}
                                        className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full hover:from-indigo-500 hover:to-purple-500 transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2"
                                    >
                                        Return to Command Center
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            </motion.div>
                        ) : (
                            <>
                                {/* Step 1: Solution Selection */}
                                {step === 1 && (
                                    <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="relative z-10">
                                        <div className="mb-8">
                                            <h2 className="text-3xl font-black mb-3 flex items-center gap-3 text-neutral-900 dark:text-white">
                                                <Zap className="text-indigo-400 w-8 h-8" />
                                                Select Your Architecture
                                            </h2>
                                            <p className="text-neutral-600 dark:text-gray-400">Choose the solution that best fits your digital transformation goals.</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {solutionTypes.map((type) => (
                                                <motion.button
                                                    key={type.id}
                                                    onClick={() => { setFormData({ ...formData, solutionType: type.id }); nextStep(); }}
                                                    whileHover={{ y: -5 }}
                                                    className={`p-8 rounded-2xl border text-left transition-all duration-300 group relative overflow-hidden ${formData.solutionType === type.id
                                                        ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.2)]'
                                                        : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 hover:bg-black/10 dark:hover:bg-white/10'
                                                        }`}
                                                >
                                                    {/* Gradient Overlay on Hover */}
                                                    <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                                                    <div className="relative z-10">
                                                        <div className="flex items-start justify-between mb-4">
                                                            <type.icon className={`w-12 h-12 transition-all duration-300 ${formData.solutionType === type.id ? type.color : 'text-neutral-500 dark:text-gray-500 group-hover:text-neutral-900 dark:group-hover:text-white'
                                                                }`} />
                                                            {formData.solutionType === type.id && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center"
                                                                >
                                                                    <Check className="w-4 h-4 text-white" />
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                        <h3 className="font-black text-xl mb-2 text-neutral-900 dark:text-white">{type.title}</h3>
                                                        <p className="text-sm text-neutral-600 dark:text-gray-400 leading-relaxed mb-4">{type.desc}</p>

                                                        {/* Feature Pills */}
                                                        <div className="flex flex-wrap gap-2">
                                                            {type.features.map((feature, idx) => (
                                                                <span key={idx} className="text-xs px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-neutral-600 dark:text-gray-400">
                                                                    {feature}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2: Project Parameters */}
                                {step === 2 && (
                                    <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="relative z-10">
                                        <div className="mb-8">
                                            <h2 className="text-3xl font-black mb-3 flex items-center gap-3 text-neutral-900 dark:text-white">
                                                <Target className="text-indigo-400 w-8 h-8" />
                                                Project Scope
                                            </h2>
                                            <p className="text-neutral-600 dark:text-gray-400">Define your investment and timeline expectations.</p>
                                        </div>

                                        {/* Selected Solution Summary */}
                                        {selectedSolution && (
                                            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedSolution.gradient} flex items-center justify-center`}>
                                                        <selectedSolution.icon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono uppercase tracking-wider">Selected Architecture</p>
                                                        <p className="font-bold text-lg text-neutral-900 dark:text-white">{selectedSolution.title}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <label className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                                                    <DollarSign className="w-4 h-4 text-indigo-400" />
                                                    Estimated Investment
                                                </label>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {['$2k - $5k', '$5k - $10k', '$10k - $25k', '$25k+'].map((b) => (
                                                        <button
                                                            key={b}
                                                            onClick={() => setFormData({ ...formData, budget: b })}
                                                            className={`py-4 rounded-xl border text-sm font-bold transition-all ${formData.budget === b
                                                                ? 'bg-gradient-to-br from-indigo-500 to-purple-500 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                                                                : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-indigo-500/50 text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'
                                                                }`}
                                                        >
                                                            {b}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                                                    <Calendar className="w-4 h-4 text-indigo-400" />
                                                    Target Timeline
                                                </label>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {['< 1 Month', '1-3 Months', '3-6 Months', 'Ongoing'].map((t) => (
                                                        <button
                                                            key={t}
                                                            onClick={() => setFormData({ ...formData, timeline: t })}
                                                            className={`py-4 rounded-xl border text-sm font-bold transition-all ${formData.timeline === t
                                                                ? 'bg-gradient-to-br from-indigo-500 to-purple-500 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                                                                : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-indigo-500/50 text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white'
                                                                }`}
                                                        >
                                                            {t}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-12 flex justify-between">
                                            <button onClick={prevStep} className="px-6 py-3 text-neutral-500 dark:text-gray-500 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium flex items-center gap-2">
                                                <ChevronRight className="w-4 h-4 rotate-180" />
                                                Back
                                            </button>
                                            <button
                                                onClick={nextStep}
                                                disabled={!formData.budget || !formData.timeline}
                                                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-500 hover:to-purple-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center gap-2"
                                            >
                                                Continue
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Contact & Details */}
                                {step === 3 && (
                                    <motion.div key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="relative z-10">
                                        <div className="mb-8">
                                            <h2 className="text-3xl font-black mb-3 flex items-center gap-3 text-neutral-900 dark:text-white">
                                                <MessageSquare className="text-indigo-400 w-8 h-8" />
                                                Your Details
                                            </h2>
                                            <p className="text-neutral-600 dark:text-gray-400">Tell us about yourself and your project vision.</p>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Contact Information Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white">
                                                        <User className="w-4 h-4 text-indigo-400" />
                                                        Full Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        placeholder="John Doe"
                                                        className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-xl px-4 py-4 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-gray-700 focus:outline-none focus:border-indigo-500 transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white">
                                                        <Mail className="w-4 h-4 text-indigo-400" />
                                                        Email Address *
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        placeholder="john@company.com"
                                                        className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-xl px-4 py-4 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-gray-700 focus:outline-none focus:border-indigo-500 transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white">
                                                        <Building className="w-4 h-4 text-indigo-400" />
                                                        Company Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.company}
                                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                                        placeholder="Acme Inc."
                                                        className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-xl px-4 py-4 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-gray-700 focus:outline-none focus:border-indigo-500 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white">
                                                        <Phone className="w-4 h-4 text-indigo-400" />
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        placeholder="+1 (555) 000-0000"
                                                        className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-xl px-4 py-4 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-gray-700 focus:outline-none focus:border-indigo-500 transition-all"
                                                    />
                                                </div>
                                            </div>

                                            {/* Project Details */}
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white">
                                                    <Code className="w-4 h-4 text-indigo-400" />
                                                    Technical Objectives *
                                                </label>
                                                <textarea
                                                    value={formData.details}
                                                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                                    placeholder="Describe the systems you want to build, automate, or enhance. Include any specific technical requirements, integrations, or challenges you're facing..."
                                                    className="w-full h-48 bg-transparent border border-black/10 dark:border-white/10 rounded-2xl p-6 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-gray-700 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                                                    required
                                                />
                                                <p className="text-xs text-neutral-500 dark:text-gray-500">Be as detailed as possible to help us understand your vision.</p>
                                            </div>
                                        </div>

                                        <div className="mt-12 flex justify-between">
                                            <button onClick={prevStep} className="px-6 py-3 text-neutral-500 dark:text-gray-500 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium flex items-center gap-2">
                                                <ChevronRight className="w-4 h-4 rotate-180" />
                                                Back
                                            </button>
                                            <button
                                                onClick={nextStep}
                                                disabled={!formData.name || !formData.email || !formData.details}
                                                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-500 hover:to-purple-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center gap-2"
                                            >
                                                Review Request
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 4: Final Review */}
                                {step === 4 && (
                                    <motion.div key="step4" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="relative z-10">
                                        <div className="mb-8">
                                            <h2 className="text-3xl font-black mb-3 flex items-center gap-3 text-neutral-900 dark:text-white">
                                                <Send className="text-indigo-400 w-8 h-8" />
                                                Final Review
                                            </h2>
                                            <p className="text-neutral-600 dark:text-gray-400">Confirm your deployment request details before submission.</p>
                                        </div>

                                        <form onSubmit={handleFinalSubmit}>
                                            {/* Honeypot Field */}
                                            <div className="hidden" aria-hidden="true">
                                                <input type="text" name="system_id" tabIndex="-1" autoComplete="off" />
                                            </div>

                                            <div className="space-y-6 mb-12">
                                                {/* Solution Summary Card */}
                                                {selectedSolution && (
                                                    <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20">
                                                        <div className="flex items-start gap-4">
                                                            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedSolution.gradient} flex items-center justify-center flex-shrink-0`}>
                                                                <selectedSolution.icon className="w-8 h-8 text-white" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono uppercase tracking-wider mb-1">Selected Architecture</p>
                                                                <h3 className="font-black text-2xl text-neutral-900 dark:text-white mb-2">{selectedSolution.title}</h3>
                                                                <p className="text-sm text-neutral-600 dark:text-gray-400">{selectedSolution.desc}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Project Details Grid */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="p-5 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <DollarSign className="w-4 h-4 text-indigo-400" />
                                                            <span className="text-xs text-neutral-500 dark:text-gray-500 uppercase tracking-wider font-mono">Investment</span>
                                                        </div>
                                                        <span className="font-black text-xl text-neutral-900 dark:text-white">{formData.budget}</span>
                                                    </div>
                                                    <div className="p-5 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Calendar className="w-4 h-4 text-indigo-400" />
                                                            <span className="text-xs text-neutral-500 dark:text-gray-500 uppercase tracking-wider font-mono">Timeline</span>
                                                        </div>
                                                        <span className="font-black text-xl text-neutral-900 dark:text-white">{formData.timeline}</span>
                                                    </div>
                                                </div>

                                                {/* Contact Information */}
                                                <div className="p-6 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                                                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-4 uppercase tracking-wider">Contact Information</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-xs text-neutral-500 dark:text-gray-500 mb-1">Name</p>
                                                            <p className="font-medium text-neutral-900 dark:text-white">{formData.name}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-neutral-500 dark:text-gray-500 mb-1">Email</p>
                                                            <p className="font-medium text-neutral-900 dark:text-white">{formData.email}</p>
                                                        </div>
                                                        {formData.company && (
                                                            <div>
                                                                <p className="text-xs text-neutral-500 dark:text-gray-500 mb-1">Company</p>
                                                                <p className="font-medium text-neutral-900 dark:text-white">{formData.company}</p>
                                                            </div>
                                                        )}
                                                        {formData.phone && (
                                                            <div>
                                                                <p className="text-xs text-neutral-500 dark:text-gray-500 mb-1">Phone</p>
                                                                <p className="font-medium text-neutral-900 dark:text-white">{formData.phone}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Project Details */}
                                                <div className="p-6 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                                                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-3 uppercase tracking-wider">Technical Objectives</h4>
                                                    <p className="text-sm text-neutral-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{formData.details}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <button
                                                    type="submit"
                                                    className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-full hover:from-indigo-500 hover:to-purple-500 transition-all shadow-[0_0_40px_rgba(79,70,229,0.4)] flex items-center justify-center gap-3 group"
                                                >
                                                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                    Submit Request
                                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={prevStep}
                                                    className="w-full py-3 text-neutral-500 dark:text-gray-500 hover:text-neutral-900 dark:hover:text-white transition-colors text-sm font-medium"
                                                >
                                                    Edit Details
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* Trust Indicators */}
                {!isSubmitted && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        <div className="flex items-center gap-4 p-6 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                                <Shield className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <p className="font-bold text-neutral-900 dark:text-white">Secure & Private</p>
                                <p className="text-xs text-neutral-600 dark:text-gray-500">Your data is encrypted</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-6 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                                <Zap className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <p className="font-bold text-neutral-900 dark:text-white">24hr Response</p>
                                <p className="text-xs text-neutral-600 dark:text-gray-500">Fast turnaround time</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-6 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                <Check className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <p className="font-bold text-neutral-900 dark:text-white">No Commitment</p>
                                <p className="text-xs text-neutral-600 dark:text-gray-500">Free consultation</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default DeployPage;
