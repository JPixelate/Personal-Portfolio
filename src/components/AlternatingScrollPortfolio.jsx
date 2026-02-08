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
    <main id="main-content" className="bg-white dark:bg-[#0a0a0a] relative transition-colors duration-700">
      <SEO
        title="Jonald Penpillo | Full-Stack Developer & AI Solutions Architect"
        description="Jonald Penpillo is a Full-Stack Engineer specializing in high-performance digital architecture, autonomous AI automation, and scalable enterprise systems. Explore his portfolio of React, PHP, and n8n projects."
        keywords="Jonald Penpillo, Full-Stack Developer, AI Architect, Philippines, React Developer, n8n Automation, Enterprise Software, Web Architecture"
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
