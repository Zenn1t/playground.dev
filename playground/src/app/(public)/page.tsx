'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useStepScroll } from '@/hooks/useStepScroll';
import { SECTION_IDS, TRANSITION_MS } from '@/config/sections';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NavDots from '@/components/layout/NavDots';

import HomeSection from '@/components/sections/home';
import AboutSection from '@/components/sections/about';
import RoadmapSection from '@/components/sections/roadmap';
import ProjectsSection from '@/components/sections/projects';
import ContactSection from '@/components/sections/contact';

export default function HomePage() {
  const { 
    activeIndex, 
    isHeaderVisible, 
    isFooterVisible, 
    goToId, 
    containerRef 
  } = useStepScroll(SECTION_IDS);
  
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const translateStyle: React.CSSProperties = useMemo(() => ({
    transform: `translate3d(0, -${activeIndex * 100}vh, 0)`,
    transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
    willChange: 'transform',
  }), [activeIndex]);

  return (
    <>
      <Header isVisible={isHeaderVisible} onGoTo={goToId} />

      <main
        ref={containerRef}
        className="fixed inset-0 h-screen w-screen overflow-hidden outline-none focus:outline-none select-none"
        style={{
          overscrollBehaviorY: 'none',
          touchAction: 'none',
        }}
      >
        <div className="w-full" style={translateStyle}>
          <HomeSection isLoaded={isLoaded} activeIndex={activeIndex} />
          <AboutSection activeIndex={activeIndex} />
          {/* <RoadmapSection activeIndex={activeIndex} />
          <ProjectsSection activeIndex={activeIndex} /> */}
          <ContactSection activeIndex={activeIndex} />
        </div>
      </main>

      <NavDots sections={SECTION_IDS} activeIndex={activeIndex} onGoTo={goToId} />
      <Footer isVisible={isFooterVisible} transitionMs={TRANSITION_MS} />
    </>
  );
}