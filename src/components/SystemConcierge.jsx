import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Bot, Send, User, X, Mail, Phone, Linkedin, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateAIResponse } from '../utils/aiKnowledge';
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
    const CHATS_PER_DAY = 10;
    const [messageCount, setMessageCount] = useState(0);
    const [isLimitReached, setIsLimitReached] = useState(false);

    useEffect(() => {
        const checkLimit = () => {
            const today = new Date().toISOString().split('T')[0];
            const usage = JSON.parse(localStorage.getItem('ai_chat_usage') || '{}');
            
            if (usage.date !== today) {
                // New day, reset counter
                localStorage.setItem('ai_chat_usage', JSON.stringify({ date: today, count: 0 }));
                setMessageCount(0);
                setIsLimitReached(false);
            } else {
                setMessageCount(usage.count);
                if (usage.count >= CHATS_PER_DAY) {
                    setIsLimitReached(true);
                }
            }
        };

        checkLimit();
    }, [isOpen]);

    const incrementUsage = () => {
        const today = new Date().toISOString().split('T')[0];
        const usage = JSON.parse(localStorage.getItem('ai_chat_usage') || '{}');
        const newCount = (usage.date === today ? usage.count : 0) + 1;
        
        localStorage.setItem('ai_chat_usage', JSON.stringify({ date: today, count: newCount }));
        setMessageCount(newCount);
        if (newCount >= CHATS_PER_DAY) {
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
        switch (cmd) {
            case 'open-project':
                window.dispatchEvent(new CustomEvent('portfolio:open-project', { detail: param }));
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

    const handleSendMessage = async (text) => {
        if (isTyping || isLimitReached) return;
        
        const now = Date.now();
        if (now - lastSentTime.current < 1500) return; // 1.5s cooldown
        lastSentTime.current = now;

        const messageText = text || inputValue;
        if (!messageText.trim()) return;

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
                        className="fixed inset-x-4 top-4 bottom-24 sm:absolute sm:inset-auto sm:top-auto sm:bottom-20 sm:right-0 w-auto sm:w-[400px] sm:h-[600px] bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 bg-neutral-900 text-white flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold tracking-tight">AI Assistant</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">System Online</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 p-6 overflow-y-auto bg-neutral-50/50 space-y-6">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                        msg.sender === 'bot' ? 'bg-neutral-900 text-white' : 'bg-blue-600 text-white'
                                    }`}>
                                        {msg.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
                                    </div>
                                    <div className={`p-4 rounded-2xl shadow-sm max-w-[80%] ${
                                        msg.sender === 'bot'
                                            ? 'bg-white rounded-tl-none border border-neutral-100'
                                            : 'bg-blue-600 text-white rounded-tr-none'
                                    }`}>
                                        {msg.sender === 'bot' ? (
                                            <div className="text-sm leading-relaxed font-medium text-neutral-800 prose prose-sm prose-neutral max-w-none prose-headings:text-neutral-900 prose-headings:font-bold prose-headings:mt-3 prose-headings:mb-2 prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-strong:text-neutral-900">
                                                <ReactMarkdown 
                                                    components={{
                                                        a: MarkdownLink
                                                    }}
                                                >
                                                    {msg.text}
                                                </ReactMarkdown>

                                                {msg.showTech && (
                                                    <div className="mt-4 pt-4 border-t border-neutral-100 grid grid-cols-4 gap-3">
                                                        {['React', 'Next.js', 'Node.js', 'PHP', 'Tailwind', 'OpenAI', 'n8n', 'Python'].map(tech => (
                                                            <div key={tech} className="flex flex-col items-center gap-1 group/tech">
                                                                <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center group-hover/tech:bg-blue-50 transition-colors">
                                                                    <span className="text-[10px] font-black">{tech[0]}</span>
                                                                </div>
                                                                <span className="text-[8px] font-bold uppercase tracking-tighter opacity-40">{tech}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                        ) : (
                                            <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap text-white">
                                                {msg.text}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0">
                                        <Bot size={16} />
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-neutral-100 shadow-sm">
                                        <div className="flex gap-1">
                                            <motion.div 
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                                className="w-2 h-2 bg-neutral-400 rounded-full"
                                            />
                                            <motion.div 
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                                className="w-2 h-2 bg-neutral-400 rounded-full"
                                            />
                                            <motion.div 
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                                className="w-2 h-2 bg-neutral-400 rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isLimitReached && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-red-50 border border-red-100 rounded-2xl space-y-3"
                                >
                                    <p className="text-xs font-bold text-red-600 leading-relaxed">
                                        You've reached your daily chat limit (10/10). Chat will resume tomorrow.
                                    </p>
                                    <div className="pt-3 border-t border-red-100 flex flex-col gap-2">
                                        <p className="text-[10px] uppercase tracking-widest font-black text-red-400">Direct Contact Information:</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <a href="mailto:jonaldpenpillo@gmail.com" className="flex items-center gap-2 text-[10px] font-bold text-neutral-600 hover:text-blue-600 transition-colors bg-white p-2 rounded-lg border border-neutral-100">
                                                <Mail size={12} /> Email
                                            </a>
                                            <a href="https://wa.me/639107876246" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-bold text-neutral-600 hover:text-blue-600 transition-colors bg-white p-2 rounded-lg border border-neutral-100">
                                                <Phone size={12} /> WhatsApp
                                            </a>
                                            <a href="https://www.linkedin.com/in/jonald-penpillo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-bold text-neutral-600 hover:text-blue-600 transition-colors bg-white p-2 rounded-lg border border-neutral-100">
                                                <Linkedin size={12} /> LinkedIn
                                            </a>
                                            <a href="viber://contact?number=%2B639927133582" className="flex items-center gap-2 text-[10px] font-bold text-neutral-600 hover:text-blue-600 transition-colors bg-white p-2 rounded-lg border border-neutral-100">
                                                <MessageCircle size={12} /> Viber
                                            </a>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-red-300 font-bold uppercase italic tracking-tighter">
                                        * Note: Interaction limit is reset every 24 hours. Usage is monitored by system architecture.
                                    </p>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Replies */}
                        <AnimatePresence>
                            {quickReplies.length > 0 && (
                                <div className="px-6 py-3 bg-white border-t border-neutral-50 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
                                    {quickReplies.map((reply) => (
                                        <motion.button
                                            key={reply}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            onClick={() => handleSendMessage(reply)}
                                            className="px-4 py-2 bg-neutral-50 hover:bg-blue-50 text-neutral-600 hover:text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-neutral-100 hover:border-blue-100 transition-all whitespace-nowrap"
                                        >
                                            {reply}
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>

                        {/* Input */}
                        <form 
                           onSubmit={(e) => {
                               e.preventDefault();
                               handleSendMessage();
                           }} 
                           className="p-6 bg-white border-t border-neutral-100 shrink-0"
                        >
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    disabled={isTyping || isLimitReached}
                                    placeholder={
                                        isLimitReached 
                                            ? "Daily limit reached..." 
                                            : isTyping 
                                                ? "AI is thinking..." 
                                                : "Ask about Jonald's experience..."
                                    }
                                    className="w-full pl-6 pr-14 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:border-blue-600 transition-all font-medium disabled:opacity-70"
                                />
                                <button 
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping || isLimitReached}
                                    className="absolute right-2 top-2 bottom-2 px-4 bg-neutral-900 text-white rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50 disabled:hover:bg-neutral-900"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <p className="text-[10px] text-neutral-400 text-center mt-4 font-bold uppercase tracking-widest">
                                Powered by Jonald's AI Architecture
                            </p>
                        </form>
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
                    isOpen ? 'bg-neutral-900 text-white rotate-90' : 'bg-blue-600 text-white'
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
