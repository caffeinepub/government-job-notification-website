import React, { useEffect, useRef, useState } from 'react';

interface VerticalTickerListProps {
  children: React.ReactNode;
  speed?: number; // pixels per second
}

export function VerticalTickerList({ children, speed = 20 }: VerticalTickerListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // If reduced motion is preferred, render static list
  if (prefersReducedMotion) {
    return (
      <div className="max-h-[400px] overflow-y-auto">
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden max-h-[400px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div
        className={`ticker-content ${isPaused ? 'ticker-paused' : ''}`}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {/* Original content */}
        <div>{children}</div>
        {/* Duplicate for seamless loop */}
        <div aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
