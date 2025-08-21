'use client';

import React from 'react';
import ProductRoadmapFlow from './ProductRoadmapFlow';

interface RoadmapSectionProps {
  activeIndex: number;
}

export default function RoadmapSection({ activeIndex }: RoadmapSectionProps) {
  return (
    <section
      id="roadmap"
      className={`h-screen w-screen relative px-4 md:px-8 py-16 md:py-24 flex items-center transition-all duration-700 ${
        activeIndex >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="max-w-6xl mx-auto w-full">
        <ProductRoadmapFlow />
      </div>
    </section>
  );
}