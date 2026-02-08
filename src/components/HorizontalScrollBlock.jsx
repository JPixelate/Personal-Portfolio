import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const HorizontalScrollBlock = ({ sections }) => {
  const targetRef = useRef(null);
  const numSections = sections.length;

  // 1. DYNAMIC HEIGHT
  const totalHeight = `${numSections * 100}vh`;

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // 2. HORIZONTAL MOVEMENT
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${(numSections - 1) * 100}vw`]
  );

  return (
    <div
      ref={targetRef}
      style={{ height: totalHeight }}
      className="relative w-full"
    >
      {/* --- STICKY VIEWPORT --- */}
      <div className="sticky top-[5vh] flex h-[90vh] items-center overflow-hidden">
        <motion.div style={{ x }} className="flex">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`relative h-[90vh] w-screen flex-shrink-0 flex items-center justify-center ${section.color || 'bg-white dark:bg-neutral-950'}`}
            >
              <section.Component />
            </div>
          ))}
        </motion.div>
      </div>

      {/* --- INVISIBLE SNAP POINTS --- */}
      <div className="absolute inset-0 w-full pointer-events-none">
        {sections.map((section, i) => (
          <div
            key={i}
            id={section.navId}
            className="h-[90vh] w-full snap-start snap-always"
            style={{
              top: `${i * 100}vh`,
              position: "absolute"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HorizontalScrollBlock;
