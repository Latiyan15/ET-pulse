import React, { useEffect, useState } from 'react';
import './SplashTransition.css';

const SplashTransition = ({ onComplete }) => {
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    // Unmount after animation sequence completes (2.3 seconds)
    const timer = setTimeout(() => {
      setComplete(true);
      if (onComplete) onComplete();
    }, 2300);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (complete) return null;

  return (
    <div className="splash-overlay animate-overlay-fade">
      <div className="splash-content animate-move-nav">
        <div className="splash-logo-wrapper animate-spring-bounce">
          <div className="ob-logo-circle splash-logo-circle animate-pulse-glow">ET</div>
          <span className="ob-logo-text splash-logo-text">Pulse</span>
        </div>
        <div className="splash-shadow animate-shadow-react"></div>
      </div>
    </div>
  );
};

export default SplashTransition;
