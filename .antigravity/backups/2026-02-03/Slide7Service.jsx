import React from "react";
import { Check, ArrowRight, Sparkles, Box, Workflow, Bot } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const pricingPlans = [
  {
    id: 1,
    title: "Enterprise Architecture",
    price: "$3,500",
    period: "start",
    description: "High-performance Next.js systems engineered for scale.",
    icon: Box,
    color: "text-blue-400",
    bgGlow: "bg-blue-500/20",
    features: [
      "Next.js / React",
      "Headless CMS",
      "SEO Infrastructure",
      "Edge Middleware",
    ],
    link: "/pricing/web-architecture"
  },
  {
    id: 2,
    title: "Autonomous Workflows",
    price: "$1,500",
    period: "start",
    description: "Eliminate operational friction with n8n & Python.",
    icon: Workflow,
    color: "text-purple-400",
    bgGlow: "bg-purple-500/20",
    features: [
      "n8n Orchestration",
      "Custom Python Logic",
      "API Integration",
      "Error Recovery",
    ],
    link: "/pricing/automation"
  },
  {
    id: 3,
    title: "Intelligent Agents",
    price: "$2,500",
    period: "start",
    description: "Context-aware AI agents for enterprise data.",
    icon: Bot,
    color: "text-emerald-400",
    bgGlow: "bg-emerald-500/20",
    features: ["RAG Architecture", "MCP Protocols", "Vector Search", "LLM Fine-Tuning"],
    link: "/pricing/ai-agents"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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
      ease: "easeOut",
    },
  },
};

const Slide7Service = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="relative w-full h-full bg-white dark:bg-neutral-950 flex flex-col items-center justify-center px-6 py-8 overflow-hidden">
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="w-full max-w-7xl relative z-10 flex flex-col justify-center"
      >
        {/* --- COMPACT HEADER --- */}
        <div className="mb-6 text-center">
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 mb-2">
            <span className="text-lime-600 dark:text-lime-400 font-mono text-[10px] tracking-[0.2em] uppercase">
              Investment Models
            </span>
            <div className="h-px w-8 bg-black/10 dark:bg-white/10"></div>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-2xl md:text-5xl lg:text-5xl font-black text-neutral-900 dark:text-white tracking-tight">
            Transparent{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-500">
              Pricing
            </span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-neutral-600 dark:text-gray-500 text-base md:text-lg mt-4 mb-2 max-w-3xl mx-auto">
            Every project comes with its own ambitions, constraints, and
            technical depth. Our pricing adapts to the exact systems you
            need—because the right solution isn’t a template, it’s a precise
            build.
          </motion.p>
        </div>

        {/* --- COMPACT PRICING CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} variants={itemVariants} navigate={navigate} />
          ))}
        </div>

        {/* --- COMPACT BOTTOM CTA --- */}
        <motion.div variants={itemVariants} className="mt-8 flex items-center justify-center gap-4 text-sm">
          <p className="text-gray-500">Need a custom enterprise solution?</p>
          <Link to="/deploy" className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors backdrop-blur-sm flex items-center gap-2 group text-xs font-medium">
            <Sparkles className="w-3 h-3 text-lime-600 dark:text-lime-400" />
            Book Consultation
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

// --- COMPONENT: COMPACT PRICING CARD ---
const PricingCard = ({ plan, variants, navigate }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative group p-5 bg-black/5 dark:bg-neutral-900/40 border border-black/10 dark:border-white/5 rounded-xl hover:border-black/20 dark:hover:border-white/10 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-white/5 transition-all duration-500 overflow-hidden flex flex-col h-full min-h-[240px] cursor-pointer"
    >
      {/* Animated Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent pointer-events-none"></div>

      {/* Hover Gradient */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-b from-black/5 dark:from-white/5 to-transparent pointer-events-none`}
      ></div>

      {/* Header: Title + Icon Row */}
      <div className="flex justify-between items-start mb-3 relative z-10">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors">{plan.title}</h3>
          <div className="flex items-baseline gap-1 mt-1">
            <motion.span 
              animate={isHovered ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5 }}
              className={`text-2xl font-black text-neutral-900 dark:text-white tracking-tight`}
            >
              {plan.price}
            </motion.span>
            <span className="text-neutral-500 dark:text-gray-500 text-[10px] font-light uppercase">
              / {plan.period}
            </span>
          </div>
        </div>
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className={`p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 ${plan.color} group-hover:border-black/10 dark:group-hover:border-white/10 transition-all duration-300`}
        >
          <plan.icon className="w-5 h-5" />
        </motion.div>
      </div>

      {/* Description */}
      <p className="text-xs text-neutral-600 dark:text-gray-400 mb-4 leading-relaxed border-b border-black/5 dark:border-white/5 pb-4 group-hover:text-neutral-700 dark:group-hover:text-gray-300 transition-colors relative z-10">
        {plan.description}
      </p>

      {/* Features Grid (2 Columns to save height) with stagger animation */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-2 mb-4 flex-1 relative z-10">
        {plan.features.map((feature, i) => (
          <motion.div 
            key={i} 
            className="flex items-center gap-1.5"
            initial={{ opacity: 0.7, x: 0 }}
            animate={isHovered ? { 
              opacity: 1, 
              x: 2,
              transition: { delay: i * 0.05 }
            } : { opacity: 0.7, x: 0 }}
          >
            <motion.div
              animate={isHovered ? { 
                scale: [1, 1.2, 1],
                transition: { delay: i * 0.05, duration: 0.3 }
              } : {}}
            >
              <Check className={`w-3 h-3 ${plan.color} flex-shrink-0`} />
            </motion.div>
            <span className="text-[10px] text-neutral-600 dark:text-gray-300 truncate">{feature}</span>
          </motion.div>
        ))}
      </div>

      {/* Button with enhanced hover effect */}
      <motion.button
        onClick={() => navigate(plan.link)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative w-full py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-neutral-900 dark:text-white font-medium text-xs hover:bg-black/10 dark:hover:bg-white/10 transition-all group-hover:border-black/20 dark:group-hover:border-white/20 flex items-center justify-center gap-2 overflow-hidden z-10`}
      >
        {/* Button shimmer */}
        <div className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"></div>
        <span className="relative">View Details</span>
        <motion.div
          animate={isHovered ? { x: [0, 3, 0] } : {}}
          transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0, repeatDelay: 0.2 }}
        >
          <ArrowRight className="w-3 h-3 opacity-50" />
        </motion.div>
      </motion.button>

      {/* Enhanced Decorative Glow Blob */}
      <motion.div
        animate={isHovered ? { 
          scale: [1, 1.2, 1],
          opacity: [0, 0.5, 0.4]
        } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-[60px] ${plan.bgGlow}`}
      ></motion.div>

      {/* Additional corner glow */}
      <motion.div
        animate={isHovered ? { 
          scale: [1, 1.3, 1.1],
          opacity: [0, 0.3, 0.2]
        } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className={`absolute -top-8 -left-8 w-32 h-32 rounded-full blur-[60px] ${plan.bgGlow}`}
      ></motion.div>

      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-${plan.color.replace('text-', 'bg-')}/20 to-transparent blur-sm`}></div>
      </div>
    </motion.div>
  );
};

export default Slide7Service;
