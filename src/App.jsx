// src/App.jsx

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AlternatingScrollPortfolio from './components/AlternatingScrollPortfolio.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import FloatingNavbar from './components/FloatingNavbar.jsx';
import PageLoader from './components/PageLoader.jsx';
import PageTransition from './components/PageTransition.jsx';
import RouteProgressBar from './components/RouteProgressBar.jsx';
import SkipToContent from './components/SkipToContent.jsx';
import FocusIndicator from './components/FocusIndicator.jsx';
import ScreenReaderAnnouncer from './components/ScreenReaderAnnouncer.jsx';
import SystemConcierge from './components/SystemConcierge.jsx';
import ExplorerControls from './components/ExplorerControls.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import { preloadEmbeddings } from './utils/aiKnowledge.js';
const ProcessPage = React.lazy(() => import('./pages/ProcessPage.jsx'));
const DeployPage = React.lazy(() => import('./pages/DeployPage.jsx'));
const AboutPage = React.lazy(() => import('./pages/AboutPage.jsx'));
const WebArchitecturePage = React.lazy(() => import('./pages/WebArchitecturePage.jsx'));
const AIAutomationPage = React.lazy(() => import('./pages/AIAutomationPage.jsx'));
const MCPChatbotsPage = React.lazy(() => import('./pages/MCPChatbotsPage.jsx'));

const ScrollToHash = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      let retries = 0;
      const maxRetries = 10;

      const attemptScroll = () => {
        const element = document.getElementById(targetId);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        } else if (retries < maxRetries) {
          retries++;
          setTimeout(attemptScroll, 200);
        }
      };

      // Initial delay to wait for page transition
      setTimeout(attemptScroll, 600);
    }
  }, [hash, pathname]);

  return null;
};

const ScrollbarDetectionZone = () => (
  <div
    className="fixed top-0 right-0 h-screen w-[6px] cursor-pointer opacity-0 hover:opacity-100 z-[10000]"
    aria-hidden="true"
  />
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <React.Suspense fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-neutral-950">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      }>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><AlternatingScrollPortfolio /></PageTransition>} />
          <Route path="/process" element={<PageTransition><ProcessPage /></PageTransition>} />
          <Route path="/deploy" element={<PageTransition><DeployPage /></PageTransition>} />
          <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
          <Route path="/services/web-architecture" element={<PageTransition><WebArchitecturePage /></PageTransition>} />
          <Route path="/services/ai-automation" element={<PageTransition><AIAutomationPage /></PageTransition>} />
          <Route path="/services/mcp-chatbots" element={<PageTransition><MCPChatbotsPage /></PageTransition>} />
        </Routes>
      </React.Suspense>
    </AnimatePresence>
  );
};

function App() {
  // Pre-load RAG embeddings for faster AI responses
  useEffect(() => {
    preloadEmbeddings();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-neutral-950">
        {/* ACCESSIBILITY: Skip to Content */}
        <SkipToContent />

        {/* ACCESSIBILITY: Keyboard Focus Indicator */}
        <FocusIndicator />

        {/* ACCESSIBILITY: Screen Reader Announcements */}
        <ScreenReaderAnnouncer />


        <PageLoader />
        <RouteProgressBar />
        <ScrollToHash />
        <ScrollbarDetectionZone />
        <CustomCursor />
        <FloatingNavbar />
        <SystemConcierge />
        <ExplorerControls />
        <ScrollProgress />


        {/* 4. ANIMATED ROUTES */}
        <AnimatedRoutes />

      </div>
    </Router>
  );
}

export default App;