import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareCode, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MCPChatbotsPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const serviceData = {
        title: "MCP-Powered Chatbots",
        subtitle: "Next-Gen Conversational AI",
        icon: MessageSquareCode,
        iconColor: "text-emerald-400",
        overview: "Deploy intelligent AI agents that don't just chat—they understand, remember, and act. Our MCP-powered solutions integrate seamlessly with your existing systems to provide autonomous assistance.",
        features: [
            "Context-aware conversations with memory retention",
            "RAG (Retrieval-Augmented Generation) for accurate, data-grounded responses",
            "Custom training on your proprietary documentation and data",
            "Multi-channel deployment (web, Slack, Discord, WhatsApp)",
            "Function calling for executing real tasks (bookings, queries, updates)",
            "Analytics dashboard for conversation insights"
        ],
        technologies: ["OpenAI GPT-4", "Claude", "LangChain", "Pinecone", "MCP", "Vector Databases"],
        deliverables: [
            "Fully trained AI chatbot agent",
            "Custom knowledge base integration",
            "Multi-platform deployment",
            "Analytics and monitoring dashboard",
            "Continuous learning and improvement system"
        ]
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white selection:bg-emerald-500/30">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(#00000003_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative pt-40 pb-20 px-8">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="max-w-5xl mx-auto"
                >
                    {/* Back Button */}
                    <motion.button
                        variants={itemVariants}
                        onClick={() => navigate('/#section-services')}
                        className="mb-8 flex items-center gap-2 text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Services
                    </motion.button>

                    {/* Overview */}
                    <motion.div variants={itemVariants} className="mb-16">
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Overview</h2>
                        <p className="text-neutral-600 dark:text-gray-400 leading-relaxed text-base md:text-lg border-l-4 border-emerald-500/50 pl-6">
                            {serviceData.overview}
                        </p>
                    </motion.div>

                    {/* Features */}
                    <motion.div variants={itemVariants} className="mb-16">
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">Key Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {serviceData.features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants}
                                    className="flex items-start gap-4 bg-black/5 dark:bg-white/5 p-6 rounded-2xl border border-black/10 dark:border-white/10 hover:border-emerald-500/30 transition-colors"
                                >
                                    <CheckCircle2 className={`w-6 h-6 ${serviceData.iconColor} mt-0.5 flex-shrink-0`} />
                                    <span className="text-neutral-600 dark:text-gray-300 text-lg">{feature}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Technologies */}
                    <motion.div variants={itemVariants} className="mb-16">
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">Technologies We Use</h2>
                        <div className="flex flex-wrap gap-4">
                            {serviceData.technologies.map((tech, idx) => (
                                <span
                                    key={idx}
                                    className="px-6 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-base font-medium text-neutral-600 dark:text-gray-300 hover:border-emerald-500/50 hover:bg-black/10 dark:hover:bg-white/10 transition-all"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Deliverables */}
                    <motion.div variants={itemVariants} className="mb-16">
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">What You'll Receive</h2>
                        <div className="space-y-4">
                            {serviceData.deliverables.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-4 p-6 bg-gradient-to-r from-black/5 to-transparent dark:from-white/5 dark:to-transparent rounded-2xl border border-black/10 dark:border-white/10"
                                >
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{idx + 1}</span>
                                    </div>
                                    <span className="text-neutral-600 dark:text-gray-300 text-lg">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div variants={itemVariants} className="pt-8 border-t border-black/10 dark:border-white/10">
                        <button
                            onClick={() => navigate('/deploy')}
                            className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg rounded-2xl hover:from-emerald-500 hover:to-teal-500 transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3 group"
                        >
                            Get Started with MCP Chatbots
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default MCPChatbotsPage;
