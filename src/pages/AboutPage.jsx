import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import serjoDark from "../assets/icons/serjo_dark.png";

import meDetail from "../assets/images/ds0lq.webp";

const AboutPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

    return (
        <div ref={containerRef} className="bg-white text-neutral-900 selection:bg-blue-600 selection:text-white overflow-x-hidden min-h-screen">
            {/* Professional Navigation removed as FloatingNavbar is global */}


            {/* Stage 1: Hero */}
            <section className="min-h-screen w-full flex items-center justify-center relative px-8 pt-20">
                <div className="absolute inset-0 bg-mesh opacity-40"></div>
                
                <div className="relative z-10 max-w-7xl mx-auto w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-end">
                       <div className="lg:col-span-8">
                          <motion.div
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 1 }}
                          >
                              <span className="text-xs font-bold tracking-[0.3em] uppercase text-blue-600 block mb-8">About Studio</span>
                              <h1 className="text-[10vw] leading-[0.9] font-black tracking-tight uppercase mb-4">
                                  Human <br />
                                  <span className="text-neutral-200">Perspective.</span>
                              </h1>
                          </motion.div>
                       </div>
                       <div className="lg:col-span-4 pb-12">
                          <p className="text-xl text-neutral-500 font-medium leading-relaxed italic border-l-4 border-blue-600 pl-8">
                             "We believe that the most powerful digital experiences are built on a foundation of empathy and precision."
                          </p>
                       </div>
                    </div>
                </div>
            </section>

            {/* Stage 2: Details */}
            <section className="max-w-7xl mx-auto px-8 py-32 grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
                <div className="lg:col-span-7">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 leading-tight mb-20"
                    >
                        Architecting the future through <span className="font-bold underline decoration-blue-600 underline-offset-8">technical rigor</span> and aesthetic excellence.
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="space-y-6">
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Phase 01</span>
                            <h4 className="text-3xl font-bold text-neutral-900">Research.</h4>
                            <p className="text-lg text-neutral-500 font-medium leading-relaxed">
                                We start by understanding the "why". Design without purpose is just decoration.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Phase 02</span>
                            <h4 className="text-3xl font-bold text-neutral-900">Execution.</h4>
                            <p className="text-lg text-neutral-500 font-medium leading-relaxed">
                                We build with the latest tech stack to ensure performance, security, and scalability.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block lg:col-span-5 sticky top-48">
                    <motion.div 
                        style={{ y }}
                        className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-500/10 border border-neutral-100"
                    >
                        <img 
                            src={meDetail} 
                            alt="Visual Concept"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Outro CTA */}
            <section className="py-48 px-8 text-center bg-neutral-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-5xl md:text-7xl font-bold text-neutral-900 tracking-tight mb-16">
                        Have a Vision?
                    </h2>
                    <button 
                        onClick={() => navigate('/#section-contact')}
                        className="px-16 py-8 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 flex items-center gap-4 mx-auto"
                    >
                        Start Your Inquiry
                        <ArrowRight size={20} />
                    </button>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
