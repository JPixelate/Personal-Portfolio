import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-triggered animations
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Intersection threshold (0-1)
 * @param {string} options.rootMargin - Root margin for intersection observer
 * @param {boolean} options.triggerOnce - Whether to trigger animation only once
 * @returns {Object} - { ref, isInView, hasBeenInView }
 */
export const useScrollAnimation = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    triggerOnce = true,
  } = options;

  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsInView(inView);
        
        if (inView && !hasBeenInView) {
          setHasBeenInView(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, hasBeenInView]);

  return {
    ref,
    isInView,
    hasBeenInView,
    shouldAnimate: triggerOnce ? hasBeenInView : isInView,
  };
};

/**
 * Custom hook for staggered scroll animations
 * @param {number} itemCount - Number of items to stagger
 * @param {Object} options - Configuration options
 * @returns {Object} - { containerRef, itemRefs, isInView }
 */
export const useStaggeredScrollAnimation = (itemCount, options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    staggerDelay = 100, // milliseconds between each item
  } = options;

  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [animatedItems, setAnimatedItems] = useState(new Set());

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
          
          // Trigger staggered animations
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setAnimatedItems(prev => new Set([...prev, i]));
            }, i * staggerDelay);
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, itemCount, staggerDelay, isInView]);

  return {
    containerRef,
    isInView,
    animatedItems,
    isItemAnimated: (index) => animatedItems.has(index),
  };
};

/**
 * Custom hook for parallax scroll effects
 * @param {number} speed - Parallax speed multiplier (default: 0.5)
 * @returns {Object} - { ref, offset }
 */
export const useParallax = (speed = 0.5) => {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const elementTop = rect.top + scrolled;
      const viewportHeight = window.innerHeight;
      
      // Calculate offset based on element position
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const offset = (scrolled - elementTop) * speed;
        setOffset(offset);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  return { ref, offset };
};

/**
 * Custom hook for scroll progress tracking
 * @returns {number} - Scroll progress (0-1)
 */
export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const totalScroll = documentHeight - windowHeight;
      const currentProgress = scrollTop / totalScroll;
      
      setProgress(Math.min(Math.max(currentProgress, 0), 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return progress;
};

export default useScrollAnimation;
