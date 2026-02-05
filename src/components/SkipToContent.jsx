import React from 'react';
import { motion } from 'framer-motion';

const SkipToContent = () => {
    const handleSkip = (e) => {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.focus();
            mainContent.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <a
            href="#main-content"
            onClick={handleSkip}
            className="
                fixed top-4 left-1/2 -translate-x-1/2 z-[99999]
                px-6 py-3 
                bg-indigo-600 text-white font-bold rounded-full
                shadow-[0_0_30px_rgba(99,102,241,0.5)]
                focus:outline-none focus:ring-4 focus:ring-indigo-400
                -translate-y-32 focus:translate-y-0
                transition-transform duration-300 ease-out
            "
            aria-label="Skip to main content"
        >
            Skip to Main Content
        </a>
    );
};

export default SkipToContent;
