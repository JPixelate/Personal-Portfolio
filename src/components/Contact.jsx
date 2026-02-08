import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Mail, Instagram, Linkedin, MessageCircle, Phone } from "lucide-react";
import quillLogo from "../assets/images/quill_logo.webp";
import { useUI } from "../context/UIContext";

const Contact = () => {
  const { themed, isDark, blueprintMode, darkMode, themeMode, playSound } = useUI();
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      };
      setTime(new Intl.DateTimeFormat("en-US", options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer id="section-contact" className={`pt-24 md:pt-32 pb-12 px-4 md:px-8 relative overflow-hidden border-t transition-colors duration-700 ${themed('bg-neutral-50 border-neutral-100', 'bg-[#0a0a0a] border-neutral-800', 'bg-[#050505] border-blue-900/40', 'bg-[#eee8d5] border-[#433422]/10')}`}>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Structured Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 pb-24">

          <div className="md:col-span-4 lg:col-span-5">
             <div className="flex flex-col gap-8">
                <Link
                  onMouseEnter={() => playSound('hover')}
                  onClick={() => playSound('click')}
                  to="/"
                  className="inline-flex items-center gap-3 group/logo"
                >
                  <motion.img
                    src={quillLogo}
                    alt="Quill"
                    className="h-12 object-contain transition-all duration-500"
                    style={{ 
                      filter: blueprintMode 
                        ? 'invert(71%) sepia(87%) saturate(1475%) hue-rotate(185deg) brightness(101%) contrast(101%)' 
                        : darkMode 
                          ? 'invert(1) brightness(2)' 
                          : themeMode === 'reading' 
                            ? 'sepia(0.5) brightness(0.9)' 
                            : 'none'
                    }}
                    whileHover={{ scale: 1.05 }}
                  />
                  <span className={`-ml-2 font-logo text-4xl tracking-wide transition-colors duration-300 ${themed('text-neutral-600 group-hover/logo:text-blue-600', 'text-neutral-200 group-hover/logo:text-white', 'text-blue-400 group-hover/logo:text-blue-300', 'text-[#433422] group-hover/logo:text-[#856404]')}`}>
                    penpillo.j
                  </span>
                </Link>


                <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-2xl transition-colors duration-700 flex items-center justify-center ${themed('bg-blue-100 text-blue-600', 'bg-neutral-800 text-neutral-300 border border-neutral-700', 'bg-blue-600/10 text-blue-500 border border-blue-500/20', 'bg-[#856404]/10 text-[#856404] border border-[#856404]/20')}`}>
                      <Globe size={18} />
                   </div>
                   <div className="flex flex-col">
                      <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${themed('text-neutral-400', 'text-blue-500', 'text-blue-400', 'text-[#856404]')}`}>General Santos City</span>
                      <span className={`text-sm font-bold tabular-nums transition-colors ${themed('text-neutral-900', 'text-neutral-200', 'text-blue-500', 'text-[#433422]')}`}>{time} GMT+8</span>
                   </div>
                </div>
                <p className={`text-xl font-medium leading-relaxed max-w-sm transition-colors duration-700 ${themed('text-neutral-500', 'text-neutral-400', 'text-blue-400/60', 'text-[#433422]/60')}`}>
                   Engineering high-performance web systems and AI-powered digital architecture from the heart of the Philippines.
                </p>
             </div>
          </div>

          <div className="md:col-span-3 lg:col-span-2 space-y-8">
             <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${themed('text-neutral-400', 'text-blue-500', 'text-blue-900', 'text-[#856404]')}`}>Sitemap</h4>
             <ul className="space-y-4">
                <FooterLink to="/#section-hero" label="Overview" />
                <FooterLink to="/#section-process" label="Process" />
                <FooterLink to="/#section-projects" label="Portfolio" />
                <FooterLink to="/#section-about" label="Manifesto" />
                <FooterLink to="/#section-experience" label="Journey" />
                <FooterLink to="/#section-tech" label="Stack" />
             </ul>
          </div>

          <div className="md:col-span-3 lg:col-span-2 space-y-8">
             <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${themed('text-neutral-400', 'text-blue-500', 'text-blue-900', 'text-[#856404]')}`}>Connect</h4>
             <ul className="space-y-4">
                <SocialLink icon={<Instagram size={16}/>} label="Instagram" href="https://www.instagram.com/h4kuna_11/" />
                <SocialLink icon={<Linkedin size={16}/>} label="LinkedIn" href="https://www.linkedin.com/in/jonald-penpillo" />
                <SocialLink icon={<Mail size={16}/>} label="Email" href="mailto:jonaldpenpillo@gmail.com" />
                <SocialLink icon={<MessageCircle size={16}/>} label="Viber" href="viber://contact?number=%2B639927133582" />
                <SocialLink icon={<Phone size={16}/>} label="WhatsApp" href="https://wa.me/639107876246" />
             </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-3 md:text-right flex flex-col justify-between items-start md:items-end">
             <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${themed('text-neutral-400', 'text-blue-500', 'text-blue-900', 'text-[#856404]')}`}>Availability</h4>
             <div className="flex flex-col md:items-end gap-2">
                <div className="flex items-center gap-3">
                   <span className={`w-2 h-2 rounded-full animate-pulse ${themed('bg-green-500', 'bg-green-500', 'bg-blue-400', 'bg-[#856404]')}`}></span>
                   <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${themed('text-neutral-900', 'text-neutral-200', 'text-blue-500', 'text-[#433422]')}`}>Open For Q2 2026</span>
                </div>
                <span className={`text-[10px] font-medium transition-colors ${themed('text-neutral-400', 'text-neutral-500', 'text-blue-900', 'text-[#433422]/30')}`}>Ref: Architecture_V2</span>
             </div>
          </div>
        </div>

        {/* Deep Bottom Bar */}
        <div className={`pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-8 transition-colors duration-700 ${themed('border-neutral-200', 'border-neutral-800', 'border-blue-900/40', 'border-[#433422]/10')}`}>
           <div className={`text-[10vw] md:text-[6vw] font-black uppercase tracking-tighter select-none leading-none absolute -bottom-4 right-0 pointer-events-none transition-colors duration-700 ${themed('text-neutral-900/[0.02]', 'text-neutral-200/[0.02]', 'text-blue-500/[0.05]', 'text-[#433422]/[0.05]')}`}>
              Modern Excellence
           </div>

           <div className={`flex gap-10 text-[10px] font-bold uppercase tracking-widest order-2 md:order-1 transition-colors ${themed('text-neutral-300', 'text-neutral-600', 'text-blue-900', 'text-[#433422]/30')}`}>
              <Link onMouseEnter={() => playSound('hover')} onClick={() => playSound('click')} to="/#" className="hover:text-blue-600 transition-colors cursor-pointer">Privacy</Link>
              <Link onMouseEnter={() => playSound('hover')} onClick={() => playSound('click')} to="/#" className="hover:text-blue-600 transition-colors cursor-pointer">Terms</Link>
              <Link onMouseEnter={() => playSound('hover')} onClick={() => playSound('click')} to="/#" className="hover:text-blue-600 transition-colors cursor-pointer">Cookies</Link>
           </div>

           <div className="flex flex-col items-center md:items-start gap-1 order-1 md:order-2">
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${themed('text-neutral-400', 'text-neutral-500', 'text-blue-900', 'text-[#433422]/40')}`}>
                 &copy; {new Date().getFullYear()} — Jonald Penpillo. Built with Logic.
              </p>
           </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, label }) => {
  const { themed, playSound } = useUI();
  return (
    <li>
      <Link
        onMouseEnter={() => playSound('hover')}
        onClick={() => playSound('click')}
        to={to}
        className={`group flex items-center gap-2 text-sm font-bold transition-all ${themed('text-neutral-500 hover:text-neutral-900', 'text-neutral-400 hover:text-neutral-100', 'text-blue-500/60 hover:text-blue-300', 'text-[#433422]/60 hover:text-[#856404]')}`}
      >
         <span className={`w-0 h-px transition-all duration-300 group-hover:w-4 ${themed('bg-blue-600', 'bg-blue-500', 'bg-blue-400', 'bg-[#856404]')}`}></span>
         {label}
      </Link>
    </li>
  );
};

const SocialLink = ({ icon, label, href }) => {
  const { themed, playSound } = useUI();
  return (
    <li>
      <a
        onMouseEnter={() => playSound('hover')}
        onClick={() => playSound('click')}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group flex items-center gap-3 text-sm font-bold transition-all font-inter ${themed('text-neutral-500 hover:text-neutral-900', 'text-neutral-400 hover:text-neutral-100', 'text-blue-500/60 hover:text-blue-300', 'text-[#433422]/60 hover:text-[#856404]')}`}
      >
         <span className={`transition-colors ${themed('text-neutral-300 group-hover:text-blue-600', 'text-neutral-600 group-hover:text-neutral-300', 'text-blue-900 group-hover:text-blue-400', 'text-[#433422]/20 group-hover:text-[#856404]')}`}>{icon}</span>
         {label}
      </a>
    </li>
  );
};

export default Contact;
