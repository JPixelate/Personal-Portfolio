import React from "react";
import { Github, Twitter, Linkedin, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollAnimation, useStaggeredScrollAnimation } from "../hooks/useScrollAnimation";

const architects = [
    {
        name: "Sergiu O.",
        role: "Principal Systems Architect",
        bio: "Specializing in enterprise-grade React architectures and high-availability distributed systems.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
        socials: {
            github: "https://github.com",
            twitter: "https://twitter.com",
            linkedin: "https://linkedin.com",
        },
    },
    {
        name: "Elena V.",
        role: "Lead Automation Strategist",
        bio: "Expert in n8n workflow orchestration, Python-based AI integration, and MCP protocol design.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
        socials: {
            github: "https://github.com",
            twitter: "https://twitter.com",
            linkedin: "https://linkedin.com",
        },
    },
    {
        name: "Marcus K.",
        role: "Senior Full-Stack Engineer",
        bio: "Bridging the gap between complex cloud backends and fluid, high-performance user interfaces.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
        socials: {
            github: "https://github.com",
            twitter: "https://twitter.com",
            linkedin: "https://linkedin.com",
        },
    },
];

const developers = [
    { name: "Alex R.", role: "UI/UX Engineer", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop" },
    { name: "Sarah J.", role: "Cloud Architect", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop" },
    { name: "David L.", role: "DevSecOps", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" },
    { name: "Maya W.", role: "AI Researcher", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" },
    { name: "James T.", role: "Systems Engineer", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" },
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
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const Team = () => {
    const { ref: sectionRef, shouldAnimate } = useScrollAnimation({ threshold: 0.1 });
    const { containerRef: devRef, isItemAnimated } = useStaggeredScrollAnimation(developers.length, { staggerDelay: 100 });

    return (
        <section 
            ref={sectionRef}
            id="section-team" 
            className="relative w-full py-24 px-8 flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-neutral-950"
        >
            {/* --- BACKGROUND EFFECTS --- */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:40px_40px] opacity-30 pointer-events-none"></div>
            
            <motion.div 
                animate={shouldAnimate ? { 
                    opacity: [0.03, 0.06, 0.03],
                } : {}}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"
            ></motion.div>

            <motion.div
                initial={false}
                animate={shouldAnimate ? "visible" : "visible"}
                variants={containerVariants}
                className="w-full max-w-7xl relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                        <motion.span 
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                        ></motion.span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] tracking-[0.2em] uppercase font-bold">
                            The Collective
                        </span>
                    </motion.div>
                    <motion.h2
                        variants={itemVariants}
                        className="text-4xl md:text-6xl font-black text-neutral-900 dark:text-white tracking-tight mb-6"
                    >
                        Meet the
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 ml-4 animate-glow-pulse-slow">
                            Architects
                        </span>
                    </motion.h2>
                    <motion.p variants={itemVariants} className="text-neutral-600 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        A specialized team of engineers and designers dedicated to building the next generation of autonomous digital experiences.
                    </motion.p>
                </div>

                {/* Big Cards (Architects) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">
                    {architects.map((member, idx) => (
                        <ArchitectCard key={idx} member={member} variants={itemVariants} index={idx} />
                    ))}
                </div>

                {/* Redesigned Small Flex Row (Developers) */}
                <div className="pt-20 border-t border-neutral-100 dark:border-white/5">
                    <motion.div variants={itemVariants} className="text-center mb-12">
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Extended Engineering Team</h3>
                        <p className="text-sm text-neutral-500 dark:text-gray-500">The specialists powering our core infrastructure</p>
                    </motion.div>
                    
                    <div ref={devRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
                        {developers.map((dev, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isItemAnimated(idx) ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                <DeveloperCard dev={dev} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

const ArchitectCard = ({ member, variants, index }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <motion.div
            variants={variants}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ y: -10 }}
            className="group relative"
        >
            <div className="relative overflow-hidden rounded-[2rem] bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 backdrop-blur-sm transition-all duration-500 group-hover:border-emerald-500/30 group-hover:shadow-2xl group-hover:shadow-emerald-500/10">
                <div className="aspect-[4/3] overflow-hidden relative">
                    <motion.img
                        src={member.image}
                        alt={member.name}
                        animate={isHovered ? { scale: 1.1 } : { scale: 1.05 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-500"></div>

                    <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                        <div className="flex gap-3">
                            <SocialIcon icon={Github} href={member.socials.github} label={`${member.name}'s Github`} delay={0} />
                            <SocialIcon icon={Twitter} href={member.socials.twitter} label={`${member.name}'s Twitter`} delay={0.1} />
                            <SocialIcon icon={Linkedin} href={member.socials.linkedin} label={`${member.name}'s Linkedin`} delay={0.2} />
                        </div>
                    </div>
                </div>
                <div className="p-8 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    <h3 className="text-2xl font-black text-neutral-900 dark:text-white mb-2 group-hover:text-emerald-500 transition-colors">
                        {member.name}
                    </h3>
                    <p className="text-emerald-500 text-xs font-mono uppercase tracking-[0.2em] mb-4 font-bold">
                        {member.role}
                    </p>
                    <p className="text-neutral-600 dark:text-gray-400 text-sm leading-relaxed">
                        {member.bio}
                    </p>
                </div>
            </div>
            
            {/* Floating decorative element */}
            <motion.div
                animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4 w-12 h-12 border border-emerald-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"></div>
            </motion.div>
        </motion.div>
    );
};

const DeveloperCard = ({ dev }) => (
    <div className="relative group flex flex-col items-center p-6 rounded-[1.5rem] bg-neutral-50/50 dark:bg-white/5 border border-transparent hover:border-emerald-500/20 hover:bg-white dark:hover:bg-neutral-900 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/5">
        <div className="w-24 h-24 rounded-2xl overflow-hidden mb-4 relative shadow-lg group-hover:shadow-emerald-500/20 transition-all">
            <motion.img
                src={dev.image}
                alt={dev.name}
                whileHover={{ scale: 1.1 }}
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="text-center">
            <h3 className="text-base font-black text-neutral-900 dark:text-white mb-1 group-hover:text-emerald-500 transition-colors">{dev.name}</h3>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-bold">{dev.role}</span>
            </div>
        </div>

        {/* Technical Detail on Hover */}
        <motion.div 
            whileHover={{ scale: 1.2, rotate: 45 }}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-emerald-500 text-neutral-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100 shadow-lg cursor-pointer"
        >
            <ExternalLink className="w-4 h-4" />
        </motion.div>
    </div>
);

const SocialIcon = ({ icon: Icon, href, label, delay }) => (
    <motion.a
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-emerald-500 hover:border-emerald-400 transition-all duration-300 shadow-lg"
    >
        <Icon className="w-5 h-5" />
    </motion.a>
);

export default Team;
