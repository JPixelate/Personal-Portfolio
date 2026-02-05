import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import quillLogo from "../assets/images/quill_logo.png";

const PageLoader = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const images = Array.from(document.images);
        const totalImages = images.length;
        let loadedImages = 0;
        let isWindowLoaded = false;

        const updateProgress = () => {
            setProgress(prev => {
                // Calculate real progress based on images + window load state
                // We give 80% weight to images and 20% to the window load event
                const imageProgress = totalImages > 0 ? (loadedImages / totalImages) * 80 : 80;
                const windowProgress = isWindowLoaded ? 20 : 0;
                const realProgress = imageProgress + windowProgress;

                // Ensure the progress only moves forward and is smooth
                if (realProgress > prev) {
                    return Math.min(realProgress, 100);
                }
                return prev;
            });
        };

        // Track image loading
        if (totalImages === 0) {
            loadedImages = 0;
            updateProgress();
        } else {
            images.forEach(img => {
                if (img.complete) {
                    loadedImages++;
                    updateProgress();
                } else {
                    img.addEventListener('load', () => {
                        loadedImages++;
                        updateProgress();
                    });
                    img.addEventListener('error', () => {
                        loadedImages++; // Count errors as "done" to avoid getting stuck
                        updateProgress();
                    });
                }
            });
        }

        // Track window load
        const handleWindowLoad = () => {
            isWindowLoaded = true;
            updateProgress();
        };

        if (document.readyState === 'complete') {
            handleWindowLoad();
        } else {
            window.addEventListener('load', handleWindowLoad);
        }

        // Fallback: If it takes too long, just finish
        const fallbackTimer = setTimeout(() => {
            setProgress(100);
        }, 3000);

        return () => {
            window.removeEventListener('load', handleWindowLoad);
            clearTimeout(fallbackTimer);
        };
    }, []);

    // Watch for progress reaching 100
    useEffect(() => {
        if (progress >= 100) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [progress]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-white"
                >
                    {/* Minimalist Background Logic */}
                    <div className="absolute inset-0 bg-[radial-gradient(#00000008_1px,transparent_1px)] [background-size:40px_40px]" />
                    <div className="absolute inset-0 bg-mesh opacity-40"></div>
                    
                    <div className="relative z-10 flex flex-col items-center gap-12 max-w-md w-full px-8">
                        
                        {/* Large Typographic Identity */}
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="flex items-center"
                            >
                                <motion.img 
                                    src={quillLogo} 
                                    alt="Logo" 
                                    className="w-20 h-20 md:w-24 md:h-24 -mr-3 md:-mr-4 object-contain"
                                    animate={{ 
                                        rotate: [0, 5, 0],
                                        y: [0, -5, 0]
                                    }}
                                    transition={{ 
                                        duration: 4, 
                                        repeat: Infinity, 
                                        ease: "easeInOut" 
                                    }}
                                />
                                <div className="text-4xl md:text-6xl font-logo text-neutral-600 flex items-center">
                                    <span className="font-fancy text-5xl md:text-7xl -mr-1 upright-script">p</span>
                                    <span className="mt-2 text-neutral-600 upright-script">enpillo.</span>
                                    <span className="font-fancy text-5xl md:text-7xl ml-1 upright-script">j</span>
                                </div>
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="text-neutral-400 font-bold uppercase tracking-[0.4em] text-[10px]"
                            >
                                Full Stack Developer
                            </motion.div>
                        </div>

                        {/* Minimalist Progress Indicator */}
                        <div className="w-full space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-900 mt-24">
                                    {progress < 100 ? 'Architecting Framework' : 'System Ready'}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-blue-600">
                                    {Math.round(progress)}%
                                </span>
                            </div>
                            
                            <div className="w-full h-[1px] bg-neutral-100 relative overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="absolute top-0 left-0 h-full bg-blue-600"
                                />
                            </div>
                        </div>

                        {/* Subtle Version/Ref Label */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            transition={{ delay: 1 }}
                            className="absolute bottom-12 text-[8px] font-mono uppercase tracking-[0.3em] text-neutral-500"
                        >
                            Ref: 2026_V2.0_Core_Ready
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PageLoader;
