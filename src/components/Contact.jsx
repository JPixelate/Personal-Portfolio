import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Mail, Instagram, Linkedin, MessageCircle, Phone } from "lucide-react";
import quillLogo from "../assets/images/quill_logo.png";
import { useUI } from "../context/UIContext";

const Contact = () => {
  const { blueprintMode, playSound } = useUI();
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
    <footer id="section-contact" className={`pt-24 md:pt-32 pb-12 px-4 md:px-8 relative overflow-hidden border-t transition-colors duration-700 ${blueprintMode ? 'bg-[#050505] border-blue-900/40' : 'bg-neutral-50 border-neutral-100'}`}>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Structured Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 pb-24">
          
          <div className="md:col-span-4 lg:col-span-5">
             <div className="flex flex-col gap-8">
                <Link 
                  onMouseEnter={() => playSound('hover')}
                  onClick={() => playSound('click')}
                  to="/" 
                  className={`text-4xl font-logo transition-all duration-300 flex items-center group/logo inline-flex ${blueprintMode ? 'text-blue-500 hover:text-blue-300' : 'text-neutral-600 hover:text-blue-600'}`}
                >
                  <motion.img 
                    src={quillLogo} 
                    alt="Logo" 
                    className={`w-14 h-14 -mr-1 object-contain transition-all duration-500 group-hover/logo:rotate-12 ${blueprintMode ? 'invert brightness-50 sepia-[1] hue-rotate-[180deg] saturate-[10]' : ''}`}
                    whileHover={{ scale: 1.1 }}
                  />
                  <span className="mt-2 upright-script">penpillo.</span>
                  <span className="font-fancy text-5xl ml-1 upright-script">j</span>
                </Link>


                <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-xl transition-colors duration-700 flex items-center justify-center ${blueprintMode ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20' : 'bg-blue-100 text-blue-600'}`}>
                      <Globe size={18} />
                   </div>
                   <div className="flex flex-col">
                      <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${blueprintMode ? 'text-blue-400' : 'text-neutral-400'}`}>General Santos City</span>
                      <span className={`text-sm font-bold tabular-nums transition-colors ${blueprintMode ? 'text-blue-500' : 'text-neutral-900'}`}>{time} GMT+8</span>
                   </div>
                </div>
                <p className={`text-xl font-medium leading-relaxed max-w-sm transition-colors duration-700 ${blueprintMode ? 'text-blue-400/60' : 'text-neutral-500'}`}>
                   Engineering high-performance web systems and AI-powered digital architecture from the heart of the Philippines.
                </p>
             </div>
          </div>

          <div className="md:col-span-3 lg:col-span-2 space-y-8">
             <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${blueprintMode ? 'text-blue-900' : 'text-neutral-200'}`}>Sitemap</h4>
             <ul className="space-y-4">
                <FooterLink to="/#section-hero" label="Overview" blueprintMode={blueprintMode} playSound={playSound} />
                <FooterLink to="/#section-services" label="Expertise" blueprintMode={blueprintMode} playSound={playSound} />
                <FooterLink to="/#section-projects" label="Portfolio" blueprintMode={blueprintMode} playSound={playSound} />
                <FooterLink to="/#section-about" label="Manifesto" blueprintMode={blueprintMode} playSound={playSound} />
                <FooterLink to="/#section-experience" label="Journey" blueprintMode={blueprintMode} playSound={playSound} />
                <FooterLink to="/#section-tech" label="Stack" blueprintMode={blueprintMode} playSound={playSound} />
             </ul>
          </div>

          <div className="md:col-span-3 lg:col-span-2 space-y-8">
             <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${blueprintMode ? 'text-blue-900' : 'text-neutral-200'}`}>Connect</h4>
             <ul className="space-y-4">
                <SocialLink icon={<Instagram size={16}/>} label="Instagram" href="https://www.instagram.com/h4kuna_11/" blueprintMode={blueprintMode} playSound={playSound} />
                <SocialLink icon={<Linkedin size={16}/>} label="LinkedIn" href="https://www.linkedin.com/in/jonald-penpillo" blueprintMode={blueprintMode} playSound={playSound} />
                <SocialLink icon={<Mail size={16}/>} label="Email" href="mailto:jonaldpenpillo@gmail.com" blueprintMode={blueprintMode} playSound={playSound} />
                <SocialLink icon={<MessageCircle size={16}/>} label="Viber" href="viber://contact?number=%2B639927133582" blueprintMode={blueprintMode} playSound={playSound} />
                <SocialLink icon={<Phone size={16}/>} label="WhatsApp" href="https://wa.me/639107876246" blueprintMode={blueprintMode} playSound={playSound} />
             </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-3 md:text-right flex flex-col justify-between items-start md:items-end">
             <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${blueprintMode ? 'text-blue-900' : 'text-neutral-200'}`}>Availability</h4>
             <div className="flex flex-col md:items-end gap-2">
                <div className="flex items-center gap-3">
                   <span className={`w-2 h-2 rounded-full animate-pulse ${blueprintMode ? 'bg-blue-400' : 'bg-green-500'}`}></span>
                   <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${blueprintMode ? 'text-blue-500' : 'text-neutral-900'}`}>Open For Q2 2026</span>
                </div>
                <span className={`text-[10px] font-medium transition-colors ${blueprintMode ? 'text-blue-900' : 'text-neutral-400'}`}>Ref: Architecture_V2</span>
             </div>
          </div>
        </div>

        {/* Deep Bottom Bar */}
        <div className={`pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-8 transition-colors duration-700 ${blueprintMode ? 'border-blue-900/40' : 'border-neutral-200'}`}>
           <div className={`text-[10vw] md:text-[6vw] font-black uppercase tracking-tighter select-none leading-none absolute -bottom-4 right-0 pointer-events-none transition-colors duration-700 ${blueprintMode ? 'text-blue-500/[0.05]' : 'text-neutral-900/[0.02]'}`}>
              Modern Excellence
           </div>
           
           <div className={`flex gap-10 text-[10px] font-bold uppercase tracking-widest order-2 md:order-1 transition-colors ${blueprintMode ? 'text-blue-900' : 'text-neutral-300'}`}>
              <Link onMouseEnter={() => playSound('hover')} onClick={() => playSound('click')} to="/#" className="hover:text-blue-600 transition-colors cursor-pointer">Privacy</Link>
              <Link onMouseEnter={() => playSound('hover')} onClick={() => playSound('click')} to="/#" className="hover:text-blue-600 transition-colors cursor-pointer">Terms</Link>
              <Link onMouseEnter={() => playSound('hover')} onClick={() => playSound('click')} to="/#" className="hover:text-blue-600 transition-colors cursor-pointer">Cookies</Link>
           </div>
           
           <div className="flex flex-col items-center md:items-start gap-1 order-1 md:order-2">
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${blueprintMode ? 'text-blue-900' : 'text-neutral-400'}`}>
                 &copy; {new Date().getFullYear()} — Jonald Penpillo. Built with Logic.
              </p>
           </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, label, blueprintMode, playSound }) => (
  <li>
    <Link 
      onMouseEnter={() => playSound('hover')}
      onClick={() => playSound('click')}
      to={to} 
      className={`group flex items-center gap-2 text-sm font-bold transition-all ${blueprintMode ? 'text-blue-500/60 hover:text-blue-300' : 'text-neutral-500 hover:text-neutral-900'}`}
    >
       <span className={`w-0 h-px transition-all duration-300 group-hover:w-4 ${blueprintMode ? 'bg-blue-400' : 'bg-blue-600'}`}></span>
       {label}
    </Link>
  </li>
);

const SocialLink = ({ icon, label, href, blueprintMode, playSound }) => (
  <li>
    <a 
      onMouseEnter={() => playSound('hover')}
      onClick={() => playSound('click')}
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`group flex items-center gap-3 text-sm font-bold transition-all font-inter ${blueprintMode ? 'text-blue-500/60 hover:text-blue-300' : 'text-neutral-500 hover:text-neutral-900'}`}
    >
       <span className={`transition-colors ${blueprintMode ? 'text-blue-900 group-hover:text-blue-400' : 'text-neutral-300 group-hover:text-blue-600'}`}>{icon}</span>
       {label}
    </a>
  </li>
);

export default Contact;
