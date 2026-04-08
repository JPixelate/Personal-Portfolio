import React, { useEffect, Suspense, lazy } from "react";
import Hero from "./Hero.jsx";
import SEO from "./SEO.jsx";

const Manifesto = lazy(() => import("./Manifesto.jsx"));
const Contact = lazy(() => import("./Contact.jsx"));
const WorkProcess = lazy(() => import("./WorkProcess.jsx"));
const ProjectGrid = lazy(() => import("./ProjectGrid.jsx"));
const TechStack = lazy(() => import("./TechStack.jsx"));
const Experience = lazy(() => import("./Experience.jsx"));

const AlternatingScrollPortfolio = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main id="main-content" className="bg-white/75 dark:bg-[#0a0a0a]/75 relative transition-colors duration-700 backdrop-blur-[2px]">
      <SEO
        title="Portfolio Overview | Jonald Penpillo"
        description="Explore the professional work of Jonald Penpillo, a Senior Full-Stack Developer and AI Solutions Architect. Featuring projects in React, PHP, and autonomous AI workflows."
        keywords="Jonald Penpillo, Full-Stack Developer, AI Architect, Philippines, React Developer, n8n Automation, Enterprise Software, Web Architecture, penpillo.j"
      />
      
      <Hero />
      <Suspense fallback={<div className="h-96" />}>
        <WorkProcess />
      </Suspense>
      <Suspense fallback={<div className="h-96" />}>
        <ProjectGrid />
      </Suspense>
      <Suspense fallback={<div className="h-96" />}>
        <Manifesto />
      </Suspense>
      <Suspense fallback={<div className="h-96" />}>
        <Experience />
      </Suspense>
      <Suspense fallback={<div className="h-96" />}>
        <TechStack />
      </Suspense>
      <Suspense fallback={<div className="h-96" />}>
        <Contact />
      </Suspense>
    </main>
  );
};

export default AlternatingScrollPortfolio;
