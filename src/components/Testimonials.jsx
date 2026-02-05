import React from "react";
import { Quote, ShieldCheck, Star, StarHalf } from "lucide-react";
import { motion } from "framer-motion";

// --- MOCK DATA (Added ratings) ---
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
  const row1 = testimonials.slice(0, 4);
  const row2 = testimonials.slice(4, 8);

  return (
    <section className="relative h-full w-full bg-white dark:bg-neutral-950 py-20 px-8 flex justify-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>

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
            <span className="text-indigo-400 font-mono text-xs tracking-[0.2em] uppercase">
              Client Validation
            </span>
            <div className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified
            </div>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl lg:text-5xl font-black text-neutral-900 dark:text-white tracking-tight">
            Trusted by
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 ml-4">
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
const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((index) => {
      if (rating >= index) {
        return (
          <Star key={index} className="w-3 h-3 text-amber-400 fill-amber-400" />
        );
      } else if (rating >= index - 0.5) {
        return (
          <StarHalf
            key={index}
            className="w-3 h-3 text-amber-400 fill-amber-400"
          />
        );
      } else {
        return <Star key={index} className="w-3 h-3 text-neutral-300 dark:text-gray-700" />;
      }
    })}
  </div>
);

// --- HELPER: COMPACT CARD COMPONENT ---
const TestimonialCard = ({ data }) => (
  <div className="relative w-[320px] md:w-[380px] p-6 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl backdrop-blur-sm hover:bg-black/10 dark:hover:bg-white/10 hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 flex-shrink-0 cursor-default flex flex-col justify-between group/card">
    {/* Absolute Watermark Icon (Right) */}
    <Quote className="absolute top-4 right-4 w-6 h-6 text-black/5 dark:text-white/5 group-hover/card:text-black/10 dark:group-hover/card:text-white/10 transition-colors" />

    {/* Top Section: Stars (Left) */}
    <div className="mb-3 relative z-10">
      <StarRating rating={data.rating} />
    </div>

    {/* Text */}
    <p className="text-neutral-600 dark:text-gray-300 text-sm md:text-base leading-relaxed mb-4 font-light pr-6 relative z-10">
      "{data.text}"
    </p>

    {/* Compact Footer */}
    <div className="flex items-center justify-between mt-auto">
      <div className="flex flex-col">
        <h3 className="text-neutral-900 dark:text-white font-bold text-sm group-hover/card:text-indigo-600 dark:group-hover/card:text-indigo-400 transition-colors">{data.name}</h3>
        <span className="text-indigo-600 dark:text-indigo-300 text-[10px] uppercase tracking-wider font-mono opacity-80">
          {data.role}
        </span>
      </div>

      {/* Tag Pills */}
      <div className="hidden sm:flex gap-1.5">
        {data.tags.map((tag, i) => (
          <span
            key={i}
            className="text-[9px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-black/30 text-neutral-500 dark:text-gray-500 border border-black/5 dark:border-white/5 group-hover/card:border-indigo-500/30 transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default Testimonials;
