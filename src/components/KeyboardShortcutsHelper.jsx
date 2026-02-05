import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';

const KeyboardShortcutsHelper = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyPress = (e) => {
            // Open shortcuts helper with Shift + ?
            if (e.shiftKey && e.key === '?') {
                e.preventDefault();
                setIsOpen(true);
            }
            // Close with Escape
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [isOpen]);

    const shortcuts = [
        { key: 'Tab', description: 'Navigate forward through interactive elements' },
        { key: 'Shift + Tab', description: 'Navigate backward through interactive elements' },
        { key: 'Enter', description: 'Activate focused link or button' },
        { key: 'Space', description: 'Activate focused button or scroll page' },
        { key: 'Escape', description: 'Close dialogs and modals' },
        { key: 'Home', description: 'Scroll to top of page' },
        { key: 'End', description: 'Scroll to bottom of page' },
        { key: 'Shift + ?', description: 'Show this keyboard shortcuts guide' },
    ];

    return (
        <>
            {/* Floating Help Button - Left Side (Hidden on mobile - keyboard shortcuts not useful on touch devices) */}
            <button
                onClick={() => setIsOpen(true)}
                className="hidden md:flex fixed bottom-8 left-8 z-[110] w-14 h-14 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-full shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-black/10 dark:border-white/10 hover:scale-110 transition-all duration-300 items-center justify-center"
                aria-label="Show keyboard shortcuts"
                title="Keyboard Shortcuts (Shift + ?)"
            >
                <Keyboard className="w-6 h-6" />
            </button>

            {/* Shortcuts Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
                            aria-hidden="true"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="fixed bottom-8 left-8 z-[9999] w-full max-w-md"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="shortcuts-title"
                        >
                            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden">
                                {/* Header */}
                                <div className="p-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                            <Keyboard className="w-5 h-5 text-indigo-500" />
                                        </div>
                                        <h2 id="shortcuts-title" className="text-xl font-bold text-neutral-900 dark:text-white">
                                            Keyboard Shortcuts
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white"
                                        aria-label="Close keyboard shortcuts"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Shortcuts List */}
                                <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                    <ul className="space-y-3" role="list">
                                        {shortcuts.map((shortcut, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center justify-between gap-4 p-3 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5"
                                            >
                                                <span className="text-sm text-neutral-600 dark:text-gray-400 flex-1">
                                                    {shortcut.description}
                                                </span>
                                                <kbd className="px-3 py-1.5 text-xs font-mono font-bold bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded border border-black/10 dark:border-white/10 shadow-sm whitespace-nowrap">
                                                    {shortcut.key}
                                                </kbd>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Footer */}
                                <div className="p-4 border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                                    <p className="text-xs text-center text-neutral-600 dark:text-gray-500">
                                        Press <kbd className="px-2 py-0.5 text-xs font-mono bg-white dark:bg-neutral-800 rounded border border-black/10 dark:border-white/10">Escape</kbd> to close
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default KeyboardShortcutsHelper;
