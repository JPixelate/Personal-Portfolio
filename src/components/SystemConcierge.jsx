import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Bot, Send, User, X, Mail, Phone, Linkedin, MessageCircle, Mic, MicOff, Volume2, Globe, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateAIResponse, isValidInput } from '../utils/aiKnowledge';
import { AssemblyAIStreamer } from '../utils/assemblyAIStreamer';
import { useUI } from '../context/UIContext';

import { useNavigate, useLocation } from 'react-router-dom';
import { ExternalLink, ArrowUpRight } from 'lucide-react';

const SystemConcierge = () => {
    const { blueprintMode, toggleBlueprint, playSound, isChatOpen, toggleChat, closeChat } = useUI();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Convert isChatOpen to a state here if needed, but we'll use it directly from context
    const isOpen = isChatOpen;
    const setIsOpen = (val) => {
        if (val) {
            toggleChat();
            if (showPromo) dismissPromo();
        }
        else closeChat();
    };

    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hey! 👋 I'm Jonald's AI companion. Feel free to ask me about his work, skills, or projects! \n\nYou can also explore the site directly: [View Portfolio](/#section-projects) or [See My Process](/#section-process)",
            sender: 'bot'
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [quickReplies, setQuickReplies] = useState(["Projects", "Tech Stack", "Hire Jonald"]);
    const [showPromo, setShowPromo] = useState(false);
    
    // --- DAILY LIMIT LOGIC ---
    const CHATS_PER_LIMIT_WINDOW = 100;
    const LIMIT_WINDOW_MS = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
    const [messageCount, setMessageCount] = useState(0);
    const [isLimitReached, setIsLimitReached] = useState(false);

    // --- VOICE MODE STATE ---
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceTranscript, setVoiceTranscript] = useState("");
    // Default to English (en-US) implicit

    
    // Refs for speech and logic
    const streamerRef = useRef(null);
    const synthesisRef = useRef(window.speechSynthesis);
    const transcriptRef = useRef(""); // To access latest transcript in closures
    const handleSendMessageRef = useRef(null); // To access latest function in closures
    const isVoiceModeRef = useRef(false); // Ref for robust state access
    
    // Update ref on render
    useEffect(() => {
        handleSendMessageRef.current = handleSendMessage;
    });

    useEffect(() => {
        isVoiceModeRef.current = isVoiceMode;
    }, [isVoiceMode]);
    
    // Initialize AssemblyAI Streamer
    useEffect(() => {
        streamerRef.current = new AssemblyAIStreamer({
            onTranscript: (text, isFinal) => {
                // Interrupt AI speech if user starts talking
                if (text && synthesisRef.current.speaking) {
                    synthesisRef.current.cancel();
                    setIsSpeaking(false);
                }
                setVoiceTranscript(text);
                transcriptRef.current = text;
            },
            onStateChange: (state) => {
                setIsListening(state === "listening");
            },
            onError: (error) => {
                console.error("AssemblyAI streaming error:", error);
                setIsListening(false);
            },
        });

        return () => {
            streamerRef.current?.destroy();
        };
    }, []);



    const toggleVoiceMode = () => {
        const newMode = !isVoiceMode;
        setIsVoiceMode(newMode);
        isVoiceModeRef.current = newMode;
        
        if (!newMode) {
            synthesisRef.current.cancel();
            setIsSpeaking(false);
            streamerRef.current?.stop();
        } else {
             playSound('click');
        }
    };
    
    // Helper to find a better voice
    const getBestVoice = () => {
        const voices = synthesisRef.current.getVoices();
        
        // Filter for English voices (preferring US for consistency)
        const enVoices = voices.filter(v => v.lang.startsWith('en'));
        
        if (enVoices.length === 0) return voices[0];

        // Deep preference for premium/natural sounding voices
        const preferred = [
            enVoices.find(v => v.name.includes("Premium") || v.name.includes("Enhanced")),
            enVoices.find(v => v.name.includes("Google") && v.name.includes("US")),
            enVoices.find(v => v.name.includes("Natural")),
            enVoices.find(v => v.name.includes("Samantha")), // classic macOS
            enVoices.find(v => v.name.includes("Siri")),
            enVoices.find(v => !v.name.includes("David") && !v.name.includes("Zira")) // Avoid old-school MS voices
        ];

        return preferred.find(v => v) || enVoices[0];
    };
    
    // Unified interaction handler
    const handleVoiceToggle = async (e) => {
        if (e && e.preventDefault && e.cancelable) e.preventDefault();

        if (isListening) {
            // STOP AND SEND
            streamerRef.current?.stop();
            setIsListening(false);

            const text = transcriptRef.current.trim();
            if (text) {
                handleSendMessageRef.current?.(text);
                setVoiceTranscript("");
                transcriptRef.current = "";
            }
        } else {
            // START LISTENING
            if (synthesisRef.current.speaking) {
                synthesisRef.current.cancel();
                setIsSpeaking(false);
            }
            setVoiceTranscript("");
            transcriptRef.current = "";

            try {
                await streamerRef.current?.start();
            } catch (err) {
                console.error("Failed to start streaming:", err);
            }
        }
    };

    const speakText = (text) => {
        if (!synthesisRef.current) return;
        
        // Note: We DO NOT stop listening here anymore for true full-duplex feel.
        // The echo cancellation in modern browsers/OS should handle the feedback.
        
        // Clean text for natural speech output
        const cleanText = text
            .replace(/\[cmd:.*?\]/g, '')                // Remove [cmd:...] navigation/commands
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')   // Convert [text](url) → just text
            .replace(/https?:\/\/[^\s)]+/g, '')         // Remove URLs
            .replace(/mailto:[^\s)]+/g, '')             // Remove mailto links
            .replace(/[*#_`~]/g, '')                    // Remove markdown symbols
            .replace(/[^\x00-\x7F\s]/g, '')             // Remove emoji/non-ASCII
            .replace(/\s+/g, ' ')                       // Normalize whitespace
            .trim();
        
        synthesisRef.current.cancel(); // Stop any current speech
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'en-US'; 
        
        // Attempt to make it sound slightly more natural        
        const bestVoice = getBestVoice();
        if (bestVoice) utterance.voice = bestVoice;
        
        // Dynamic rate/pitch for less robotic feel
        // Add tiny randomization for "human" variance
        const variance = (Math.random() - 0.5) * 0.05; 
        utterance.rate = 0.98 + (Math.random() * 0.04); 
        utterance.pitch = 1.0 + variance; 
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        
        // Tiny delay before speaking helps user transition from "thinking" state
        setTimeout(() => {
            synthesisRef.current.speak(utterance);
        }, 300);
    };

    const startListening = async () => {
        if (streamerRef.current && !isListening && !isSpeaking) {
            setVoiceTranscript("");
            transcriptRef.current = "";
            try { await streamerRef.current.start(); } catch(e) {}
        }
    };

    const stopListening = () => {
        if (streamerRef.current && isListening) {
            streamerRef.current.stop();
        }
    };
    // -------------------------

    useEffect(() => {
        const checkLimit = () => {
            const now = Date.now();
            const usage = JSON.parse(localStorage.getItem('ai_chat_usage') || '{}');
            
            // Check if existing session is expired (older than 4 hours)
            const lastReset = usage.lastReset || 0;
            const isExpired = (now - lastReset) > LIMIT_WINDOW_MS;

            if (isExpired) {
                // Time window passed, reset counter
                const newUsage = { lastReset: now, count: 0 };
                localStorage.setItem('ai_chat_usage', JSON.stringify(newUsage));
                setMessageCount(0);
                setIsLimitReached(false);
            } else {
                setMessageCount(usage.count || 0);
                if ((usage.count || 0) >= CHATS_PER_LIMIT_WINDOW) {
                    setIsLimitReached(true);
                }
            }
        };

        checkLimit();
    }, [isOpen]);

    const incrementUsage = () => {
        const now = Date.now();
        const usage = JSON.parse(localStorage.getItem('ai_chat_usage') || '{}');
        
        let currentCount = usage.count || 0;
        let lastReset = usage.lastReset || now;
        
        // Safety check: if somehow writing to stale session
        if ((now - lastReset) > LIMIT_WINDOW_MS) {
            currentCount = 0;
            lastReset = now;
        }

        const newCount = currentCount + 1;
        
        localStorage.setItem('ai_chat_usage', JSON.stringify({ lastReset, count: newCount }));
        setMessageCount(newCount);
        if (newCount >= CHATS_PER_LIMIT_WINDOW) {
            setIsLimitReached(true);
        }
    };
    // -------------------------

    useEffect(() => {
        const timer = setTimeout(() => {
            if (localStorage.getItem('hide_ai_promo') !== 'true') {
                setShowPromo(true);
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const dismissPromo = (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        setShowPromo(false);
        localStorage.setItem('hide_ai_promo', 'true');
    };
    const messagesEndRef = useRef(null);
    const lastSentTime = useRef(0);

    // Custom Link component for ReactMarkdown
    const MarkdownLink = ({ href, children }) => {
        const isExternal = href?.startsWith('http');
        
        const handleNavClick = (e, target) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Clean the target to get path and hash
            const isHash = target.includes('#');
            const [path, hash] = isHash ? target.split('#') : [target, null];
            
            const normalizedTarget = path === '' ? '/' : path;
            const isSamePage = location.pathname === normalizedTarget || 
                             (location.pathname === '/' && normalizedTarget === '/');

            if (isSamePage && hash) {
                const element = document.getElementById(hash);
                if (element) {
                    if (window.innerWidth < 640) setIsOpen(false);
                    
                    const offset = 80;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = element.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    window.history.pushState(null, null, target);
                    return;
                }
            }

            // Normal SPA navigation
            navigate(target);
            if (window.innerWidth < 640) setIsOpen(false);
        };

        if (!isExternal) {
            return (
                <button
                    type="button"
                    onClick={(e) => handleNavClick(e, href)}
                    className="inline-flex items-center gap-1 text-blue-600 font-bold hover:text-blue-700 transition-all group p-0 border-none bg-transparent cursor-pointer align-baseline"
                >
                    <span>{children}</span>
                    <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
            );
        }

        return (
            <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline inline-flex items-center gap-1 font-bold decoration-2 underline-offset-4"
            >
                {children} <ExternalLink size={12} />
            </a>
        );
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleCommand = (cmd, param) => {
        const isMobile = window.innerWidth < 640;

        switch (cmd) {
            case 'open-project':
                window.dispatchEvent(new CustomEvent('portfolio:open-project', { detail: param }));
                if (isMobile) setIsOpen(false); // Close on mobile when navigating to project detail
                break;
            case 'quick-replies':
                setQuickReplies(param.split('|'));
                break;
            case 'scroll-to':
                const element = document.getElementById(param);
                if (element) {
                    const offset = 80;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = element.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    
                    if (isMobile) setIsOpen(false); // Close on mobile after navigating to section
                }
                break;
            case 'toggle-blueprint':
                if (param === 'ON' && !blueprintMode) {
                    toggleBlueprint();
                } else if (param === 'OFF' && blueprintMode) {
                    toggleBlueprint();
                }
                break;
            case 'show-tech':
                // Logic for showing tech stack in chat message handled in handleSendMessage
                break;
            default:
                break;
        }
    };

    const [inputWarning, setInputWarning] = useState("");

    const handleSendMessage = async (text) => {
        if (isTyping || isLimitReached) return;
        
        const now = Date.now();
        if (now - lastSentTime.current < 1500) return; // 1.5s cooldown
        lastSentTime.current = now;

        const messageText = text || inputValue;
        if (!messageText.trim()) return;

        // --- CLIENT-SIDE VALIDATION ---
        // Prevents API calls/token usage for low-quality or malicious input
        if (!isValidInput(messageText)) {
            setInputWarning("Please provide a clearer message or question.");
            // Optional: Shake effect or visual feedback
            return;
        }
        setInputWarning(""); // Clear warning if valid
        // ------------------------------

        const userMessage = {
            id: Date.now(),
            text: messageText,
            sender: 'user'
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsTyping(true);
        setQuickReplies([]);

        try {
            const responseTextRaw = await generateAIResponse(userMessage.text);
            
            // Extract commands [cmd:name:param]
            const cmdRegex = /\[cmd:([^:]+):?([^\]]*)\]/g;
            let finalResponseText = responseTextRaw;
            let commands = [];
            let match;

            while ((match = cmdRegex.exec(responseTextRaw)) !== null) {
                commands.push({ name: match[1], param: match[2] });
                finalResponseText = finalResponseText.replace(match[0], '');
            }

            const botMessage = {
                id: Date.now() + 1,
                text: finalResponseText.trim(),
                sender: 'bot',
                showTech: commands.some(c => c.name === 'show-tech')
            };

            setMessages(prev => [...prev, botMessage]);
            

            
            // Increment daily usage
            incrementUsage();

            if (isVoiceMode) {
                speakText(finalResponseText.trim());
            }

            // Execute commands after a tiny delay
            setTimeout(() => {
                commands.forEach(cmd => handleCommand(cmd.name, cmd.param));
            }, 100);

        } catch (error) {
            console.error("AI Error:", error);
        } finally {
            setIsTyping(false);
        }
    };


    return (
        <div className="fixed bottom-8 right-8 z-[150]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={`fixed inset-x-4 top-4 bottom-24 sm:absolute sm:inset-auto sm:top-auto sm:bottom-20 sm:right-0 w-auto sm:w-[400px] sm:h-[600px] rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col transition-all duration-500 backdrop-blur-2xl ${
                            blueprintMode 
                            ? 'bg-[#050505]/95 shadow-blue-900/10' 
                            : 'bg-white/95'
                        }`}
                    >
                        {/* Header */}
                        <div className={`p-6 flex items-center justify-between shrink-0 transition-colors duration-500 ${
                            blueprintMode ? 'bg-[#0a0a0a]/50 text-blue-400' : 'bg-neutral-900 text-white'
                        }`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-500 ${
                                    blueprintMode ? 'bg-blue-900/20 text-blue-400 border border-blue-500/30' : 'bg-blue-600'
                                }`}>
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3 className={`font-bold tracking-tight ${blueprintMode ? 'uppercase tracking-widest' : ''}`}>
                                        {blueprintMode ? 'TERMINAL_AI' : 'AI Assistant'}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${blueprintMode ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></span>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${blueprintMode ? 'text-blue-400/60' : 'opacity-60'}`}>
                                            {blueprintMode ? 'NET_ONLINE' : 'System Online'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Language removed */}
                            <button 
                                onClick={toggleVoiceMode}
                                className={`p-2 rounded-full transition-colors ${
                                    isVoiceMode 
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                                        : blueprintMode ? 'text-blue-500 hover:bg-blue-900/20' : 'hover:bg-white/10'
                                }`}
                                title={isVoiceMode ? "Exit Voice Mode" : "Voice Conversation"}
                            >
                                {isVoiceMode ? <Mic size={20} className="animate-pulse" /> : <MicOff size={20} />}
                            </button>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className={`p-2 rounded-full transition-colors ${
                                    blueprintMode ? 'text-blue-500 hover:bg-blue-900/20' : 'hover:bg-white/10'
                                }`}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Chat Body */}
                        {!isVoiceMode && (
                        <div className={`flex-1 p-6 overflow-y-auto space-y-6 transition-colors duration-500 ${
                            blueprintMode ? 'bg-[#050505]' : 'bg-neutral-50/50'
                        }`}>
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-500 ${
                                        msg.sender === 'bot' 
                                            ? blueprintMode ? 'bg-blue-900/20 text-blue-400 border border-blue-500/20' : 'bg-neutral-900 text-white'
                                            : blueprintMode ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40' : 'bg-blue-600 text-white'
                                    }`}>
                                        {msg.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
                                    </div>
                                    <div className={`p-4 rounded-3xl shadow-sm max-w-[80%] transition-colors duration-500 ${
                                        msg.sender === 'bot'
                                            ? blueprintMode 
                                                ? 'bg-blue-950/20 rounded-tl-none text-blue-300 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]' 
                                                : 'bg-white rounded-tl-none shadow-neutral-200/50'
                                            : blueprintMode
                                                ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-950/20'
                                                : 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-200/50'
                                    }`}>
                                        {msg.sender === 'bot' ? (
                                            <div className={`text-sm leading-relaxed font-medium prose prose-sm max-w-none ${
                                                blueprintMode 
                                                    ? 'text-blue-300 prose-p:text-blue-300 prose-strong:text-blue-200 prose-headings:text-blue-200' 
                                                    : 'text-neutral-800 prose-neutral prose-headings:text-neutral-900 prose-strong:text-neutral-900'
                                            }`}>
                                                <ReactMarkdown 
                                                    components={{
                                                        a: MarkdownLink
                                                    }}
                                                >
                                                    {msg.text}
                                                </ReactMarkdown>

                                                {msg.showTech && (
                                                    <div className="mt-6 flex flex-wrap gap-2">
                                                        {['React', 'Next.js', 'Node.js', 'Tailwind', 'OpenAI', 'Python', 'PostgreSQL', 'Framer Motion'].map((tech, i) => (
                                                            <motion.div 
                                                                key={tech}
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: i * 0.05 }}
                                                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-2 group/tech transition-all hover:scale-110 ${
                                                                    blueprintMode 
                                                                        ? 'bg-blue-600/10 text-blue-400 shadow-[inset_0_0_15px_rgba(59,130,246,0.1)] hover:bg-blue-600/20' 
                                                                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                                                }`}
                                                            >
                                                                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${blueprintMode ? 'bg-blue-400 animate-pulse' : 'bg-blue-500'}`} />
                                                                {tech}
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                        ) : (
                                            <p className={`text-sm leading-relaxed font-medium whitespace-pre-wrap ${
                                                blueprintMode ? 'text-blue-300' : 'text-white'
                                            }`}>
                                                {msg.text}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                        blueprintMode ? 'bg-blue-900/20 text-blue-400 border border-blue-500/20' : 'bg-neutral-900 text-white'
                                    }`}>
                                        <Bot size={16} />
                                    </div>
                                    <div className={`p-4 rounded-2xl rounded-tl-none border shadow-sm ${
                                        blueprintMode ? 'bg-[#0a0a0a] border-blue-900/30' : 'bg-white border-neutral-100'
                                    }`}>
                                        <div className="flex gap-1">
                                            {[0, 0.2, 0.4].map((delay, i) => (
                                                <motion.div 
                                                    key={i}
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay }}
                                                    className={`w-2 h-2 rounded-full ${
                                                        blueprintMode ? 'bg-blue-500' : 'bg-neutral-400'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isLimitReached && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 border rounded-2xl space-y-3 ${
                                        blueprintMode ? 'bg-red-900/10 border-red-500/30' : 'bg-red-50 border-red-100'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-red-600 leading-relaxed">
                                        Chat limit reached (10/10). Access will refresh in a few hours.
                                    </p>
                                    <div className={`pt-3 border-t flex flex-col gap-2 ${
                                        blueprintMode ? 'border-red-500/20' : 'border-red-100'
                                    }`}>
                                        <p className="text-[10px] uppercase tracking-widest font-black text-red-400">Direct Contact Information:</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <a href="mailto:jonaldpenpillo@gmail.com" className={`flex items-center gap-2 text-[10px] font-bold transition-colors p-2 rounded-lg border ${
                                                blueprintMode 
                                                    ? 'bg-red-900/10 text-red-400 border-red-500/20 hover:bg-red-900/20' 
                                                    : 'bg-white text-neutral-600 hover:text-blue-600 border-neutral-100'
                                            }`}>
                                                <Mail size={12} /> Email
                                            </a>
                                            <a href="https://wa.me/639107876246" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-[10px] font-bold transition-colors p-2 rounded-lg border ${
                                                blueprintMode 
                                                    ? 'bg-red-900/10 text-red-400 border-red-500/20 hover:bg-red-900/20' 
                                                    : 'bg-white text-neutral-600 hover:text-blue-600 border-neutral-100'
                                            }`}>
                                                <Phone size={12} /> WhatsApp
                                            </a>
                                            <a href="https://www.linkedin.com/in/jonald-penpillo" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-[10px] font-bold transition-colors p-2 rounded-lg border ${
                                                blueprintMode 
                                                    ? 'bg-red-900/10 text-red-400 border-red-500/20 hover:bg-red-900/20' 
                                                    : 'bg-white text-neutral-600 hover:text-blue-600 border-neutral-100'
                                            }`}>
                                                <Linkedin size={12} /> LinkedIn
                                            </a>
                                            <a href="viber://contact?number=%2B639927133582" className={`flex items-center gap-2 text-[10px] font-bold transition-colors p-2 rounded-lg border ${
                                                blueprintMode 
                                                    ? 'bg-red-900/10 text-red-400 border-red-500/20 hover:bg-red-900/20' 
                                                    : 'bg-white text-neutral-600 hover:text-blue-600 border-neutral-100'
                                            }`}>
                                                <MessageCircle size={12} /> Viber
                                            </a>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-red-300 font-bold uppercase italic tracking-tighter">
                                        * Note: Interaction limit is reset every 4 hours. Usage is monitored by system architecture.
                                    </p>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                        )}

                        {isVoiceMode && (
                             <div className={`flex-1 relative overflow-hidden flex flex-col items-center justify-between py-6 px-4 ${
                                blueprintMode ? 'bg-[#050505]' : 'bg-neutral-50'
                             }`}>

                                {/* Background — Radial aura + concentric rings */}
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                    <motion.div
                                        animate={{ opacity: isListening ? 0.3 : isSpeaking ? 0.25 : 0.1 }}
                                        transition={{ duration: 1 }}
                                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[80px] ${
                                            isListening
                                                ? (blueprintMode ? 'bg-blue-600' : 'bg-blue-300')
                                                : isSpeaking
                                                    ? (blueprintMode ? 'bg-cyan-500' : 'bg-cyan-300')
                                                    : (blueprintMode ? 'bg-blue-900/60' : 'bg-blue-100')
                                        }`}
                                    />
                                </div>

                                {/* Status Pill */}
                                <div className="relative z-10">
                                    <motion.div
                                        layout
                                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] ${
                                            isSpeaking
                                                ? (blueprintMode ? 'bg-cyan-950/40 text-cyan-400 border-cyan-500/20' : 'bg-cyan-50 text-cyan-600 border-cyan-200')
                                                : isListening
                                                    ? (blueprintMode ? 'bg-blue-950/40 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-200')
                                                    : isTyping
                                                        ? (blueprintMode ? 'bg-amber-950/40 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200')
                                                        : (blueprintMode ? 'bg-neutral-900/60 text-neutral-500 border-white/5' : 'bg-white text-neutral-400 border-neutral-200')
                                        }`}
                                    >
                                        <motion.span
                                            animate={{ opacity: [1, 0.3, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className={`w-1.5 h-1.5 rounded-full ${
                                                isSpeaking ? 'bg-cyan-400' : isListening ? 'bg-blue-400' : isTyping ? 'bg-amber-400' : 'bg-neutral-400'
                                            }`}
                                        />
                                        {isSpeaking ? 'SPEAKING' : isListening ? 'LISTENING' : isTyping ? 'PROCESSING' : 'STANDBY'}
                                    </motion.div>
                                </div>

                                {/* Central Orb — Layered with rotating outer ring */}
                                <div className="relative z-10 flex flex-col items-center gap-8">
                                    <div className="relative flex items-center justify-center">

                                        {/* Concentric circle rings — centered on orb */}
                                        {[160, 200, 240].map((size, i) => (
                                            <div key={`ring-${i}`} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border pointer-events-none ${
                                                isSpeaking
                                                    ? (blueprintMode ? 'border-cyan-400/15' : 'border-cyan-400/20')
                                                    : isListening
                                                        ? (blueprintMode ? 'border-blue-400/15' : 'border-blue-400/20')
                                                        : (blueprintMode ? 'border-white/[0.04]' : 'border-neutral-300/30')
                                            }`} style={{ width: size, height: size }} />
                                        ))}

                                        {/* Pulse Rings */}
                                        {isSpeaking && [0, 0.7, 1.4].map((delay, i) => (
                                            <motion.div key={`sp-${i}`}
                                                className={`absolute w-36 h-36 rounded-full border ${blueprintMode ? 'border-cyan-400/30' : 'border-cyan-400/50'}`}
                                                animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
                                                transition={{ duration: 2.5, repeat: Infinity, delay, ease: "easeOut" }}
                                            />
                                        ))}
                                        {isListening && [0, 1].map((delay, i) => (
                                            <motion.div key={`ls-${i}`}
                                                className={`absolute w-36 h-36 rounded-full border ${blueprintMode ? 'border-blue-500/30' : 'border-blue-500/50'}`}
                                                animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, delay, ease: "easeOut" }}
                                            />
                                        ))}

                                        {/* Inner Orb Button */}
                                        <button
                                            onClick={handleVoiceToggle}
                                            className={`w-36 h-36 rounded-full flex items-center justify-center relative outline-none transition-all active:scale-95 cursor-pointer select-none touch-none ${
                                                blueprintMode
                                                    ? 'bg-gradient-to-b from-blue-500/80 to-blue-950'
                                                    : 'bg-gradient-to-b from-blue-500 to-blue-700'
                                            }`}
                                            style={{
                                                WebkitTouchCallout: 'none',
                                                boxShadow: isSpeaking
                                                    ? (blueprintMode
                                                        ? "0 0 60px 20px rgba(6, 182, 212, 0.3), inset 0 -8px 20px rgba(0,0,0,0.4)"
                                                        : "0 0 40px 15px rgba(6, 182, 212, 0.25), inset 0 -8px 20px rgba(0,0,0,0.3)")
                                                    : isListening
                                                        ? (blueprintMode
                                                            ? "0 0 40px 12px rgba(59, 130, 246, 0.3), inset 0 -8px 20px rgba(0,0,0,0.4)"
                                                            : "0 0 30px 10px rgba(59, 130, 246, 0.25), inset 0 -8px 20px rgba(0,0,0,0.3)")
                                                        : (blueprintMode
                                                            ? "0 0 20px 4px rgba(59, 130, 246, 0.1), inset 0 -8px 20px rgba(0,0,0,0.4)"
                                                            : "0 0 20px 8px rgba(59, 130, 246, 0.15), inset 0 -8px 20px rgba(0,0,0,0.25)")
                                            }}
                                        >
                                            <motion.div
                                                animate={{
                                                    scale: isSpeaking ? [1, 1.08, 1] : isListening ? 1.05 : 1
                                                }}
                                                transition={{ duration: isSpeaking ? 0.8 : 0.3, repeat: isSpeaking ? Infinity : 0 }}
                                                className="pointer-events-none"
                                            >
                                                <Bot size={56} className={isSpeaking ? 'text-cyan-200' : isListening ? 'text-blue-200' : 'text-white/90'} />
                                            </motion.div>
                                        </button>
                                    </div>

                                    {/* Waveform Visualizer — 16 bars */}
                                    <div className="h-10 flex items-end justify-center gap-[3px]">
                                        {[...Array(16)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{
                                                    height: isSpeaking
                                                        ? [4, 8 + Math.random() * 24, 4]
                                                        : isListening
                                                            ? [4, 6 + Math.sin(i * 0.8) * 8, 4]
                                                            : 4
                                                }}
                                                transition={{
                                                    duration: isSpeaking ? 0.25 + Math.random() * 0.15 : isListening ? 1.2 + i * 0.05 : 0.5,
                                                    repeat: (isSpeaking || isListening) ? Infinity : 0,
                                                    repeatType: "reverse",
                                                    delay: i * 0.03
                                                }}
                                                className={`w-1 rounded-full ${
                                                    isSpeaking
                                                        ? (blueprintMode ? 'bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.6)]' : 'bg-cyan-500')
                                                        : isListening
                                                            ? (blueprintMode ? 'bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.5)]' : 'bg-blue-500')
                                                            : (blueprintMode ? 'bg-white/10' : 'bg-neutral-300')
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Transcript + Action Hint */}
                                <div className="relative z-10 text-center w-full max-w-xs min-h-[60px] flex flex-col items-center justify-end gap-2">
                                    {/* Processing bar */}
                                    {isTyping && !isSpeaking && !isListening && (
                                        <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: "100%", opacity: 1 }} className={`w-20 h-0.5 rounded-full overflow-hidden ${blueprintMode ? 'bg-white/5' : 'bg-neutral-200'}`}>
                                            <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-1/2 h-full bg-amber-500" />
                                        </motion.div>
                                    )}

                                    {/* Transcript */}
                                    <AnimatePresence mode="wait">
                                        {voiceTranscript && (
                                            <motion.p
                                                key="transcript"
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                className={`text-base font-medium leading-relaxed ${blueprintMode ? 'text-white/70' : 'text-neutral-700'}`}
                                            >
                                                "{voiceTranscript}"
                                            </motion.p>
                                        )}
                                    </AnimatePresence>

                                    {/* Action hint — only when listening */}
                                    {isListening && !voiceTranscript && (
                                        <motion.p
                                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className={`text-[10px] font-bold uppercase tracking-[0.2em] ${blueprintMode ? 'text-blue-400/60' : 'text-blue-500/60'}`}
                                        >
                                            Speak now...
                                        </motion.p>
                                    )}
                                    {isListening && voiceTranscript && (
                                        <motion.p
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className={`text-[10px] font-bold uppercase tracking-[0.2em] ${blueprintMode ? 'text-blue-400' : 'text-blue-600'}`}
                                        >
                                            TAP to SEND
                                        </motion.p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Quick Replies */}
                        {/* Quick Replies - Hide in Voice Mode logic handled by conditional voice view */}
                        {!isVoiceMode && <AnimatePresence>
                            {quickReplies.length > 0 && (
                                <div className={`px-6 py-3 border-t flex gap-2 overflow-x-auto no-scrollbar shrink-0 transition-colors duration-500 ${
                                    blueprintMode ? 'bg-[#0a0a0a] border-blue-900/30' : 'bg-white border-neutral-50'
                                }`}>
                                    {quickReplies.map((reply) => (
                                        <motion.button
                                            key={reply}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            onClick={() => handleSendMessage(reply)}
                                            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${
                                                blueprintMode 
                                                    ? 'bg-blue-900/10 text-blue-400 border-blue-500/30 hover:bg-blue-900/30' 
                                                    : 'bg-neutral-50 hover:bg-blue-50 text-neutral-600 hover:text-blue-600 border-neutral-100 hover:border-blue-100'
                                            }`}
                                        >
                                            {reply}
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>}

                        {/* Input Area - Hidden in Voice Mode if desired, or kept for fallback */}
                        {!isVoiceMode && (
                        <form 
                           onSubmit={(e) => {
                               e.preventDefault();
                               handleSendMessage();
                           }} 
                           className={`p-6 shrink-0 relative transition-colors duration-500 ${
                               blueprintMode ? 'bg-[#050505]/50' : 'bg-white'
                           }`}
                        >
                            {/* Validation Warning */}
                            <AnimatePresence>
                                {inputWarning && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute -top-12 left-6 right-6 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wide px-4 py-2 rounded-xl border border-red-100 shadow-sm flex items-center gap-2"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                        {inputWarning}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    disabled={isTyping || isLimitReached}
                                    placeholder={
                                        isLimitReached 
                                            ? "Limit reached..." 
                                            : isTyping 
                                                ? (blueprintMode ? "PROCESSING..." : "AI is thinking...") 
                                                : (blueprintMode ? "ENTER_COMMAND..." : "Ask about Jonald's experience...")
                                    }
                                    className={`w-full pl-6 pr-14 py-4 rounded-2xl text-sm focus:outline-none transition-all font-medium disabled:opacity-70 ${
                                        blueprintMode 
                                            ? 'bg-[#0a0a0a] border border-blue-900/30 text-blue-400 focus:border-blue-500 placeholder-blue-700/30' 
                                            : 'bg-neutral-50 border border-neutral-100 focus:border-blue-600'
                                    }`}
                                />
                                <button 
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping || isLimitReached}
                                    className={`absolute right-2 top-2 bottom-2 px-4 rounded-xl transition-all disabled:opacity-50 ${
                                        blueprintMode 
                                            ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/40 border border-blue-500/30' 
                                            : 'bg-neutral-900 text-white hover:bg-blue-600 disabled:hover:bg-neutral-900'
                                    }`}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <p className={`text-[10px] text-center mt-4 font-bold uppercase tracking-widest transition-colors ${
                                blueprintMode ? 'text-blue-500/40' : 'text-neutral-400'
                            }`}>
                                {blueprintMode ? 'SYSTEM_ARCHITECTURE_V1.0' : "Powered by Jonald's AI Architecture"}
                            </p>
                        </form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {!isOpen && showPromo && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8, x: 20 }}
                        className="absolute bottom-20 right-0 mb-4 mr-2 z-[160]"
                    >
                        <div className="relative group">
                            {/* Glassmorphic Background Card */}
                            <div className="bg-neutral-900/90 backdrop-blur-xl text-white p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 flex items-center gap-4 min-w-[280px]">
                                {/* Icon container */}
                                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                                    <Bot size={20} className="text-white" />
                                </div>
                                
                                {/* Content */}
                                <div className="flex flex-col pr-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-0.5">AI Concierge</span>
                                    <p className="text-xs font-bold leading-relaxed opacity-90">
                                        Have questions? <br/>Ask my AI assistant!
                                    </p>
                                </div>
                                
                                {/* Close Button */}
                                <button 
                                    onClick={dismissPromo}
                                    className="absolute top-2 right-2 p-1.5 hover:bg-white/10 rounded-lg transition-colors group/close"
                                    aria-label="Close suggestion"
                                >
                                    <X size={14} className="opacity-40 group-hover/close:opacity-100 transition-opacity" />
                                </button>

                                {/* Tail/Arrow */}
                                <div className="absolute -bottom-2 right-6 w-4 h-4 bg-neutral-900/90 border-r border-b border-white/10 rotate-45" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 ${
                    isOpen 
                        ? blueprintMode ? 'bg-[#050505] text-blue-400 border border-blue-500/50 rotate-90' : 'bg-neutral-900 text-white rotate-90' 
                        : blueprintMode ? 'bg-blue-600 text-white shadow-blue-500/40' : 'bg-blue-600 text-white'
                }`}
            >
                {isOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                ) : (
                    <div className="relative">
                        <MessageSquare size={28} />
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-white/30 rounded-full"
                        />
                    </div>
                )}
            </motion.button>
        </div>
    );
};

export default SystemConcierge;
