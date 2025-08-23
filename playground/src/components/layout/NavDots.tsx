'use client';
import React, { useState, useEffect, useRef } from 'react';

interface NavDotsProps {
  sections: readonly string[];
  activeIndex: number;
  onGoTo: (id: string) => void;
}

export default function NavDots({ sections, activeIndex, onGoTo }: NavDotsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const DISPLAY_DURATION = 2000;

  useEffect(() => {
    if (activeIndex === 0) {
      setIsVisible(false);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      return;
    }

    setIsVisible(true);

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, DISPLAY_DURATION);

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [activeIndex]);

  if (activeIndex === 0) {
    return null;
  }

  return (
    <nav 
      className={`absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {sections.map((sectionId, i) => (
        <button
          key={sectionId}
          aria-label={`Go to ${sectionId}`}
          onClick={() => onGoTo(sectionId)}
          className={`h-3 w-3 rounded-full border border-white/40 transition-transform ${
            i === activeIndex ? 'scale-125 bg-white' : 'bg-white/20 hover:bg-white/40'
          }`}
        />
      ))}
    </nav>
  );
}