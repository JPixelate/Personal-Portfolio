import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, CheckCircle2, ArrowRight, ArrowLeft, Zap, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WebArchitecturePricingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const pricingData = {
        title: "Web Architecture",
        price: "$3,500",
        period: "starting from",
        icon: Box,
        iconColor: "text-blue-400",
        tagline: "Build scalable, high-performance web platforms that convert",
        overview: "Our Web Architecture package delivers enterprise-grade web applications built with cutting-edge technologies. Perfect for businesses looking to establish a powerful digital presence or modernize their existing platforms.",

        included: [
            "Custom Next.js/React application development",
            "Responsive design for all devices (mobile, tablet, desktop)",
            "Headless CMS integration (Sanity, Contentful, or Strapi)",
            "SEO optimization and meta tag configuration",
            "Framer Motion animations and micro-interactions",
            "Performance optimization (<100ms page load)",
            "SSL certificate and security setup",
            "Google Analytics and tracking integration",
            "Contact forms with email notifications",
            "3 rounds of revisions",
            "Source code and documentation",
            "1 month of post-launch support"
        ],

        addOns: [
            { name: "E-commerce functionality (Stripe/PayPal)", price: "+$1,500" },
            { name: "Multi-language support (i18n)", price: "+$800" },
            { name: "Advanced animations and 3D elements", price: "+$1,200" },
            { name: "Custom admin dashboard", price: "+$2,000" },
            { name: "Blog system with CMS", price: "+$600" },
            { name: "User authentication system", price: "+$1,000" }
        ],

        timeline: [
            { phase: "Discovery & Planning", duration: "3-5 days", description: "Requirements gathering, wireframing, and technical planning" },
            { phase: "Design & Prototyping", duration: "5-7 days", description: "UI/UX design, mockups, and interactive prototypes" },
            { phase: "Development", duration: "10-14 days", description: "Frontend and backend development, CMS integration" },
            { phase: "Testing & Launch", duration: "3-5 days", description: "QA testing, bug fixes, deployment, and handover" }
        ],

        idealFor: [
            "Startups launching their digital product",
            "Businesses modernizing their web presence",
            "Companies needing a high-converting landing page",
            "Agencies requiring white-label development",
            "SaaS products needing a marketing website"
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
        <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white selection:bg-blue-500/30">
            <div className="absolute inset-0 bg-[radial-gradient(#00000003_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

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
                            <span className="text-5xl font-black text-blue-600 dark:text-blue-400">{pricingData.price}</span>
                            <span className="text-neutral-500 dark:text-gray-500 text-lg">/ {pricingData.period}</span>
                        </div>
                        <p className="text-xl text-neutral-600 dark:text-gray-400">{pricingData.tagline}</p>
                    </motion.div>

                    {/* Overview */}
                    <motion.div variants={itemVariants} className="mb-16">
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Package Overview</h2>
                        <p className="text-neutral-600 dark:text-gray-400 leading-relaxed text-xl border-l-4 border-blue-500/50 pl-6">
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
                                <div key={idx} className="flex items-center justify-between p-5 bg-gradient-to-r from-black/5 to-transparent dark:from-white/5 dark:to-transparent rounded-xl border border-black/10 dark:border-white/10 hover:border-blue-500/30 transition-colors">
                                    <span className="text-neutral-600 dark:text-gray-300">{addon.name}</span>
                                    <span className="text-blue-600 dark:text-blue-400 font-bold">{addon.price}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Timeline */}
                    <motion.div variants={itemVariants} className="mb-16">
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8 flex items-center gap-3">
                            <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            Project Timeline
                        </h2>
                        <div className="space-y-4">
                            {pricingData.timeline.map((phase, idx) => (
                                <div key={idx} className="relative pl-8 pb-6 border-l-2 border-black/10 dark:border-white/10 last:border-l-0 last:pb-0">
                                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-neutral-950"></div>
                                    <div className="bg-black/5 dark:bg-white/5 p-5 rounded-xl border border-black/10 dark:border-white/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{phase.phase}</h3>
                                            <span className="text-blue-600 dark:text-blue-400 text-sm font-mono">{phase.duration}</span>
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
                            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            Ideal For
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pricingData.idealFor.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10">
                                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                    <span className="text-neutral-600 dark:text-gray-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div variants={itemVariants} className="pt-8 border-t border-black/10 dark:border-white/10">
                        <button onClick={() => navigate('/deploy')} className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)] flex items-center justify-center gap-3 group">
                            Start Your Web Project
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default WebArchitecturePricingPage;
