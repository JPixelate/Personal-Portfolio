// src/components/CustomCursor.jsx
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useUI } from '../context/UIContext';

const CustomCursor = () => {
  const { blueprintMode, playSound } = useUI();
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Optimized Spring Physics for maximum performance
  const springConfig = { damping: 30, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState("");

  useEffect(() => {
    const mouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    // Use mouseover/mouseout instead of checking closest() on every mousemove
    const handleOver = (e) => {
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
    };

    const mouseDown = () => {
        playSound('click');
        setIsClicked(true);
    };
    const mouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', mouseMove, { passive: true });
    window.addEventListener('mouseover', handleOver);
    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseover', handleOver);
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
    };
  }, [mouseX, mouseY, isVisible]);

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
          animate={{
            height: isHovering ? (cursorText ? 100 : 80) : 40,
            width: isHovering ? (cursorText ? 100 : 80) : 40,
            opacity: isVisible ? 1 : 0,
            scale: isClicked ? 0.8 : 1,
            backgroundColor: isHovering 
                ? (blueprintMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(99, 102, 241, 0.15)')
                : 'rgba(99, 102, 241, 0)',
          }}
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
          animate={{
            scale: isHovering ? 0 : (isClicked ? 1.5 : 1),
          }}
          className={`h-1.5 w-1.5 rounded-full transition-colors ${blueprintMode ? 'bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'}`}
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;