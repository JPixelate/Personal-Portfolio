import React from "react";
import { Quote, ShieldCheck, Star, StarHalf } from "lucide-react";
import { motion } from "framer-motion";
import { useUI } from "../context/UIContext";

// --- MOCK DATA ---
const testimonials = [
  {
    id: 1,
    name: "Alex V.",
    role: "CTO, FinTech Global",
    text: "The architecture they built handled our Black Friday traffic with zero latency.",
    tags: ["Scale", "React"],
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah L.",
    role: "Founder, Stealth AI",
    text: "We went from concept to MVP in 3 weeks. The workflows saved us 200 hours.",
    tags: ["Automation", "Speed"],
    rating: 5,
  },
  {
    id: 3,
    name: "Marcus J.",
    role: "Product Lead, SASS Co",
    text: "Their MCP chatbots aren't just scripts; they actually understand context.",
    tags: ["AI Agents", "MCP"],
    rating: 5,
  },
  {
    id: 4,
    name: "Elena R.",
    role: "Director, HealthTech",
    text: "Secure, compliant, and fast. They bridged the gap perfectly.",
    tags: ["Security", "Integration"],
    rating: 4.5,
  },
  {
    id: 5,
    name: "David K.",
    role: "Head of Ops, Logistics",
    text: "The automation system acts like a full-time employee. Flawless execution.",
    tags: ["n8n", "Efficiency"],
    rating: 5,
  },
  {
    id: 6,
    name: "Priya M.",
    role: "CEO, E-Comm Brand",
    text: "None have the technical depth and design eye that this team possesses.",
    tags: ["Design", "Dev"],
    rating: 4.5,
  },
  {
    id: 7,
    name: "Tom H.",
    role: "VP Engineering",
    text: "Clean code, typed strictly, and documented well. A joy to take over.",
    tags: ["Code Quality", "TypeScript"],
    rating: 4.5,
  },
  {
    id: 8,
    name: "Jessica W.",
    role: "Marketing Lead",
    text: "Our conversion rate doubled after the site redesign. Performance was key.",
    tags: ["SEO", "Performance"],
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Testimonials = () => {
  const { themeMode, blueprintMode, themed, playSound } = useUI();
  const row1 = testimonials.slice(0, 4);
  const row2 = testimonials.slice(4, 8);

  return (
    <section className={`relative h-full w-full py-16 md:py-20 px-4 md:px-8 flex justify-center overflow-hidden transition-colors duration-700 ${themed('bg-white', 'bg-[#0a0a0a]', 'bg-[#050505]', 'bg-[#fdf6e3]')}`}>
      {/* Background Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none ${themed('bg-blue-600/5', 'bg-blue-500/5', 'bg-blue-600/10', 'bg-[#b58900]/5')}`}></div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="w-full max-w-7xl relative z-10 flex flex-col"
      >
        {/* --- HEADER --- */}
        <div className="mb-8 px-4 md:px-0">
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-3">
            <span className={`font-mono text-xs tracking-[0.2em] uppercase transition-colors ${themed('text-blue-600', 'text-blue-500', 'text-blue-400', 'text-[#b58900]')}`}>
              Client Validation
            </span>
            <div className={`px-2 py-0.5 rounded border text-[10px] flex items-center gap-1 transition-colors ${themed('bg-blue-50 border-blue-100 text-blue-600', 'bg-neutral-900 border-neutral-800 text-neutral-400', 'bg-blue-900/10 border-blue-500/20 text-blue-400', 'bg-[#b58900]/10 border-[#b58900]/20 text-[#b58900]')}`}>
              <ShieldCheck className="w-3 h-3" /> Verified
            </div>
          </motion.div>
          <motion.h2 variants={itemVariants} className={`text-3xl md:text-5xl lg:text-5xl font-black tracking-tight transition-colors duration-700 ${themed('text-neutral-900', 'text-neutral-100', 'text-blue-500', 'text-[#433422]')}`}>
            Trusted by
            <span className={`ml-4 text-transparent bg-clip-text bg-gradient-to-r ${themed('from-blue-600 to-indigo-600', 'from-blue-400 to-purple-400', 'from-blue-500 to-cyan-400', 'from-[#b58900] to-[#cb4b16]')}`}>
              Innovators
            </span>
          </motion.h2>
        </div>

        {/* --- MARQUEE AREA --- */}
        <motion.div variants={itemVariants} className="relative w-full [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] group">
          {/* ROW 1 */}
          <div className="flex mb-4 overflow-hidden">
            <div className="flex gap-4 animate-marquee group-hover:[animation-play-state:paused]">
              {[...row1, ...row1, ...row1].map((t, i) => (
                <TestimonialCard key={`${t.id}-${i}`} data={t} />
              ))}
            </div>
          </div>

          {/* ROW 2 */}
          <div className="flex overflow-hidden">
            <div className="flex gap-4 animate-marquee-reverse group-hover:[animation-play-state:paused]">
              {[...row2, ...row2, ...row2].map((t, i) => (
                <TestimonialCard key={`${t.id}-${i}`} data={t} />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          width: max-content;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 45s linear infinite;
          width: max-content;
        }
      `}</style>
    </section>
  );
};

// --- HELPER: STAR RATING COMPONENT ---
const StarRating = ({ rating }) => {
    const { themed } = useUI();
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((index) => {
          if (rating >= index) {
            return (
              <Star key={index} className={`w-3 h-3 fill-current ${themed('text-amber-500', 'text-amber-400', 'text-blue-400', 'text-[#b58900]')}`} />
            );
          } else if (rating >= index - 0.5) {
            return (
              <StarHalf
                key={index}
                className={`w-3 h-3 fill-current ${themed('text-amber-500', 'text-amber-400', 'text-blue-400', 'text-[#b58900]')}`}
              />
            );
          } else {
            return <Star key={index} className={`w-3 h-3 ${themed('text-neutral-200', 'text-neutral-800', 'text-blue-900', 'text-[#433422]/20')}`} />;
          }
        })}
      </div>
    );
};

// --- HELPER: COMPACT CARD COMPONENT ---
const TestimonialCard = ({ data }) => {
    const { themeMode, blueprintMode, themed, playSound } = useUI();
    return (
      <div 
        onMouseEnter={() => playSound('hover')}
        className={`relative w-[320px] md:w-[380px] p-6 rounded-xl backdrop-blur-sm border transition-all duration-300 flex-shrink-0 cursor-default flex flex-col justify-between group/card ${themed(
          'bg-neutral-50/50 border-neutral-100 hover:bg-white hover:shadow-xl hover:border-blue-100',
          'bg-neutral-900/50 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700',
          'bg-[#0a0a0a]/50 border-blue-900/30 hover:border-blue-500/50 hover:bg-blue-900/10',
          'bg-[#eee8d5]/50 border-[#433422]/10 hover:bg-[#eee8d5] hover:border-[#b58900]/30'
        )}`}
      >
        {/* Absolute Watermark Icon (Right) */}
        <Quote className={`absolute top-4 right-4 w-6 h-6 transition-colors ${themed('text-neutral-200/40', 'text-neutral-800/40', 'text-blue-900/20', 'text-[#433422]/10')}`} />

        {/* Top Section: Stars (Left) */}
        <div className="mb-3 relative z-10">
          <StarRating rating={data.rating} />
        </div>

        {/* Text */}
        <p className={`text-sm md:text-base leading-relaxed mb-4 font-normal pr-6 relative z-10 transition-colors ${themed('text-neutral-600', 'text-neutral-400', 'text-blue-100/70', 'text-[#433422]/80')}`}>
          "{data.text}"
        </p>

        {/* Compact Footer */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <h3 className={`font-bold text-sm transition-colors ${themed('text-neutral-900 group-hover/card:text-blue-600', 'text-neutral-100 group-hover/card:text-blue-400', 'text-blue-400 group-hover/card:text-blue-200', 'text-[#433422] group-hover/card:text-[#b58900]')}`}>{data.name}</h3>
            <span className={`text-[10px] uppercase tracking-wider font-mono opacity-80 ${themed('text-blue-600', 'text-blue-500', 'text-blue-400', 'text-[#b58900]')}`}>
              {data.role}
            </span>
          </div>

          {/* Tag Pills */}
          <div className="hidden sm:flex gap-1.5">
            {data.tags.map((tag, i) => (
              <span
                key={i}
                className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors ${themed(
                  'bg-white border-neutral-200 text-neutral-500 group-hover/card:border-blue-200',
                  'bg-neutral-950 border-neutral-800 text-neutral-500 group-hover/card:border-neutral-600',
                  'bg-blue-950 border-blue-900/50 text-blue-500 group-hover/card:border-blue-400',
                  'bg-[#fdf6e3] border-[#433422]/10 text-[#433422]/40 group-hover/card:border-[#b58900]/30'
                )}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
};

export default Testimonials;

