import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Bot, Send, User, X, Mail, Phone, Linkedin, MessageCircle, Mic, MicOff, Volume2, Globe, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateAIResponse, generateAIResponseStreaming, isValidInput } from '../utils/aiKnowledge';
import { AssemblyAIStreamer } from '../utils/assemblyAIStreamer';
import { useUI } from '../context/UIContext';

import { useNavigate, useLocation } from 'react-router-dom';
import { ExternalLink, ArrowUpRight } from 'lucide-react';

const SystemConcierge = () => {
    const { themeMode, blueprintMode, darkMode, isDark, themed, playSound, isChatOpen, toggleChat, closeChat, toggleBlueprint, viewedProjects } = useUI();
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
            text: "Hey! 👋 I'm Jonald's AI companion. Feel free to ask me about his work, skills, or projects! \n\nYou can also explore the site directly: [View Portfolio](/#section-projects) or [See Process](/#section-process)",
            sender: 'bot'
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [quickReplies, setQuickReplies] = useState(["Projects", "Tech Stack", "Hire Jonald"]);
    const [showPromo, setShowPromo] = useState(false);
    
    // --- DAILY LIMIT LOGIC ---
    const CHATS_PER_LIMIT_WINDOW = 12;
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
    const endOfTurnTimerRef = useRef(null); // Auto-send debounce timer
    const ttsQueueRef = useRef([]); // TTS sentence queue
    const isTTSSpeakingRef = useRef(false); // Is TTS currently speaking
    const streamAbortRef = useRef(null); // Abort function for active stream
    
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
            onTranscript: (text, endOfTurn) => {
                // Interrupt: cancel speech, TTS queue, and active stream
                if (text) {
                    if (synthesisRef.current.speaking || ttsQueueRef.current.length > 0) {
                        cancelTTSQueue();
                    }
                    if (streamAbortRef.current) {
                        streamAbortRef.current();
                        streamAbortRef.current = null;
                        setIsTyping(false);
                    }
                }

                setVoiceTranscript(text);
                transcriptRef.current = text;

                // Clear any existing auto-send timer
                if (endOfTurnTimerRef.current) {
                    clearTimeout(endOfTurnTimerRef.current);
                    endOfTurnTimerRef.current = null;
                }

                // Auto-send after 1.5s silence when end_of_turn detected
                if (endOfTurn && text && text.trim()) {
                    endOfTurnTimerRef.current = setTimeout(() => {
                        if (isVoiceModeRef.current && streamerRef.current?.state === 'listening') {
                            streamerRef.current?.stop();
                            setIsListening(false);
                            const finalText = transcriptRef.current.trim();
                            if (finalText) {
                                handleSendMessageRef.current?.(finalText);
                                setVoiceTranscript("");
                                transcriptRef.current = "";
                            }
                        }
                        endOfTurnTimerRef.current = null;
                    }, 1500);
                }
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
            if (endOfTurnTimerRef.current) clearTimeout(endOfTurnTimerRef.current);
        };
    }, []);



    const toggleVoiceMode = () => {
        const newMode = !isVoiceMode;
        setIsVoiceMode(newMode);
        isVoiceModeRef.current = newMode;

        if (!newMode) {
            cancelTTSQueue();
            streamerRef.current?.stop();
            if (streamAbortRef.current) { streamAbortRef.current(); streamAbortRef.current = null; }
            if (endOfTurnTimerRef.current) { clearTimeout(endOfTurnTimerRef.current); endOfTurnTimerRef.current = null; }
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

    // Clean text for TTS
    const cleanForSpeech = (text) => {
        return text
            .replace(/\[cmd:.*?\]/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/https?:\/\/[^\s)]+/g, '')
            .replace(/mailto:[^\s)]+/g, '')
            .replace(/[*#_`~]/g, '')
            .replace(/[^\u0000-\u007F\s]/g, '')
            .replace(/Penpillo/gi, 'Penpilyo')
            .replace(/\s+/g, ' ')
            .trim();
    };

    // Enqueue a sentence for immediate TTS playback
    const enqueueSentence = (text) => {
        const cleanText = cleanForSpeech(text);
        if (!cleanText) return;
        ttsQueueRef.current.push(cleanText);
        processNextSentence();
    };

    // Process next sentence in TTS queue (FIFO)
    const processNextSentence = () => {
        if (isTTSSpeakingRef.current) return;
        if (ttsQueueRef.current.length === 0) {
            setIsSpeaking(false);
            return;
        }

        const sentence = ttsQueueRef.current.shift();
        isTTSSpeakingRef.current = true;
        setIsSpeaking(true);

        const utterance = new SpeechSynthesisUtterance(sentence);
        utterance.lang = 'en-US';
        const bestVoice = getBestVoice();
        if (bestVoice) utterance.voice = bestVoice;
        utterance.rate = 0.98 + (Math.random() * 0.04);
        utterance.pitch = 1.0 + (Math.random() - 0.5) * 0.05;

        utterance.onend = () => { isTTSSpeakingRef.current = false; processNextSentence(); };
        utterance.onerror = () => { isTTSSpeakingRef.current = false; processNextSentence(); };
        synthesisRef.current.speak(utterance);
    };

    // Cancel all TTS and clear queue
    const cancelTTSQueue = () => {
        ttsQueueRef.current = [];
        isTTSSpeakingRef.current = false;
        synthesisRef.current.cancel();
        setIsSpeaking(false);
    };

    // Unified interaction handler
    const handleVoiceToggle = async (e) => {
        if (e && e.preventDefault && e.cancelable) e.preventDefault();

        // Cancel any pending auto-send
        if (endOfTurnTimerRef.current) {
            clearTimeout(endOfTurnTimerRef.current);
            endOfTurnTimerRef.current = null;
        }

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
            cancelTTSQueue();
            setVoiceTranscript("");
            transcriptRef.current = "";

            try {
                await streamerRef.current?.start();
            } catch (err) {
                console.error("Failed to start streaming:", err);
            }
        }
    };

    // Sync limit from backend on mount
    useEffect(() => {
        const fetchLimitStatus = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || '';
                const response = await fetch(`${API_URL}/api/chat/limit`);
                if (response.ok) {
                    const data = await response.json();
                    setMessageCount(data.count);
                    setIsLimitReached(data.isLimitReached);
                }
            } catch (err) {
                console.warn("Could not sync limit from server, falling back to local tracking.");
            }
        };

        if (isOpen) {
            fetchLimitStatus();
        }
    }, [isOpen]);

    const incrementUsage = () => {
        const newCount = messageCount + 1;
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
            case 'navigate':
                navigate(param);
                if (isMobile) setIsOpen(false);
                break;
            case 'quick-replies':
                setQuickReplies(param.split('|'));
                break;
            case 'scroll-to': {
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
            }
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

        // Cancel any active stream from a previous request
        if (streamAbortRef.current) {
            streamAbortRef.current();
            streamAbortRef.current = null;
        }

        try {
            if (isVoiceModeRef.current) {
                // --- STREAMING PATH (voice mode) ---
                const botMessageId = Date.now() + 1;
                setMessages(prev => [...prev, { id: botMessageId, text: '...', sender: 'bot' }]);

                let accumulatedText = '';

                const abort = await generateAIResponseStreaming(messageText, {
                    onSentence: (sentence) => {
                        accumulatedText += (accumulatedText ? ' ' : '') + sentence;
                        setMessages(prev => prev.map(msg =>
                            msg.id === botMessageId ? { ...msg, text: accumulatedText } : msg
                        ));
                        enqueueSentence(sentence);
                    },
                    userHistory: viewedProjects,
                    onComplete: (completeText, usage) => {
                        // Extract commands from full text
                        const cmdRegex = /\[cmd:([^:]+):?([^\]]*)\]/g;
                        let finalText = completeText;
                        let commands = [];
                        let match;
                        while ((match = cmdRegex.exec(completeText)) !== null) {
                            commands.push({ name: match[1], param: match[2] });
                            finalText = finalText.replace(match[0], '');
                        }

                        setMessages(prev => {
                            const newMessages = [...prev];
                            // Find the user message that started this
                            const userMsgIndex = [...newMessages].reverse().findIndex(m => m.sender === 'user');
                            if (userMsgIndex !== -1) {
                                const actualIndex = newMessages.length - 1 - userMsgIndex;
                                newMessages[actualIndex] = { ...newMessages[actualIndex], prompt_tokens: usage?.prompt_tokens };
                            }
                            return newMessages.map(msg =>
                                msg.id === botMessageId
                                    ? { ...msg, text: finalText.trim(), completion_tokens: usage?.completion_tokens, showTech: commands.some(c => c.name === 'show-tech') }
                                    : msg
                            );
                        });

                        incrementUsage();
                        setIsTyping(false);

                        setTimeout(() => {
                            commands.forEach(cmd => handleCommand(cmd.name, cmd.param));
                        }, 100);
                    },
                    onError: (error) => {
                        console.error("Streaming AI Error:", error);
                        setIsTyping(false);
                    }
                });

                streamAbortRef.current = abort;

            } else {
                // --- NON-STREAMING PATH (text chat) ---
                const { response: responseTextRaw, usage } = await generateAIResponse(userMessage.text, viewedProjects);

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
                    completion_tokens: usage?.completion_tokens,
                    showTech: commands.some(c => c.name === 'show-tech')
                };

                setMessages(prev => {
                    const newMessages = [...prev];
                    // Update current user message with prompt tokens
                    const userMsgIndex = [...newMessages].reverse().findIndex(m => m.sender === 'user');
                    if (userMsgIndex !== -1) {
                        const actualIndex = newMessages.length - 1 - userMsgIndex;
                        newMessages[actualIndex] = { ...newMessages[actualIndex], prompt_tokens: usage?.prompt_tokens };
                    }
                    return [...newMessages, botMessage];
                });

                incrementUsage();

                setTimeout(() => {
                    commands.forEach(cmd => handleCommand(cmd.name, cmd.param));
                }, 100);

                setIsTyping(false);
            }

        } catch (error) {
            console.error("AI Error:", error);
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
                        className={`fixed inset-0 sm:absolute sm:inset-auto sm:top-auto sm:bottom-20 sm:right-0 w-full h-full sm:w-[400px] sm:h-[600px] rounded-none sm:rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col transition-all duration-500 backdrop-blur-2xl ${
                            themed('bg-white/95', 'bg-[#0a0a0a]/95 border border-neutral-800', 'bg-[#050505]/95 shadow-blue-900/10 border border-blue-500/20', 'bg-[#fdf6e3]/95 border border-[#433422]/10')
                        }`}
                    >
                        {/* Header */}
                        <div className={`p-6 flex items-center justify-between shrink-0 transition-colors duration-500 border-b ${
                            themed('bg-white border-neutral-100 text-neutral-900', 'bg-[#0f0f0f] text-neutral-100 border-neutral-800', 'bg-[#0a0a0a]/50 text-blue-400 border-blue-500/20', 'bg-[#eee8d5] border-[#433422]/10 text-[#433422]')
                        }`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors duration-500 ${
                                    themed('bg-blue-600 text-white', 'bg-blue-500 text-white', 'bg-blue-900/20 text-blue-400 border border-blue-500/30', 'bg-[#b58900] text-[#fdf6e3]')
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
                                        : themed('text-neutral-500 hover:bg-neutral-100', 'text-neutral-400 hover:bg-white/10', 'text-blue-500 hover:bg-blue-900/20', 'text-[#433422]/60 hover:bg-[#433422]/10')
                                }`}
                                title={isVoiceMode ? "Exit Voice Mode" : "Voice Conversation"}
                            >
                                {isVoiceMode ? <Mic size={20} className="animate-pulse" /> : <MicOff size={20} />}
                            </button>
                            <button 
                                onClick={() => setIsOpen(false)}
                                    className={`p-2 rounded-full transition-colors ${
                                        themed('text-neutral-500 hover:bg-neutral-100', 'text-neutral-400 hover:bg-white/10', 'text-blue-500 hover:bg-blue-900/20')
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
                            themed('bg-neutral-50/50', 'bg-[#0a0a0a]', 'bg-[#050505]', 'bg-[#fdf6e3]/50')
                        }`}>
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                    {blueprintMode && msg.prompt_tokens && (
                                        <div className="px-2 mb-1">
                                            <span className="text-[9px] font-black tracking-tighter text-blue-500/60 uppercase">
                                                I_TOKENS: {msg.prompt_tokens}
                                            </span>
                                        </div>
                                    )}
                                    {blueprintMode && msg.completion_tokens && (
                                        <div className="px-2 mb-1">
                                            <span className="text-[9px] font-black tracking-tighter text-blue-400/80 uppercase">
                                                O_TOKENS: {msg.completion_tokens}
                                            </span>
                                        </div>
                                    )}
                                    <div className={`flex gap-3 w-full ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-500 ${
                                            msg.sender === 'bot' 
                                                ? themed('bg-neutral-900 text-white', 'bg-[#1a1a1a] text-neutral-300 border border-neutral-800', 'bg-blue-900/20 text-blue-400 border border-blue-500/20', 'bg-[#433422] text-[#fdf6e3]')
                                                : themed('bg-blue-600 text-white', 'bg-blue-500 text-white', 'bg-blue-600/20 text-blue-400 border border-blue-500/40', 'bg-[#b58900] text-[#fdf6e3]')
                                        }`}>
                                            {msg.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
                                        </div>
                                        <div className={`p-4 rounded-3xl shadow-sm max-w-[80%] transition-all duration-500 ${
                                            msg.sender === 'bot'
                                                ? themed('bg-white rounded-tl-none shadow-neutral-200/50', 'bg-[#1a1a1a] rounded-tl-none text-neutral-100 border border-neutral-800', 'bg-blue-950/20 rounded-tl-none text-blue-300 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)] border border-blue-500/20', 'bg-[#eee8d5] rounded-tl-none text-[#433422] shadow-[#433422]/05')
                                                : themed('bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-200/50', 'bg-blue-500 text-white rounded-tr-none shadow-lg shadow-blue-950/40', 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/20 border border-blue-400/30', 'bg-[#b58900] text-[#fdf6e3] rounded-tr-none shadow-[#b58900]/20')
                                        }`}>
                                            {msg.sender === 'bot' ? (
                                                <div className={`text-sm leading-relaxed font-medium prose prose-sm max-w-none ${
                                                    themed('text-neutral-800 prose-neutral prose-headings:text-neutral-900 prose-strong:text-neutral-900', 'text-neutral-200 prose-invert prose-headings:text-white prose-strong:text-white', 'text-blue-300 prose-p:text-blue-300 prose-strong:text-blue-200 prose-headings:text-blue-200', 'text-[#433422] prose-brown prose-headings:text-[#433422] prose-strong:text-[#433422]')
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
                                                                        themed('bg-neutral-100 text-neutral-600 border border-neutral-200', 'bg-neutral-800 text-neutral-400 border border-neutral-700', 'bg-blue-900/10 text-blue-400 border border-blue-500/20', 'bg-[#b58900]/10 text-[#b58900] border border-[#b58900]/20')
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
                                        themed('bg-white border-neutral-100', 'bg-[#1a1a1a] border-neutral-800', 'bg-[#0a0a0a] border-blue-900/30', 'bg-[#eee8d5] border-[#433422]/10')
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
                                        Chat limit reached (12/12). Access will refresh in a few hours.
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
                             <div className={`flex-1 relative overflow-hidden flex flex-col items-center justify-between py-8 px-6 ${
                                themed('bg-white', 'bg-[#0a0a0a]', 'bg-[#050505]', 'bg-[#fdf6e3]')
                             }`}>

                                {/* Background — Subtle grid matching homepage */}
                                <div className="absolute inset-0 pointer-events-none" style={{
                                    backgroundImage: themed(
                                        'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)',
                                        'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
                                        'linear-gradient(to right, rgba(59,130,246,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.06) 1px, transparent 1px)',
                                        'linear-gradient(to right, rgba(67,52,34,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(67,52,34,0.05) 1px, transparent 1px)'
                                    ),
                                    backgroundSize: '20px 20px'
                                }} />
                                <div className={`absolute inset-0 pointer-events-none ${
                                    themed(
                                        'bg-gradient-to-b from-white via-transparent to-white',
                                        'bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]',
                                        'bg-gradient-to-b from-[#050505] via-transparent to-[#050505]',
                                        'bg-gradient-to-b from-[#fdf6e3] via-transparent to-[#fdf6e3]'
                                    )
                                }`} />

                                {/* Status Badge — pill style matching homepage */}
                                <div className="relative z-10">
                                    <div className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-full border-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                                        isSpeaking
                                            ? themed('border-blue-600 text-blue-600 bg-blue-50', 'border-blue-500 text-blue-500 bg-blue-500/10', 'border-blue-500/40 text-blue-400 bg-blue-950/20', 'border-[#b58900] text-[#b58900] bg-[#b58900]/10')
                                            : isListening
                                                ? themed('border-blue-600 text-blue-600 bg-blue-50', 'border-blue-500 text-blue-500 bg-blue-500/10', 'border-blue-500/40 text-blue-400 bg-blue-950/20', 'border-[#b58900] text-[#b58900] bg-[#b58900]/10')
                                                : isTyping
                                                    ? themed('border-neutral-300 text-neutral-500 bg-white', 'border-neutral-700 text-neutral-400 bg-neutral-900', 'border-amber-500/40 text-amber-400 bg-amber-950/20', 'border-[#433422]/20 text-[#433422]/60 bg-[#eee8d5]')
                                                    : themed('border-neutral-200 text-neutral-400 bg-white', 'border-neutral-800 text-neutral-600 bg-neutral-900', 'border-white/10 text-neutral-500 bg-white/5', 'border-[#433422]/10 text-[#433422]/40 bg-[#eee8d5]')
                                    }`}>
                                        <span className={`w-2 h-2 rounded-full transition-colors ${
                                            isSpeaking
                                                ? 'bg-blue-600 animate-pulse'
                                                : isListening
                                                    ? 'bg-green-500 animate-pulse'
                                                    : isTyping
                                                        ? 'bg-amber-500 animate-pulse'
                                                        : themed('bg-neutral-300', 'bg-neutral-800', 'bg-neutral-600', 'bg-[#433422]/20')
                                        }`} />
                                        {isSpeaking ? 'Speaking' : isListening ? 'Listening' : isTyping ? 'Processing' : 'Ready'}
                                    </div>
                                </div>

                                {/* Central Button + Waveform */}
                                <div className="relative z-10 flex flex-col items-center gap-6">
                                    <div className="relative flex items-center justify-center">
                                        {/* Subtle ring pulse — only when active */}
                                        {(isListening || isSpeaking) && (
                                                <motion.div
                                                className={`absolute w-32 h-32 rounded-full ${
                                                    themed('border-2 border-blue-600/15', 'border-2 border-blue-500/20', 'border-2 border-blue-500/20', 'border-2 border-[#b58900]/20')
                                                }`}
                                                animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                                            />
                                        )}

                                        {/* Main Button */}
                                        <button
                                            onClick={handleVoiceToggle}
                                            className={`w-32 h-32 rounded-full flex items-center justify-center relative outline-none transition-all duration-300 active:scale-95 cursor-pointer select-none touch-none ${
                                                isListening || isSpeaking
                                                    ? themed('bg-blue-600 border-2 border-blue-600 shadow-2xl shadow-blue-500/25', 'bg-blue-500 border-2 border-blue-400 shadow-2xl shadow-blue-500/40', 'bg-blue-600 border-2 border-blue-400 shadow-2xl shadow-blue-500/20', 'bg-[#b58900] border-2 border-[#b58900] shadow-2xl shadow-[#b58900]/25')
                                                    : themed('bg-white border-2 border-neutral-200 shadow-xl hover:border-blue-600 hover:shadow-blue-100', 'bg-[#1a1a1a] border-2 border-neutral-800 shadow-xl hover:border-blue-500 hover:shadow-blue-900/40', 'bg-[#0a0a0a] border-2 border-blue-500/30 shadow-xl', 'bg-[#eee8d5] border-2 border-[#433422]/10 shadow-xl hover:border-[#b58900] hover:shadow-[#b58900]/10')
                                            }`}
                                            style={{ WebkitTouchCallout: 'none' }}
                                        >
                                            <motion.div
                                                animate={{ scale: isSpeaking ? [1, 1.08, 1] : 1 }}
                                                transition={{ duration: 1, repeat: isSpeaking ? Infinity : 0 }}
                                                className="pointer-events-none"
                                            >
                                                <Bot size={48} className={
                                                    isListening || isSpeaking
                                                        ? 'text-white'
                                                        : themed('text-blue-600', 'text-blue-500', 'text-blue-400', 'text-[#b58900]')
                                                } />
                                            </motion.div>
                                        </button>
                                    </div>

                                    {/* Waveform Visualizer */}
                                    <div className="h-8 flex items-end justify-center gap-[3px]">
                                        {[...Array(16)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{
                                                    height: isSpeaking
                                                        ? [3, 6 + Math.random() * 20, 3]
                                                        : isListening
                                                            ? [3, 4 + Math.sin(i * 0.8) * 8, 3]
                                                            : 3
                                                }}
                                                transition={{
                                                    duration: isSpeaking ? 0.25 + Math.random() * 0.15 : isListening ? 1.2 + i * 0.05 : 0.5,
                                                    repeat: (isSpeaking || isListening) ? Infinity : 0,
                                                    repeatType: "reverse",
                                                    delay: i * 0.03
                                                }}
                                                 className={`w-1 rounded-full ${
                                                    isSpeaking || isListening
                                                        ? themed('bg-blue-600', 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]', 'bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.5)]', 'bg-[#b58900]')
                                                        : themed('bg-neutral-200', 'bg-neutral-800', 'bg-white/10', 'bg-[#433422]/20')
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Transcript + Action Hint */}
                                <div className="relative z-10 text-center w-full max-w-xs min-h-[56px] flex flex-col items-center justify-end gap-2">
                                    {/* Processing bar */}
                                     {isTyping && !isSpeaking && !isListening && (
                                        <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: "60%", opacity: 1 }} className={`h-0.5 rounded-full overflow-hidden ${themed('bg-neutral-100', 'bg-neutral-800', 'bg-white/5', 'bg-[#433422]/10')}`}>
                                            <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className={`h-full ${themed('bg-blue-600 w-1/2', 'bg-blue-500 w-1/2 shadow-[0_0_10px_rgba(59,130,246,0.5)]', 'bg-blue-500 w-1/2', 'bg-[#b58900] w-1/2')}`} />
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
                                                 className={`text-lg font-medium leading-relaxed ${themed('text-neutral-800', 'text-neutral-200', 'text-blue-300', 'text-[#433422]')}`}
                                            >
                                                {voiceTranscript}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>

                                    {/* Action hints */}
                                    {!isListening && !isSpeaking && !isTyping && (
                                        <p className={`text-xs font-bold uppercase tracking-widest ${themed('text-neutral-400', 'text-neutral-600', 'text-blue-500/50', 'text-[#433422]/40')}`}>
                                            Tap to Speak
                                        </p>
                                    )}
                                    {isListening && !voiceTranscript && (
                                        <motion.p
                                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className={`text-xs font-bold uppercase tracking-widest ${blueprintMode ? 'text-blue-500/50' : 'text-neutral-400'}`}
                                        >
                                            Speak now...
                                        </motion.p>
                                    )}
                                    {isListening && voiceTranscript && (
                                        <motion.p
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className={`text-xs font-bold uppercase tracking-widest ${blueprintMode ? 'text-blue-400' : 'text-blue-600'}`}
                                        >
                                            Tap to send
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
                                    themed('bg-white border-neutral-50', 'bg-[#0f0f0f] border-neutral-800', 'bg-[#0a0a0a] border-blue-500/20', 'bg-[#eee8d5] border-[#433422]/10')
                                }`}>
                                    {quickReplies.map((reply) => (
                                        <motion.button
                                            key={reply}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            onClick={() => handleSendMessage(reply)}
                                            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${
                                                themed('bg-neutral-50 hover:bg-blue-50 text-neutral-600 hover:text-blue-600 border-neutral-100 hover:border-blue-100', 'bg-[#1a1a1a] hover:bg-blue-500/10 text-neutral-400 hover:text-blue-400 border-neutral-800 hover:border-blue-500/40', 'bg-blue-900/10 text-blue-400 border-blue-500/30 hover:bg-blue-900/30', 'bg-[#fdf6e3] hover:bg-[#b58900]/10 text-[#433422]/60 hover:text-[#b58900] border-[#433422]/10 hover:border-[#b58900]/30')
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
                           className={`p-6 border-t relative transition-colors duration-500 ${
                                themed('bg-white border-neutral-100', 'bg-[#0f0f0f] border-neutral-800', 'bg-[#0a0a0a] border-blue-500/10', 'bg-[#eee8d5] border-[#433422]/10')
                            }`}
                        >
                            {/* Validation Warning */}
                            <AnimatePresence>
                                {inputWarning && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className={`absolute -top-12 left-6 right-6 text-[10px] font-bold uppercase tracking-wide px-4 py-2 rounded-xl border shadow-sm flex items-center gap-2 ${
                                            blueprintMode 
                                                ? 'bg-red-900/20 text-red-400 border-red-500/30 shadow-red-900/10' 
                                                : 'bg-red-50 text-red-600 border-red-100'
                                        }`}
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
                                        themed(
                                            'bg-neutral-50 border border-neutral-100 focus:border-blue-600',
                                            'bg-[#1a1a1a] border border-neutral-800 text-neutral-200 focus:border-blue-500 placeholder-neutral-700',
                                            'bg-[#0a0a0a] border border-blue-500/20 text-blue-400 focus:border-blue-500 placeholder-blue-700/30',
                                            'bg-[#fdf6e3] border border-[#433422]/10 text-[#433422] focus:border-[#b58900] placeholder-[#433422]/30'
                                        )
                                    }`}
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping || isLimitReached}
                                    className={`absolute right-2 top-2 bottom-2 px-3 rounded-xl transition-all disabled:opacity-50 ${
                                        themed(
                                            'bg-neutral-900 text-white hover:bg-blue-600 disabled:hover:bg-neutral-900',
                                            'bg-blue-600 text-white hover:bg-blue-500',
                                            'bg-blue-900/20 text-blue-400 hover:bg-blue-900/40 border border-blue-500/30',
                                            'bg-[#b58900] text-[#fdf6e3] hover:bg-[#433422]'
                                        )
                                    }`}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <p className={`text-[10px] text-center mt-4 font-bold uppercase tracking-widest transition-colors ${
                                themed('text-neutral-400', 'text-neutral-600', 'text-blue-500/40', 'text-[#433422]/20')
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
                             <div className={`p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl flex items-center gap-4 min-w-[280px] border transition-colors duration-500 ${
                                themed(
                                    'bg-neutral-900 border-white/10 text-white',
                                    'bg-[#1a1a1a] border-neutral-800 text-neutral-100',
                                    'bg-[#0a0a0a]/90 border-blue-500/20 text-blue-100',
                                    'bg-[#433422] border-[#b58900]/20 text-[#fdf6e3]'
                                )
                            }`}>
                                {/* Icon container */}
                                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
                                    <Bot size={20} className="text-white" />
                                </div>
                                
                                {/* Content */}
                                  <div className="flex flex-col pr-6">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 ${themed('text-blue-400', 'text-blue-500', 'text-blue-400', 'text-[#b58900]')}`}>AI Concierge</span>
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
                                 <div className={`absolute -bottom-2 right-6 w-4 h-4 border-r border-b rotate-45 transition-colors duration-500 ${
                                    themed(
                                        'bg-neutral-900 border-white/10',
                                        'bg-[#1a1a1a] border-neutral-800',
                                        'bg-[#0a0a0a]/90 border-blue-500/20',
                                        'bg-[#433422] border-[#b58900]/20'
                                    )
                                }`} />
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
                className={`w-16 h-16 rounded-full shadow-2xl items-center justify-center transition-all duration-500 ${
                    isOpen 
                        ? 'hidden sm:flex ' + themed('bg-neutral-900 text-white rotate-90', 'bg-neutral-100 text-neutral-900 rotate-90', 'bg-[#050505] text-blue-400 border border-blue-500/50 rotate-90') 
                        : 'flex ' + themed('bg-blue-600 text-white', 'bg-blue-500 text-white', 'bg-blue-600 text-white shadow-blue-500/40')
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
