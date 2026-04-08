import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import SEO from '../components/SEO.jsx';
import InsightShareButton from '../components/InsightShareButton.jsx';
import { COLOR_MAP } from '../utils/insights.js';
import { useInsightsPosts } from '../hooks/useInsightsPosts.js';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const InsightDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { themed } = useUI();
  const { posts, loading, error } = useInsightsPosts();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const accentColor  = themed('text-blue-600', 'text-blue-400', 'text-cyan-400', 'text-amber-700');
  const cardBg       = themed('bg-black/5', 'bg-white/5', 'bg-blue-500/5', 'bg-amber-900/5');
  const cardBorder   = themed('border-black/10', 'border-white/10', 'border-blue-500/20', 'border-amber-900/10');
  const orbColor     = themed('bg-blue-900/10', 'bg-blue-900/10', 'bg-blue-500/10', 'bg-amber-500/10');
  const divider      = themed('border-black/10', 'border-white/10', 'border-blue-500/15', 'border-amber-900/10');
  const pageTitle    = themed('text-neutral-900', 'text-neutral-100', 'text-white', 'text-[#433422]');
  const pageBody     = themed('text-neutral-600', 'text-neutral-400', 'text-blue-300/80', 'text-[#433422]/75');
  const pageMeta     = themed('text-neutral-400', 'text-neutral-500', 'text-blue-500/70', 'text-[#433422]/55');
  const cardTitle    = themed('text-neutral-900', 'text-neutral-100', 'text-white', 'text-[#433422]');
  const cardBody     = themed('text-neutral-600', 'text-neutral-400', 'text-blue-200/85', 'text-[#433422]/75');
  const shareButtonClass = themed(
    'border-black/10 bg-white/80 text-neutral-600 hover:bg-white hover:text-neutral-900 shadow-sm',
    'border-white/10 bg-black/20 text-neutral-300 hover:bg-white/10 hover:text-white shadow-sm',
    'border-blue-500/20 bg-blue-500/10 text-cyan-100 hover:bg-blue-500/20 hover:text-white shadow-sm',
    'border-amber-900/10 bg-[#fdf6e3] text-[#7c5d2a] hover:bg-[#f6ecd0] hover:text-[#433422] shadow-sm'
  );

  // 404 state
  if (loading) {
    return (
      <div className={`min-h-screen ${themed('bg-white/75 text-neutral-900 backdrop-blur-[2px]', 'bg-neutral-950/75 text-white backdrop-blur-[2px]', 'bg-slate-950/75 text-white backdrop-blur-[2px]', 'bg-[#fdf6e3]/85 text-[#433422] backdrop-blur-[2px]')} flex items-center justify-center px-8 transition-colors duration-500`}>
        <div className="text-center">
          <p className={`font-mono text-xs tracking-[0.3em] uppercase mb-4 ${pageMeta}`}>Loading...</p>
          <h1 className="text-4xl font-black mb-4">Fetching article</h1>
        </div>
      </div>
    );
  }

  const post = posts.find((item) => item.slug === slug);

  if (error || (!loading && !post)) {
    return (
      <div className={`min-h-screen ${themed('bg-white/75 text-neutral-900 backdrop-blur-[2px]', 'bg-neutral-950/75 text-white backdrop-blur-[2px]', 'bg-slate-950/75 text-white backdrop-blur-[2px]', 'bg-[#fdf6e3]/85 text-[#433422] backdrop-blur-[2px]')} flex items-center justify-center px-8 transition-colors duration-500`}>
        <div className="text-center">
          <p className={`font-mono text-xs tracking-[0.3em] uppercase mb-4 ${accentColor}`}>404</p>
          <h1 className="text-4xl font-black mb-4">Article not found</h1>
          <button
            onClick={() => navigate('/insights')}
            className="flex items-center gap-2 text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mx-auto mt-6"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Neural Digest
          </button>
        </div>
      </div>
    );
  }

  const c = COLOR_MAP[post.color] || COLOR_MAP.indigo;
  const Icon = post.categoryIcon;

  // Related posts (same category, excluding current)
  const related = posts.filter(p => p.slug !== slug && p.category === post.category).slice(0, 2);

  return (
    <div className={`min-h-screen ${themed('bg-white/75 text-neutral-900 backdrop-blur-[2px]', 'bg-neutral-950/75 text-white backdrop-blur-[2px]', 'bg-slate-950/75 text-white backdrop-blur-[2px]', 'bg-[#fdf6e3]/85 text-[#433422] backdrop-blur-[2px]')} selection:bg-blue-500/30 transition-colors duration-500`}>
      <SEO
        title={`${post.title} | Neural Digest`}
        description={post.excerpt}
        keywords={post.tags.join(', ')}
        url={`https://penpillo-portfolio.vercel.app/insights/${post.slug}`}
      />

      {/* Background Effects */}
      <div className={`absolute inset-0 ${themed('bg-[radial-gradient(#00000003_1px,transparent_1px)]','bg-[radial-gradient(#ffffff03_1px,transparent_1px)]','bg-[radial-gradient(#3b82f610_1px,transparent_1px)]','bg-[radial-gradient(#b5890010_1px,transparent_1px)]')} [background-size:32px_32px] pointer-events-none`} />
      <div className={`absolute top-0 right-0 w-[600px] h-[600px] ${orbColor} rounded-full blur-[120px] pointer-events-none`} />

      <div className="relative pt-40 pb-20 px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          {/* Back Button */}
          <motion.button
            variants={itemVariants}
            onClick={() => navigate('/insights')}
            className="mb-8 flex items-center gap-2 text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Neural Digest
          </motion.button>

          {/* Category + AI badge */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-5">
            <span className={`flex items-center gap-1.5 text-xs font-mono tracking-[0.2em] uppercase px-3 py-1 rounded-full ${c.bg} border ${c.border} ${c.text}`}>
              <Icon size={11} />
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 dark:text-neutral-500 tracking-widest uppercase">
              <Sparkles size={10} />
              AI Generated
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1 variants={itemVariants} className={`text-3xl md:text-5xl font-black tracking-tight leading-[1.1] mb-6 ${pageTitle}`}>
            {post.title}
          </motion.h1>

          {/* Meta */}
          <motion.div variants={itemVariants} className={`flex items-center gap-5 text-sm font-mono pb-8 mb-8 border-b ${divider} ${pageMeta}`}>
            <span className="flex items-center gap-1.5"><Calendar size={13} /> {post.date}</span>
            <span className="flex items-center gap-1.5"><Clock size={13} /> {post.readTime}</span>
          </motion.div>

          {/* Lead excerpt */}
          <motion.p variants={itemVariants} className={`text-lg md:text-xl font-medium leading-relaxed mb-8 ${pageBody}`}>
            {post.excerpt}
          </motion.p>

          {/* Body paragraphs */}
          <motion.div variants={itemVariants} className={`space-y-6 text-base font-light leading-relaxed ${pageBody}`}>
            {post.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </motion.div>

          {/* Tags */}
          <motion.div variants={itemVariants} className={`flex flex-wrap gap-2 mt-10 pt-8 border-t ${divider}`}>
            {post.tags.map(tag => (
              <span key={tag} className="text-xs font-mono text-neutral-400 dark:text-neutral-500 px-3 py-1 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                #{tag}
              </span>
            ))}
          </motion.div>

          {/* AI Disclosure */}
          <motion.div variants={itemVariants} className={`mt-8 p-5 rounded-2xl ${cardBg} border ${cardBorder}`}>
            <p className={`text-xs font-mono ${accentColor}`}>
              ⚡ This article was AI-generated as part of the Neural Digest daily content series. Content is synthesized from publicly available information and refreshed every 24 hours.
            </p>
          </motion.div>

          {/* Related Posts */}
          {related.length > 0 && (
            <motion.div variants={itemVariants} className="mt-16">
              <p className={`font-mono text-xs tracking-[0.3em] uppercase mb-6 ${accentColor}`}>Related Articles</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {related.map(rel => {
                  const rc = COLOR_MAP[rel.color] || COLOR_MAP.indigo;
                  const RelIcon = rel.categoryIcon;
                  return (
                    <motion.div
                      key={rel.id}
                      whileHover={{ y: -3 }}
                      onClick={() => navigate(`/insights/${rel.slug}`)}
                      className={`${cardBg} border ${cardBorder} rounded-2xl p-5 cursor-pointer group transition-all duration-300`}
                    >
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className={`flex items-center gap-1.5 text-xs font-mono tracking-[0.2em] uppercase px-2.5 py-1 rounded-full ${rc.bg} border ${rc.border} ${rc.text} w-fit`}>
                          <RelIcon size={10} />
                          {rel.category}
                        </span>
                        <div className="ml-auto">
                          <InsightShareButton
                            slug={rel.slug}
                            title={rel.title}
                            excerpt={rel.excerpt}
                            className={shareButtonClass}
                          />
                        </div>
                      </div>
                      <h4 className={`text-sm font-bold leading-tight group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors mb-2 ${cardTitle}`}>
                        {rel.title}
                      </h4>
                      <p className={`text-xs font-mono ${pageMeta}`}>{rel.date}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  );
};

export default InsightDetailPage;
