import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, Calendar, Sparkles, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import SEO from '../components/SEO.jsx';
import InsightShareButton from '../components/InsightShareButton.jsx';
import { COLOR_MAP } from '../utils/insights.js';
import { useInsightsPosts } from '../hooks/useInsightsPosts.js';

const ALL_CATEGORIES = ['All', 'LLM', 'Multimodal', 'Open Source', 'Agents', 'AI Safety', 'Hardware'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const InsightsPage = () => {
  const navigate = useNavigate();
  const { themed } = useUI();
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const { posts, loading, error } = useInsightsPosts();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const accentColor = themed('text-blue-600', 'text-blue-400', 'text-cyan-400', 'text-amber-700');
  const cardBg      = themed('bg-black/5',    'bg-white/5',    'bg-blue-500/5',  'bg-amber-900/5');
  const cardBorder  = themed('border-black/10','border-white/10','border-blue-500/20','border-amber-900/10');
  const hoverBorder = themed('hover:border-blue-500/30','hover:border-blue-500/30','hover:border-blue-500/60','hover:border-amber-500/50');
  const pillBg      = themed('bg-black/5',    'bg-white/5',    'bg-blue-500/10', 'bg-amber-900/5');
  const pillHover   = themed('hover:bg-black/10','hover:bg-white/10','hover:bg-blue-500/20','hover:bg-amber-900/10');
  const orbColor    = themed('bg-blue-900/10','bg-blue-900/10','bg-blue-500/10', 'bg-amber-500/10');
  const shareButtonClass = themed(
    'border-black/10 bg-white/80 text-neutral-600 hover:bg-white hover:text-neutral-900 shadow-sm',
    'border-white/10 bg-black/20 text-neutral-300 hover:bg-white/10 hover:text-white shadow-sm',
    'border-blue-500/20 bg-blue-500/10 text-cyan-100 hover:bg-blue-500/20 hover:text-white shadow-sm',
    'border-amber-900/10 bg-[#fdf6e3] text-[#7c5d2a] hover:bg-[#f6ecd0] hover:text-[#433422] shadow-sm'
  );

  const featured      = posts.find(p => p.featured);
  const filteredPosts = posts
    .filter(p => p.slug !== featured?.slug)
    .filter(p => activeCategory === 'All' || p.category === activeCategory);
  const postsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage));
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className={`min-h-screen ${themed('bg-white/75 text-neutral-900 backdrop-blur-[2px]', 'bg-neutral-950/75 text-white backdrop-blur-[2px]', 'bg-slate-950/75 text-white backdrop-blur-[2px]', 'bg-[#fdf6e3]/85 text-[#433422] backdrop-blur-[2px]')} selection:bg-blue-500/30 transition-colors duration-500`}>
      <SEO
        title="Neural Digest | Daily AI & Tech Insights"
        description="Daily AI-generated summaries of the most important developments in artificial intelligence, LLMs, open-source models, and emerging technology."
        keywords="AI news, daily AI digest, LLM updates, artificial intelligence, tech insights"
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
            onClick={() => navigate('/')}
            className="mb-8 flex items-center gap-2 text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </motion.button>

          {/* Page Header */}
          <motion.span variants={itemVariants} className={`font-mono text-xs tracking-[0.3em] uppercase mb-4 block ${accentColor}`}>
            Daily AI Digest
          </motion.span>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold tracking-tight transition-colors duration-700 text-neutral-1000 dark:text-white mb-6">
            Neural Digest
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-neutral-600 dark:text-gray-400 max-w-2xl font-light leading-relaxed mb-12">
            The most significant AI and technology developments, curated and synthesized daily. No noise. Just signal.
          </motion.p>

          {/* Category Filter */}
          <motion.div variants={itemVariants} className="flex items-center gap-2 flex-wrap mb-12">
            {ALL_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-sm font-medium px-4 py-2 rounded-full border transition-all duration-200 ${
                  activeCategory === cat
                    ? `${accentColor} border-current bg-current/10`
                    : `text-neutral-500 dark:text-neutral-400 ${cardBorder} ${pillBg} ${pillHover} hover:text-neutral-900 dark:hover:text-white`
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {loading && (
            <motion.div variants={itemVariants} className={`${cardBg} border ${cardBorder} rounded-2xl p-10 mb-10`}>
              <p className="text-sm font-mono text-neutral-400 dark:text-neutral-500">Loading latest posts from Supabase...</p>
            </motion.div>
          )}

          {error && !loading && (
            <motion.div variants={itemVariants} className={`${cardBg} border ${cardBorder} rounded-2xl p-10 mb-10`}>
              <p className="text-sm font-mono text-red-500">Could not load posts from Supabase.</p>
            </motion.div>
          )}

          {/* Featured Post */}
          {!loading && featured && (activeCategory === 'All' || activeCategory === featured.category) && (() => {
            const c = COLOR_MAP[featured.color] || COLOR_MAP.indigo;
            const Icon = featured.categoryIcon;
            return (
              <div className="mb-10">
                <div
                  onClick={() => navigate(`/insights/${featured.slug}`)}
                  className={`${cardBg} border ${cardBorder} ${hoverBorder} rounded-2xl p-8 md:p-12 cursor-pointer group transition-all duration-300`}
                >
                  <div className="flex items-center gap-3 mb-6 flex-wrap">
                    <span className={`flex items-center gap-1.5 text-xs font-mono tracking-[0.2em] uppercase px-3 py-1 rounded-full ${c.bg} border ${c.border} ${c.text}`}>
                      <Icon size={11} />
                      {featured.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 dark:text-neutral-500 tracking-widest uppercase">
                      <Sparkles size={10} />
                      AI Generated
                    </span>
                    <div className="ml-auto flex items-center gap-3">
                      <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 tracking-widest uppercase">
                        Featured
                      </span>
                      <InsightShareButton
                        slug={featured.slug}
                        title={featured.title}
                        excerpt={featured.excerpt}
                        className={shareButtonClass}
                      />
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-4xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight mb-4 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-neutral-600 dark:text-gray-400 text-lg font-light leading-relaxed max-w-3xl mb-8">
                    {featured.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5 text-sm font-mono text-neutral-400 dark:text-neutral-500">
                      <span className="flex items-center gap-1.5"><Calendar size={13} /> {featured.date}</span>
                      <span className="flex items-center gap-1.5"><Clock size={13} /> {featured.readTime}</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm font-bold ${c.text}`}>
                      Read Article
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Articles Grid */}
          {!loading && filteredPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {paginatedPosts.map((post) => {
                const c = COLOR_MAP[post.color] || COLOR_MAP.indigo;
                const Icon = post.categoryIcon;
                return (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/insights/${post.slug}`)}
                    className={`${cardBg} border ${cardBorder} ${hoverBorder} rounded-2xl p-6 cursor-pointer group transition-all duration-300 flex flex-col`}
                  >
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className={`flex items-center gap-1.5 text-xs font-mono tracking-[0.2em] uppercase px-2.5 py-1 rounded-full ${c.bg} border ${c.border} ${c.text}`}>
                        <Icon size={10} />
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-mono text-neutral-400 dark:text-neutral-500 tracking-widest uppercase">
                        <Sparkles size={9} />
                        AI
                      </span>
                      <div className="ml-auto">
                        <InsightShareButton
                          slug={post.slug}
                          title={post.title}
                          excerpt={post.excerpt}
                          className={shareButtonClass}
                        />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white leading-tight mb-3 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors flex-1">
                      {post.title}
                    </h3>

                    <p className="text-sm text-neutral-600 dark:text-gray-400 font-light leading-relaxed mb-5 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-xs font-mono text-neutral-400 dark:text-neutral-500 px-2 py-0.5 rounded border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-neutral-400 dark:text-neutral-500 pt-4 border-t border-black/5 dark:border-white/5">
                      <span className="flex items-center gap-1"><Calendar size={11} /> {post.date}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
                    </div>
                  </div>
                );
              })}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between gap-4 mb-16 flex-wrap">
                  <p className="text-sm font-mono text-neutral-400 dark:text-neutral-500">
                    Page {currentPage} of {totalPages}
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                        currentPage === 1
                          ? 'opacity-40 cursor-not-allowed border-black/10 dark:border-white/10 text-neutral-400 dark:text-neutral-500'
                          : `${cardBorder} ${pillBg} ${pillHover} text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white`
                      }`}
                    >
                      Previous
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                        currentPage === totalPages
                          ? 'opacity-40 cursor-not-allowed border-black/10 dark:border-white/10 text-neutral-400 dark:text-neutral-500'
                          : `${cardBorder} ${pillBg} ${pillHover} text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white`
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : !loading ? (
            <motion.div variants={itemVariants} className="text-center py-20 text-neutral-400 dark:text-neutral-500">
              <Brain size={36} className="mx-auto mb-4 opacity-30" />
              <p className="text-base font-mono">No articles in this category yet.</p>
            </motion.div>
          ) : null}

        </motion.div>
      </div>
    </div>
  );
};

export default InsightsPage;
