import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Workflow, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import SEO from '../components/SEO.jsx';

const AIAutomationPage = () => {
    const navigate = useNavigate();
    const { themed } = useUI();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const serviceData = {
        title: "AI Workflow Automation",
        subtitle: "System Optimization",
        icon: Workflow,
        overview: "Transform your business operations with intelligent automation. We identify bottlenecks and create custom workflows that run 24/7, freeing your team to focus on high-value tasks.",
        features: [
            "Custom n8n workflow design and implementation",
            "Python automation scripts for complex data processing",
            "Multi-platform API integrations (Slack, Google Workspace, CRM systems)",
            "Automated reporting and data synchronization",
            "Error handling and notification systems",
            "Scheduled task execution and monitoring"
        ],
        technologies: ["n8n", "Python", "REST APIs", "Webhooks", "Zapier", "Make.com"],
        deliverables: [
            "Fully configured automation workflows",
            "Custom Python scripts and documentation",
            "Integration setup and testing",
            "Training session for your team",
            "Ongoing monitoring and optimization"
        ]
    };

    // Theme-specific styles
    const accentText = themed('text-purple-600', 'text-purple-400', 'text-blue-400', 'text-amber-700');
    const accentBorder = themed('border-purple-500/50', 'border-purple-500/50', 'border-blue-500/50', 'border-amber-500/50');
    const cardBg = themed('bg-black/5', 'bg-white/5', 'bg-blue-500/5', 'bg-amber-900/5');
    const cardBorder = themed('border-black/10', 'border-white/10', 'border-blue-500/20', 'border-amber-900/10');
    const hoverBorder = themed('hover:border-purple-500/30', 'hover:border-purple-500/30', 'hover:border-blue-500/60', 'hover:border-amber-500/50');
    const pillBg = themed('bg-black/5', 'bg-white/5', 'bg-blue-500/10', 'bg-amber-900/5');
    const pillHover = themed('hover:bg-black/10', 'hover:bg-white/10', 'hover:bg-blue-500/20', 'hover:bg-amber-900/10');
    const btnGradient = themed(
        'from-purple-600 to-indigo-600',
        'from-purple-600 to-indigo-600',
        'from-blue-500 to-cyan-500',
        'from-amber-600 to-orange-700'
    );
    const orbColor = themed('bg-purple-900/10', 'bg-purple-900/10', 'bg-blue-500/10', 'bg-amber-500/10');

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
        <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white selection:bg-purple-500/30 transition-colors duration-500">
            <SEO 
                title="AI Workflow Automation | Jonald Penpillo"
                description="Jonald Penpillo specializes in intelligent business automation. He develops custom n8n workflows and Python scripts to optimize complex data processes and enterprise operations."
            />
            
            {/* Background Effects */}
            <div className={`absolute inset-0 ${themed('bg-[radial-gradient(#00000003_1px,transparent_1px)]', 'bg-[radial-gradient(#ffffff03_1px,transparent_1px)]', 'bg-[radial-gradient(#3b82f610_1px,transparent_1px)]', 'bg-[radial-gradient(#b5890010_1px,transparent_1px)]')} [background-size:32px_32px] pointer-events-none`}></div>
            <div className={`absolute top-0 right-0 w-[600px] h-[600px] ${orbColor} rounded-full blur-[120px] pointer-events-none`}></div>

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
                        onClick={() => navigate('/')}
                        className="mb-8 flex items-center gap-2 text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </motion.button>

                    {/* Overview */}
                    <motion.div variants={itemVariants} className="mb-16">
                        <h2 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">Overview</h2>
                        <p className={`text-neutral-600 dark:text-gray-400 leading-relaxed text-base md:text-lg border-l-4 ${accentBorder} pl-6`}>
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
                                    className={`flex items-start gap-4 ${cardBg} p-6 rounded-2xl border ${cardBorder} ${hoverBorder} transition-all duration-300`}
                                >
                                    <CheckCircle2 className={`w-6 h-6 ${accentText} mt-0.5 flex-shrink-0`} />
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
                                    className={`px-6 py-3 ${pillBg} border ${cardBorder} rounded-full text-base font-medium text-neutral-600 dark:text-gray-300 ${hoverBorder} ${pillHover} transition-all`}
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
                                    className={`flex items-center gap-4 p-6 bg-gradient-to-r ${themed('from-black/5', 'from-white/5', 'from-blue-500/10', 'from-amber-900/5')} to-transparent rounded-2xl border ${cardBorder}`}
                                >
                                    <div className={`w-10 h-10 rounded-full ${themed('bg-purple-500/20', 'bg-purple-500/20', 'bg-blue-500/30', 'bg-amber-500/20')} border ${accentBorder} flex items-center justify-center flex-shrink-0`}>
                                        <span className={`${accentText} font-bold`}>{idx + 1}</span>
                                    </div>
                                    <span className="text-neutral-600 dark:text-gray-300 text-lg">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div variants={itemVariants} className={`pt-8 border-t ${cardBorder}`}>
                        <button
                            onClick={() => navigate('/deploy')}
                            className={`w-full py-5 bg-gradient-to-r ${btnGradient} text-white font-bold text-lg rounded-2xl hover:brightness-110 transition-all shadow-[0_0_40px_rgba(168,85,247,0.3)] flex items-center justify-center gap-3 group`}
                        >
                            Get Started with AI Automation
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default AIAutomationPage;
