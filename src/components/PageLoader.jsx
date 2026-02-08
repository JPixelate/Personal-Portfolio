import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import quillLogo from "../assets/images/quill_logo.webp";
import { useUI } from "../context/UIContext";

const PageLoader = () => {
    const { themed, isDark } = useUI();
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let maxProgress = 0;
        let totalImages = 0;
        let loadedImages = 0;
        let fontsReady = false;
        let windowLoaded = false;
        let settleTimer = null;

        const update = (value) => {
            if (value > maxProgress) {
                maxProgress = value;
                setProgress(Math.min(Math.round(value), 100));
            }
        };

        // Complete when: images all loaded + fonts ready + window loaded
        const checkComplete = () => {
            if (fontsReady && (totalImages === 0 || loadedImages >= totalImages) && windowLoaded) {
                update(100);
            }
        };

        // Settle: if no new DOM mutations for 500ms, check completion
        const resetSettleTimer = () => {
            if (settleTimer) clearTimeout(settleTimer);
            settleTimer = setTimeout(() => {
                checkComplete();
                if (totalImages === 0 && fontsReady) update(100);
            }, 500);
        };

        // Track images added to the DOM dynamically (React renders after mount)
        const checkImageProgress = () => {
            if (totalImages === 0) return;
            const ratio = loadedImages / totalImages;
            // Images map to the 20%–90% range
            update(20 + ratio * 70);
            checkComplete();
        };

        const trackImage = (img) => {
            totalImages++;
            if (img.complete) {
                loadedImages++;
                checkImageProgress();
            } else {
                const done = () => { loadedImages++; checkImageProgress(); };
                img.addEventListener('load', done, { once: true });
                img.addEventListener('error', done, { once: true });
            }
        };

        // Base: JS bundle loaded & React running
        update(10);

        // Track font loading → 20%
        document.fonts.ready.then(() => {
            fontsReady = true;
            update(20);
            checkComplete();
        });

        // Track images already in the DOM
        document.querySelectorAll('img').forEach(trackImage);

        // Watch for new images React adds to the DOM
        const mutationObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    if (node.tagName === 'IMG') trackImage(node);
                    if (node.querySelectorAll) {
                        node.querySelectorAll('img').forEach(trackImage);
                    }
                }
            }
            resetSettleTimer();
        });
        mutationObserver.observe(document.documentElement, { childList: true, subtree: true });

        // Window load event → at least 90%
        const onWindowLoad = () => {
            windowLoaded = true;
            update(90);
            resetSettleTimer();
        };
        if (document.readyState === 'complete') {
            onWindowLoad();
        } else {
            window.addEventListener('load', onWindowLoad);
        }

        resetSettleTimer();

        // Safety fallback (generous — real progress should finish well before this)
        const fallback = setTimeout(() => update(100), 10000);

        return () => {
            window.removeEventListener('load', onWindowLoad);
            mutationObserver.disconnect();
            clearTimeout(fallback);
            if (settleTimer) clearTimeout(settleTimer);
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
                    className={`fixed inset-0 z-[99999] flex items-center justify-center transition-colors duration-700 ${themed('bg-white', 'bg-[#0a0a0a]', 'bg-[#050505]')}`}
                >
                    {/* Minimalist Background Logic */}
                    <div className="absolute inset-0 bg-[radial-gradient(#00000008_1px,transparent_1px)] [background-size:40px_40px]" />
                    <div className="absolute inset-0 bg-mesh opacity-40"></div>
                    
                    <div className="relative z-10 flex flex-col items-center gap-12 max-w-md w-full px-8">
                        
                        <div className="flex flex-col items-center gap-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="flex items-center gap-4"
                            >
                                <img
                                    src={quillLogo}
                                    alt="Quill"
                                    className="h-20 md:h-24 object-contain"
                                    style={{
                                        filter: isDark ? 'invert(1) brightness(2)' : 'none'
                                    }}
                                />
                                <span className={`font-logo text-5xl md:text-7xl tracking-wide ${themed('text-neutral-900', 'text-white', 'text-blue-400')}`}>
                                    penpillo.j
                                </span>
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className={`font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs mt-2 ${themed('text-neutral-500', 'text-neutral-400', 'text-blue-400/60')}`}
                            >
                                Full Stack Developer
                            </motion.div>
                        </div>

                        {/* Minimalist Progress Indicator */}
                        <div className="w-full space-y-4">
                            <div className="flex justify-between items-end">
                                <span className={`text-[10px] font-black uppercase tracking-widest mt-24 transition-colors duration-700 ${themed('text-neutral-900', 'text-neutral-100', 'text-blue-500')}`}>
                                    {progress < 100 ? 'Architecting Framework' : 'System Ready'}
                                </span>
                                <span className={`text-[10px] font-mono font-bold transition-colors duration-700 ${themed('text-blue-600', 'text-neutral-400', 'text-blue-400')}`}>
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
