import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FocusIndicator = () => {
    const [focusedElement, setFocusedElement] = useState(null);
    const [isKeyboardUser, setIsKeyboardUser] = useState(false);

    useEffect(() => {
        // Detect keyboard navigation
        const handleKeyDown = (e) => {
            if (e.key === 'Tab') {
                setIsKeyboardUser(true);
            }
        };

        const handleMouseDown = () => {
            setIsKeyboardUser(false);
        };

        const handleFocus = (e) => {
            if (isKeyboardUser) {
                const rect = e.target.getBoundingClientRect();
                setFocusedElement({
                    top: rect.top + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                    height: rect.height,
                });
            }
        };

        const handleBlur = () => {
            setFocusedElement(null);
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('focusin', handleFocus, true);
        document.addEventListener('focusout', handleBlur, true);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('focusin', handleFocus, true);
            document.removeEventListener('focusout', handleBlur, true);
        };
    }, [isKeyboardUser]);

    return (
        <AnimatePresence>
            {focusedElement && isKeyboardUser && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="fixed pointer-events-none z-[99998]"
                    style={{
                        top: focusedElement.top - 4,
                        left: focusedElement.left - 4,
                        width: focusedElement.width + 8,
                        height: focusedElement.height + 8,
                    }}
                >
                    {/* Animated border */}
                    <div className="absolute inset-0 rounded-lg border-4 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                        {/* Pulse effect */}
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 rounded-lg border-2 border-indigo-400"
                        />
                    </div>

                    {/* Corner accents */}
                    {[
                        { top: -2, left: -2 },
                        { top: -2, right: -2 },
                        { bottom: -2, left: -2 },
                        { bottom: -2, right: -2 },
                    ].map((position, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="absolute w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"
                            style={position}
                        />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FocusIndicator;
