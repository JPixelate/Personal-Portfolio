import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('themeMode') || 'light';
    }
    return 'light';
  });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [shouldShowDeployGuide, setShouldShowDeployGuide] = useState(false);
  const [viewedProjects, setViewedProjects] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('viewedProjects');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const audioCtxRef = useRef(null);

  const trackProjectView = (project) => {
    setViewedProjects(prev => {
      // Don't duplicate and keep only the last 10
      const filtered = prev.filter(p => p.id !== project.id);
      const updated = [project, ...filtered].slice(0, 10);
      localStorage.setItem('viewedProjects', JSON.stringify(updated));
      return updated;
    });
  };

  // Derived booleans
  const blueprintMode = themeMode === 'blueprint';
  const darkMode = themeMode === 'dark';
  const readingMode = themeMode === 'reading';
  const isDark = themeMode === 'dark' || themeMode === 'blueprint';

  // Helper to pick value by current theme
  const themed = useCallback((light, dark, blueprint, reading) => {
    if (themeMode === 'blueprint') return blueprint || dark || light;
    if (themeMode === 'dark') return dark || light;
    if (themeMode === 'reading') return reading || light;
    return light;
  }, [themeMode]);

  // Shared AudioContext
  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtxRef.current = new AC();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Sound effects helper
  const playSound = (type) => {
    if (!soundEnabled) return;

    const ctx = getAudioCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'toggle') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isDark ? 200 : 400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(isDark ? 400 : 200, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  };

  useEffect(() => {
    document.documentElement.classList.remove('blueprint-mode', 'dark-mode', 'dark', 'reading-mode');
    if (themeMode === 'blueprint') {
      document.documentElement.classList.add('blueprint-mode', 'dark');
    } else if (themeMode === 'dark') {
      document.documentElement.classList.add('dark-mode', 'dark');
    } else if (themeMode === 'reading') {
      document.documentElement.classList.add('reading-mode');
    }
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  // Cycle: light → blueprint → dark → light
  const cycleTheme = () => {
    setThemeMode(prev => {
      if (prev === 'light') return 'blueprint';
      if (prev === 'blueprint') return 'dark';
      if (prev === 'dark') return 'reading';
      return 'light';
    });
    playSound('toggle');
  };

  const setTheme = (mode) => {
    setThemeMode(mode);
    playSound('toggle');
  };

  // Keep toggleBlueprint for backward compat (SystemConcierge AI command)
  const toggleBlueprint = () => {
    setThemeMode(prev => prev === 'blueprint' ? 'light' : 'blueprint');
    playSound('toggle');
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const openChat = () => {
    setIsChatOpen(true);
    playSound('click');
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
    playSound('click');
  };

  const triggerDeployGuide = () => {
    setShouldShowDeployGuide(true);
  };

  const resetDeployGuide = () => {
    setShouldShowDeployGuide(false);
  };

  return (
    <UIContext.Provider value={{
      themeMode,
      blueprintMode,
      darkMode,
      readingMode,
      isDark,
      themed,
      cycleTheme,
      setTheme,
      toggleBlueprint,
      soundEnabled,
      toggleSound,
      playSound,
      isChatOpen,
      openChat,
      closeChat,
      toggleChat,
      viewedProjects,
      trackProjectView,
      shouldShowDeployGuide,
      triggerDeployGuide,
      resetDeployGuide
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within a UIProvider');
  return context;
};
