import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, CheckCircle2, ArrowRight, ArrowLeft, Zap, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIAgentsPricingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const pricingData = {
        title: "AI Agents Package",
        price: "$2,500",
        period: "starting from",
        icon: Bot,
        iconColor: "text-emerald-400",
        tagline: "Deploy intelligent AI agents that understand, remember, and act",
        overview: "Our AI Agents package delivers context-aware chatbots powered by the Model Context Protocol (MCP). These aren't simple FAQ bots—they're intelligent assistants that integrate with your systems, remember conversations, and execute real tasks autonomously.",

        included: [
            "Custom MCP-powered AI agent development",
            "RAG (Retrieval-Augmented Generation) setup",
            "Training on your proprietary documentation and data",
            "Context-aware conversation with memory retention",
            "Multi-channel deployment (web, Slack, Discord, WhatsApp)",
            "Function calling for task execution",
            "Vector database integration (Pinecone/Weaviate)",
            "Analytics dashboard for conversation insights",
            "Fallback handling and human handoff",
            "API integration with your existing systems",
            "3 rounds of training refinement",
            "1 month of monitoring and optimization"
        ],

        addOns: [
            { name: "Voice integration (phone/voice calls)", price: "+$1,500" },
            { name: "Advanced fine-tuning on GPT-4", price: "+$1,200" },
            { name: "Multi-language support (5+ languages)", price: "+$900" },
            { name: "Custom knowledge base expansion", price: "+$600" },
            { name: "Sentiment analysis and reporting", price: "+$800" },
            { name: "Monthly retraining & updates", price: "+$300/month" }
        ],

        timeline: [
            { phase: "Discovery & Data Collection", duration: "3-5 days", description: "Gather documentation, define use cases, and collect training data" },
            { phase: "RAG Setup & Training", duration: "5-7 days", description: "Build knowledge base, configure vector database, and train the model" },
            { phase: "Integration & Testing", duration: "5-7 days", description: "Integrate with platforms, test conversations, and refine responses" },
            { phase: "Deployment & Optimization", duration: "3-4 days", description: "Deploy to production, monitor performance, and optimize accuracy" }
        ],

        idealFor: [
            "Customer support teams handling repetitive queries",
            "Sales teams needing 24/7 lead qualification",
            "HR departments automating candidate screening",
            "SaaS companies providing in-app assistance",
            "E-commerce businesses needing product recommendations"
        ]
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
    };

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white selection:bg-emerald-500/30">
            <div className="absolute inset-0 bg-[radial-gradient(#00000003_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative pt-40 pb-20 px-8">
                <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-5xl mx-auto">

                    <motion.button variants={itemVariants} onClick={() => navigate('/#pricing')} className="mb-8 flex items-center gap-2 text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Pricing
                    </motion.button>

                    {/* Header */}
                    <motion.div variants={itemVariants} className="mb-12">
                        <div className={`inline-flex p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 ${pricingData.iconColor} mb-6`}>
                            <pricingData.icon className="w-12 h-12" />
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-5xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight">
                            {pricingData.title}
                        </h1>
                        <div className="flex items-baseline gap-3 mb-4">
                            <span className="text-5xl font-black text-emerald-600 dark:text-emerald-400">{pricingData.price}</span>
                            <span className="text-neutral-500 dark:text-gray-500 text-lg">/ {pricingData.period}</span>
                        </div>
                        <p className="text-xl text-neutral-600 dark:text-gray-400">{pricingData.tagline}</p>
                    </motion.div>

                    {/* Overview */}
                    <motion.div variants={itemVariants} className="mb-16">
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Package Overview</h2>
                        <p className="text-neutral-600 dark:text-gray-400 leading-relaxed text-xl border-l-4 border-emerald-500/50 pl-6">
                            {pricingData.overview}
                        </p>
                    </motion.div>

                    {/* What's Included */}
                    <motion.div variants={itemVariants} className="mb-16">
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">What's Included</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pricingData.included.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3 bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-black/10 dark:border-white/10">
                                    <CheckCircle2 className={`w-5 h-5 ${pricingData.iconColor} mt-0.5 flex-shrink-0`} />
                                    <span className="text-neutral-600 dark:text-gray-300 text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Add-Ons */}
                    <motion.div variants={itemVariants} className="mb-16">
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">Optional Add-Ons</h2>
                        <div className="space-y-3">
                            {pricingData.addOns.map((addon, idx) => (
                                <div key={idx} className="flex items-center justify-between p-5 bg-gradient-to-r from-black/5 to-transparent dark:from-white/5 dark:to-transparent rounded-xl border border-black/10 dark:border-white/10 hover:border-emerald-500/30 transition-colors">
                                    <span className="text-neutral-600 dark:text-gray-300">{addon.name}</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{addon.price}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Timeline */}
                    <motion.div variants={itemVariants} className="mb-16">
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8 flex items-center gap-3">
                            <Clock className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                            Project Timeline
                        </h2>
                        <div className="space-y-4">
                            {pricingData.timeline.map((phase, idx) => (
                                <div key={idx} className="relative pl-8 pb-6 border-l-2 border-black/10 dark:border-white/10 last:border-l-0 last:pb-0">
                                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-neutral-950"></div>
                                    <div className="bg-black/5 dark:bg-white/5 p-5 rounded-xl border border-black/10 dark:border-white/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{phase.phase}</h3>
                                            <span className="text-emerald-600 dark:text-emerald-400 text-sm font-mono">{phase.duration}</span>
                                        </div>
                                        <p className="text-neutral-600 dark:text-gray-400 text-sm">{phase.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Ideal For */}
                    <motion.div variants={itemVariants} className="mb-16">
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8 flex items-center gap-3">
                            <Users className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                            Ideal For
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pricingData.idealFor.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10">
                                    <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                    <span className="text-neutral-600 dark:text-gray-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div variants={itemVariants} className="pt-8 border-t border-black/10 dark:border-white/10">
                        <button onClick={() => navigate('/deploy')} className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg rounded-2xl hover:from-emerald-500 hover:to-teal-500 transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3 group">
                            Start Your AI Project
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default AIAgentsPricingPage;
