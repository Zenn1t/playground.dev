'use client';

import React from 'react';

interface ProjectsSectionProps {
  activeIndex: number;
}

export default function ProjectsSection({ activeIndex }: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      className={`h-screen w-screen relative px-4 md:px-8 py-16 md:py-24 flex items-center justify-center transition-all duration-700 ${
        activeIndex >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-200">Projects</h2>
        <p className="text-gray-500">Coming soon...</p>
      </div>
    </section>
  );
}