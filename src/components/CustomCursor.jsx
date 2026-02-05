// src/components/CustomCursor.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useUI } from '../context/UIContext';

// Check if device is mobile/touch - runs once on module load
const isTouchDevice = () => {
  if (typeof window === 'undefined') return true;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
  );
};

const CustomCursor = () => {
  const { blueprintMode, playSound } = useUI();
  const [isMobile, setIsMobile] = useState(true); // Default to true to prevent flash

  // Check for mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      const mobile = isTouchDevice() || window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't render anything on mobile - early return for performance
  if (isMobile) return null;

  return <CursorRenderer blueprintMode={blueprintMode} playSound={playSound} />;
};

// Separate component to avoid hook issues with early return
const CursorRenderer = ({ blueprintMode, playSound }) => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Optimized Spring Physics
  const springConfig = useMemo(() => ({ damping: 30, stiffness: 300, mass: 0.5 }), []);
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState("");

  // Memoized handlers
  const handleMouseMove = useCallback((e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
    setIsVisible(true);
  }, [mouseX, mouseY]);

  const handleOver = useCallback((e) => {
    const target = e.target;
    const isInteractive = target.closest('a, button, .cursor-pointer');
    const projectCard = target.closest('.project-card');

    if (projectCard) {
      if (!isHovering) playSound('hover');
      setCursorText("VIEW");
      setIsHovering(true);
    } else if (isInteractive) {
      if (!isHovering) playSound('hover');
      setCursorText("");
      setIsHovering(true);
    } else {
      setCursorText("");
      setIsHovering(false);
    }
  }, [isHovering, playSound]);

  const handleMouseDown = useCallback(() => {
    playSound('click');
    setIsClicked(true);
  }, [playSound]);

  const handleMouseUp = useCallback(() => {
    setIsClicked(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleOver, handleMouseDown, handleMouseUp]);

  // Memoize animation values
  const bubbleAnimation = useMemo(() => ({
    height: isHovering ? (cursorText ? 100 : 80) : 40,
    width: isHovering ? (cursorText ? 100 : 80) : 40,
    opacity: isVisible ? 1 : 0,
    scale: isClicked ? 0.8 : 1,
    backgroundColor: isHovering
      ? (blueprintMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(99, 102, 241, 0.15)')
      : 'rgba(99, 102, 241, 0)',
  }), [isHovering, cursorText, isVisible, isClicked, blueprintMode]);

  const coreAnimation = useMemo(() => ({
    scale: isHovering ? 0 : (isClicked ? 1.5 : 1),
  }), [isHovering, isClicked]);

  return (
    <>
      {/* LAYER 1: The Glass Bubble */}
      <motion.div
        className="fixed pointer-events-none z-[9998] will-change-transform"
        style={{
          left: smoothX,
          top: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={bubbleAnimation}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className={`rounded-full border flex items-center justify-center overflow-hidden transition-colors ${blueprintMode ? 'border-blue-500' : 'border-indigo-500/40'}`}
        >
          {cursorText && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-[10px] font-black tracking-widest ${blueprintMode ? 'text-blue-500' : 'text-indigo-600 dark:text-indigo-400'}`}
            >
              {cursorText}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* LAYER 2: The Core */}
      <motion.div
        className="fixed pointer-events-none z-[9999] will-change-transform"
        style={{
          left: mouseX,
          top: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{ opacity: isVisible ? 1 : 0 }}
      >
        <motion.div
          animate={coreAnimation}
          className={`h-1.5 w-1.5 rounded-full transition-colors ${blueprintMode ? 'bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'}`}
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;
