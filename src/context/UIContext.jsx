import React, { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [blueprintMode, setBlueprintMode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false); // Default to off for UX

  // Sound effects helper
  const playSound = (type) => {
    if (!soundEnabled) return;

    // Use Web Audio API for clean, high-end sounds without external assets
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
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
      osc.frequency.setValueAtTime(blueprintMode ? 200 : 400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(blueprintMode ? 400 : 200, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  };

  useEffect(() => {
    if (blueprintMode) {
      document.documentElement.classList.add('blueprint-mode');
    } else {
      document.documentElement.classList.remove('blueprint-mode');
    }
  }, [blueprintMode]);

  const toggleBlueprint = () => {
    setBlueprintMode(!blueprintMode);
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

  return (
    <UIContext.Provider value={{ 
      blueprintMode, 
      toggleBlueprint, 
      soundEnabled, 
      toggleSound, 
      playSound,
      isChatOpen,
      openChat,
      closeChat,
      toggleChat
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
