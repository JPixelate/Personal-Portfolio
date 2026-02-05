import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Workflow, CheckCircle2, ArrowRight, ArrowLeft, Zap, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AutomationPricingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const pricingData = {
        title: "Automation Package",
        price: "$1,500",
        period: "starting from",
        icon: Workflow,
        iconColor: "text-purple-400",
        tagline: "Eliminate manual tasks and scale your operations effortlessly",
        overview: "Our Automation package transforms repetitive business processes into intelligent workflows that run 24/7. Perfect for businesses drowning in manual data entry, reporting, and cross-platform synchronization tasks.",

        included: [
            "Custom n8n workflow design and setup",
            "Up to 5 complex automation workflows",
            "Python scripting for advanced data processing",
            "Multi-platform API integrations (Slack, Google Workspace, CRM)",
            "Automated email notifications and alerts",
            "Error handling and logging system",
            "Scheduled task execution (daily, weekly, monthly)",
            "Data transformation and validation",
            "Webhook setup and management",
            "Documentation and workflow diagrams",
            "2 rounds of workflow refinement",
            "2 weeks of post-launch monitoring"
        ],

        addOns: [
            { name: "Additional workflow (beyond 5)", price: "+$300 each" },
            { name: "Advanced AI integration (GPT-4, Claude)", price: "+$800" },
            { name: "Custom dashboard for monitoring", price: "+$1,200" },
            { name: "Database integration (PostgreSQL, MongoDB)", price: "+$600" },
            { name: "Zapier/Make.com migration", price: "+$500" },
            { name: "Monthly maintenance & updates", price: "+$200/month" }
        ],

        timeline: [
            { phase: "Process Audit", duration: "2-3 days", description: "Analyze current workflows and identify automation opportunities" },
            { phase: "Workflow Design", duration: "3-4 days", description: "Design automation logic, create flowcharts, and plan integrations" },
            { phase: "Development & Testing", duration: "5-7 days", description: "Build workflows, integrate APIs, and conduct thorough testing" },
            { phase: "Deployment & Training", duration: "2-3 days", description: "Deploy to production, team training, and documentation handover" }
        ],

        idealFor: [
            "Teams spending hours on manual data entry",
            "Businesses syncing data across multiple platforms",
            "Companies needing automated reporting",
            "Operations teams managing repetitive tasks",
            "Startups scaling without hiring more staff"
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
        <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white selection:bg-purple-500/30">
            <div className="absolute inset-0 bg-[radial-gradient(#00000003_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>

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
                            <span className="text-5xl font-black text-purple-600 dark:text-purple-400">{pricingData.price}</span>
                            <span className="text-neutral-500 dark:text-gray-500 text-lg">/ {pricingData.period}</span>
                        </div>
                        <p className="text-xl text-neutral-600 dark:text-gray-400">{pricingData.tagline}</p>
                    </motion.div>

                    {/* Overview */}
                    <motion.div variants={itemVariants} className="mb-16">
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Package Overview</h2>
                        <p className="text-neutral-600 dark:text-gray-400 leading-relaxed text-xl border-l-4 border-purple-500/50 pl-6">
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
                                <div key={idx} className="flex items-center justify-between p-5 bg-gradient-to-r from-black/5 to-transparent dark:from-white/5 dark:to-transparent rounded-xl border border-black/10 dark:border-white/10 hover:border-purple-500/30 transition-colors">
                                    <span className="text-neutral-600 dark:text-gray-300">{addon.name}</span>
                                    <span className="text-purple-600 dark:text-purple-400 font-bold">{addon.price}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Timeline */}
                    <motion.div variants={itemVariants} className="mb-16">
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8 flex items-center gap-3">
                            <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                            Project Timeline
                        </h2>
                        <div className="space-y-4">
                            {pricingData.timeline.map((phase, idx) => (
                                <div key={idx} className="relative pl-8 pb-6 border-l-2 border-black/10 dark:border-white/10 last:border-l-0 last:pb-0">
                                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-purple-500 border-4 border-white dark:border-neutral-950"></div>
                                    <div className="bg-black/5 dark:bg-white/5 p-5 rounded-xl border border-black/10 dark:border-white/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{phase.phase}</h3>
                                            <span className="text-purple-600 dark:text-purple-400 text-sm font-mono">{phase.duration}</span>
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
                            <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                            Ideal For
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pricingData.idealFor.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10">
                                    <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                    <span className="text-neutral-600 dark:text-gray-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div variants={itemVariants} className="pt-8 border-t border-black/10 dark:border-white/10">
                        <button onClick={() => navigate('/deploy')} className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-2xl hover:from-purple-500 hover:to-indigo-500 transition-all shadow-[0_0_40px_rgba(168,85,247,0.3)] flex items-center justify-center gap-3 group">
                            Automate Your Workflows
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default AutomationPricingPage;
