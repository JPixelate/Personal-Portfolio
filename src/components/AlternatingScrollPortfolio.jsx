import React, { useEffect } from "react";
import Hero from "./Hero.jsx";
import Manifesto from "./Manifesto.jsx";
import Contact from "./Contact.jsx";
import WorkProcess from "./WorkProcess.jsx";
import ProjectGrid from "./ProjectGrid.jsx";
import TechStack from "./TechStack.jsx";
import Experience from "./Experience.jsx";
import SEO from "./SEO.jsx";

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
      <WorkProcess />
      <ProjectGrid />
      <Manifesto />
      <Experience />
      <TechStack />
      <Contact />
    </main>
  );
};

export default AlternatingScrollPortfolio;
