import React, { useEffect } from "react";
import Hero from "./Hero.jsx";
import Manifesto from "./Manifesto.jsx";
import Contact from "./Contact.jsx";
import Capabilities from "./Capabilities.jsx";
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
    <main id="main-content" className="bg-white relative">
      <SEO
        title="Jonald Penpillo | Portfolio"
        description="Full-Stack Web Developer engineering high-performance web systems and modern digital architecture."
      />
      
      <Hero />
      <Capabilities />
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
