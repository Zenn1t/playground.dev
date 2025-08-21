'use client';

import React from 'react';

interface NavDotsProps {
  sections: readonly string[];
  activeIndex: number;
  onGoTo: (id: string) => void;
}

export default function NavDots({ sections, activeIndex, onGoTo }: NavDotsProps) {
  return (
    <nav className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
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