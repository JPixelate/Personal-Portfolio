import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useUI } from '../context/UIContext';

const ScrollProgress = () => {
  const { themed } = useUI();
  const { scrollYProgress } = useScroll();

  // Convert scroll progress to percentage (0-100)
  const percentage = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Position of the dot along the line (top to bottom)
  const dotY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-[90] hidden lg:flex flex-col items-center gap-4">
      {/* Percentage Display */}
      <motion.div
        className={`font-mono text-[10px] font-bold tracking-wider transition-colors duration-700 ${themed('text-neutral-400', 'text-neutral-400', 'text-blue-500')}`}
      >
        <motion.span>
          {percentage.get().toFixed(0)}
        </motion.span>
        <span className={`transition-colors ${themed('text-neutral-300', 'text-neutral-500', 'text-blue-500/50')}`}>%</span>
      </motion.div>

      {/* Vertical Line Container */}
      <div className="relative h-32 w-px">
        {/* Background Line */}
        <div className={`absolute inset-0 transition-colors duration-700 ${themed('bg-neutral-200', 'bg-neutral-600', 'bg-blue-500/20')}`} />

        {/* Progress Line */}
        <motion.div
          className={`absolute top-0 left-0 w-full origin-top transition-colors duration-700 ${themed('bg-neutral-400', 'bg-neutral-400', 'bg-blue-500')}`}
          style={{ scaleY: scrollYProgress, height: '100%' }}
        />

        {/* Moving Dot */}
        <motion.div
          className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full shadow-lg transition-colors duration-700 ${themed('bg-neutral-900 shadow-neutral-900/20', 'bg-neutral-200 shadow-neutral-200/20', 'bg-blue-400 shadow-blue-500/50')}`}
          style={{ top: dotY }}
        />
      </div>
    </div>
  );
};

// Wrap with a component that updates on scroll
const ScrollProgressWrapper = () => {
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setProgress(Math.round(v * 100));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return <ScrollProgressInner progress={progress} />;
};

const ScrollProgressInner = ({ progress }) => {
  const { themed } = useUI();
  const { scrollYProgress } = useScroll();
  const dotY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-[90] hidden lg:flex flex-col items-center gap-4">
      {/* Percentage Display */}
      <div
        className={`font-mono text-[10px] font-bold tracking-wider transition-colors duration-700 ${themed('text-neutral-400', 'text-blue-500', 'text-blue-500')}`}
      >
        <span>{progress}</span>
        <span className={`transition-colors ${themed('text-neutral-300', 'text-blue-500/50', 'text-blue-500/50')}`}>%</span>
      </div>

      {/* Vertical Line Container */}
      <div className="relative h-32 w-px">
        {/* Background Line */}
        <div className={`absolute inset-0 transition-colors duration-700 ${themed('bg-neutral-200', 'bg-neutral-600', 'bg-blue-500/20')}`} />

        {/* Progress Line */}
        <motion.div
          className={`absolute top-0 left-0 w-full origin-top transition-colors duration-700 ${themed('bg-neutral-400', 'bg-blue-500', 'bg-blue-500')}`}
          style={{ scaleY: scrollYProgress, height: '100%' }}
        />

        {/* Moving Dot */}
        <motion.div
          className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full shadow-lg transition-colors duration-700 ${themed('bg-neutral-900 shadow-neutral-900/20', 'bg-neutral-200 shadow-neutral-200/20', 'bg-blue-400 shadow-blue-500/50')}`}
          style={{ top: dotY }}
        />
      </div>
    </div>
  );
};

export default ScrollProgressWrapper;
