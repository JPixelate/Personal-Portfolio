import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const AlternatingHorizontalSection = ({ id, color, title }) => {
  const targetRef = useRef(null);

  // Tracks the scroll progress (0 to 1) over this component's 200vh height
  const { scrollYProgress } = useScroll({
    target: targetRef,
    // Start tracking when the component enters, stop when it leaves
    offset: ["start end", "end start"]
  });

  // Maps the 200vh scroll progress to the horizontal translation (x-axis)
  const x = useTransform(
    scrollYProgress,
    // Input Range (0 to 1): 
    // [Enter Viewport, Start of Hold, End of Hold, Exit Viewport]
    [0, 0.25, 0.75, 1],

    // Output Range (Position):
    // ['-100%', '0%', '0%', '100%']
    // 1. -100%: Off-screen Left (Just before it appears)
    // 2. 0%: Center Screen (It has slid into view)
    // 3. 0%: Stays at Center Screen (The user's viewing time)
    // 4. 100%: Off-screen Right (It slides out, allowing the next V section to appear)
    ['-100%', '0%', '0%', '100%']
  );

  return (
    // The 200vh tall wrapper creates the vertical scroll space for the animation
    <div
      ref={targetRef}
      style={{ height: '200vh' }}
      className={`relative w-full overflow-hidden`}
    >
      {/* Sticky Content Container - Sticks in place for the full 200vh scroll */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

        {/* The Sliding Content (motion.div) */}
        <motion.div
          style={{ x }}
          className={`w-full h-full flex items-center justify-center absolute ${color}`}
        >
          <div className="w-screen h-screen flex items-center justify-center">
            <h1 className="text-neutral-900 dark:text-white text-4xl">{title}</h1>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AlternatingHorizontalSection;
