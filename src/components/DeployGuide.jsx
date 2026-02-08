import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles, Target, CheckCircle2, Lightbulb, ArrowRight } from 'lucide-react';
import { useUI } from '../context/UIContext';

const DeployGuide = ({ isOpen, onClose, currentStep, onStepChange }) => {
    const { themed, blueprintMode, playSound } = useUI();
    const [guideStep, setGuideStep] = useState(0);

    const guideSteps = [
        {
            id: 0,
            title: "Welcome to Deploy Protocol",
            description: "Let me guide you through the quote request process. This will only take a minute.",
            icon: Sparkles,
            highlight: null,
            formStep: null,
            content: "This guided tour will walk you through each step of requesting a custom quote for your project. You can exit anytime by pressing ESC or clicking the X button."
        },
        {
            id: 1,
            title: "Phase 1: Architecture",
            description: "We're now in the solution selection phase.",
            icon: Target,
            highlight: "solution-cards",
            formStep: 1,
            content: "The system has automatically opened Step 1 for you. Choose between Web Architecture, AI Systems, or a Full Ecosystem. Each foundation provides a different level of scalability and complexity."
        },
        {
            id: 2,
            title: "Phase 2: Scope Sync",
            description: "Defining parameters for your mission.",
            icon: Target,
            highlight: "scope-section",
            formStep: 2,
            content: "Moving to Step 2. Here you'll define your budget and timeline. This synchronization allows us to allocate the right technical resources to your project immediately."
        },
        {
            id: 3,
            title: "Phase 3: Liaison Intel",
            description: "How shall we establish contact?",
            icon: Target,
            highlight: "contact-section",
            formStep: 3,
            content: "Phase 3 is active. Provide your contact details and a brief project overview. This data is encrypted and sent directly to our architecture team for review."
        },
        {
            id: 4,
            title: "Phase 4: Manifest Review",
            description: "Final verification before submission.",
            icon: CheckCircle2,
            highlight: "review-section",
            formStep: 4,
            content: "Final Step. The Manifest Card shows a summary of your entire proposal. Review the technical details one last time before initiating the transmission sequence."
        },
        {
            id: 5,
            title: "Mission Control",
            description: "Your real-time status monitor.",
            icon: Lightbulb,
            highlight: "progress-sidebar",
            formStep: null,
            content: "To your left, you'll find the Mission Control sidebar. It tracks your phase progress in real-time. You can manual-override and return to any previous phase by clicking the items here."
        },
        {
            id: 6,
            title: "You're All Set!",
            description: "You now know how to request a quote. Let's get started!",
            icon: CheckCircle2,
            highlight: null,
            formStep: null,
            content: "That's everything you need to know! Feel free to start your quote request now, or ask our AI assistant if you have any questions. This guide won't show again unless you request it."
        }
    ];

    const currentGuideStep = guideSteps[guideStep];

    // Highlight target element when guide step changes
    useEffect(() => {
        if (!isOpen || !currentGuideStep.highlight) return;

        // Increased delay to ensure form step transitions are 100% complete
        const timer = setTimeout(() => {
            const targetElement = document.querySelector(`[data-guide-target="${currentGuideStep.highlight}"]`);
            if (targetElement) {
                // Scroll element into view smoothly
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Add highlight class
                targetElement.classList.add('guide-highlight-active');
            }
        }, 500);

        return () => {
            clearTimeout(timer);
            const targetElement = document.querySelector(`[data-guide-target="${currentGuideStep.highlight}"]`);
            if (targetElement) {
                targetElement.classList.remove('guide-highlight-active');
            }
        };
    }, [guideStep, isOpen, currentGuideStep.highlight]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    const handleClose = () => {
        playSound?.('click');
        localStorage.setItem('deployGuideCompleted', 'true');
        // Reset form to step 1 when finished so the user can start fresh
        if (onStepChange) onStepChange(1);
        onClose();
        // Reset guide step for next time it's opened
        setTimeout(() => setGuideStep(0), 500);
    };

    const handleNext = () => {
        playSound?.('click');
        if (guideStep < guideSteps.length - 1) {
            const nextStep = guideStep + 1;
            
            // Navigate to the corresponding form step first
            const nextGuideStep = guideSteps[nextStep];
            if (nextGuideStep.formStep && onStepChange) {
                onStepChange(nextGuideStep.formStep);
            }
            
            // Then change guide step (the highlight effect has its own delay now)
            setGuideStep(nextStep);
        } else {
            // This is the "Get Started" / "Finish" action
            handleClose();
        }
    };

    const handlePrevious = () => {
        playSound?.('click');
        if (guideStep > 0) {
            const prevStep = guideStep - 1;
            
            // Navigate to the corresponding form step first
            const prevGuideStep = guideSteps[prevStep];
            if (prevGuideStep.formStep && onStepChange) {
                onStepChange(prevGuideStep.formStep);
            }
            
            setGuideStep(prevStep);
        }
    };

    const handleSkip = () => {
        playSound?.('click');
        handleClose();
    };

    // Handle direct step navigation via progress dots
    const handleStepClick = (index) => {
        playSound?.('click');
        
        // Navigate to the corresponding form step first
        const targetGuideStep = guideSteps[index];
        if (targetGuideStep.formStep && onStepChange) {
            onStepChange(targetGuideStep.formStep);
        }
        
        setGuideStep(index);
    };

    if (!isOpen) return null;

    const accentText = themed('text-blue-600', 'text-blue-500', 'text-blue-400', 'text-[#b58900]');
    const accentBg = themed('bg-blue-600', 'bg-blue-500', 'bg-blue-500', 'bg-[#b58900]');
    const cardBg = themed('bg-white', 'bg-neutral-900', 'bg-[#0a0a0a]', 'bg-[#eee8d5]');
    const overlayBg = themed('bg-black/5', 'bg-black/10', 'bg-black/15', 'bg-black/5');

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay - Almost transparent to see background content clearly */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`fixed inset-0 ${overlayBg} z-[9998]`}
                        onClick={handleClose}
                    />

                    {/* Guide Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed z-[10000] bottom-8 left-0 right-0 mx-4"
                        style={{
                            maxHeight: 'calc(100vh - 6rem)',
                            overflowY: 'auto',
                            scrollBehavior: 'smooth'
                        }}
                    >
                        <div className="max-w-md mx-auto">
                            <div
                                className={`${cardBg} rounded-3xl shadow-2xl border ${themed('border-neutral-200', 'border-neutral-800', 'border-blue-500/30', 'border-[#433422]/20')} overflow-hidden ${
                                    blueprintMode ? 'blueprint-active-outline' : ''
                                }`}
                            >
                            {/* Header */}
                            <div className={`relative p-5 md:p-8 pb-4 md:pb-6 ${themed('bg-gradient-to-br from-blue-50 to-white', 'bg-gradient-to-br from-neutral-800 to-neutral-900', 'bg-gradient-to-br from-blue-950/50 to-[#0a0a0a]', 'bg-gradient-to-br from-[#fdf6e3] to-[#eee8d5]')}`}>
                                {/* Close Button */}
                                <button
                                    onClick={handleClose}
                                    className={`absolute top-3 right-3 md:top-4 md:right-4 p-2 rounded-xl ${themed('hover:bg-neutral-100', 'hover:bg-neutral-800', 'hover:bg-blue-900/30', 'hover:bg-[#433422]/10')} transition-colors group`}
                                    aria-label="Close guide"
                                >
                                    <X size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                                </button>

                                {/* Icon */}
                                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${accentBg} flex items-center justify-center mb-4 md:mb-6 shadow-lg`}>
                                    <currentGuideStep.icon size={20} className="text-white md:w-7 md:h-7" />
                                </div>

                                {/* Title */}
                                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-2">
                                    {currentGuideStep.title}
                                </h3>
                                <p className={`text-xs md:text-sm font-medium opacity-60`}>
                                    {currentGuideStep.description}
                                </p>
                            </div>

                            {/* Content */}
                            <div className="p-5 md:p-8 pt-4 md:pt-6">
                                <p className="text-xs md:text-sm leading-relaxed opacity-80 mb-6 md:mb-8">
                                    {currentGuideStep.content}
                                </p>

                                {/* Progress Dots */}
                                <div className="flex items-center justify-center gap-2 mb-6 md:mb-8">
                                    {guideSteps.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleStepClick(index)}
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                index === guideStep
                                                    ? `${accentBg} w-8`
                                                    : index < guideStep
                                                    ? `${themed('bg-neutral-300', 'bg-neutral-700', 'bg-blue-900/50', 'bg-[#433422]/30')} w-2`
                                                    : `${themed('bg-neutral-200', 'bg-neutral-800', 'bg-neutral-900', 'bg-[#433422]/10')} w-2`
                                            }`}
                                            aria-label={`Go to step ${index + 1}`}
                                        />
                                    ))}
                                </div>

                                {/* Navigation */}
                                <div className="flex items-center justify-between gap-3 md:gap-4">
                                    {guideStep > 0 ? (
                                        <button
                                            onClick={handlePrevious}
                                            className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl ${themed('bg-neutral-100 hover:bg-neutral-200', 'bg-neutral-800 hover:bg-neutral-700', 'bg-blue-900/30 hover:bg-blue-900/50', 'bg-[#433422]/10 hover:bg-[#433422]/20')} transition-colors font-bold text-xs md:text-sm`}
                                        >
                                            <ChevronLeft size={16} />
                                            Previous
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleSkip}
                                            className="px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-xs md:text-sm opacity-40 hover:opacity-100 transition-opacity"
                                        >
                                            Skip Tour
                                        </button>
                                    )}

                                    <button
                                        onClick={handleNext}
                                        className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl ${accentBg} text-white font-bold text-xs md:text-sm shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95`}
                                    >
                                        {guideStep === guideSteps.length - 1 ? (
                                            <>
                                                Get Started
                                                <CheckCircle2 size={16} />
                                            </>
                                        ) : (
                                            <>
                                                Next
                                                <ChevronRight size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Step Counter */}
                                <div className="text-center mt-4 md:mt-6">
                                    <span className={`text-xs font-bold uppercase tracking-widest opacity-30`}>
                                        Step {guideStep + 1} of {guideSteps.length}
                                    </span>
                                </div>
                            </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default DeployGuide;
