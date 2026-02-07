import { useState, useEffect } from 'react';

export const useFPS = (enabled = true) => {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let requestId;

    const tick = () => {
      frameCount++;
      const now = performance.now();
      if (now >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      requestId = requestAnimationFrame(tick);
    };

    requestId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(requestId);
  }, [enabled]);

  return fps;
};
