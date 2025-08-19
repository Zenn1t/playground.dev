'use client';

import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import HeroSection from '@/sections/hero/HeroSection';
import NextSection from '@/sections/next-section/NextSection';


const TRANSITION_MS = 720;  
const WHEEL_THRESHOLD = 50; 
const TOUCH_THRESHOLD = 40;
const POST_COOLDOWN_MS = 120;


const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const CompactHeader = ({
  isVisible,
  onGoTo,
}: {
  isVisible: boolean;
  onGoTo?: (id: string) => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Roadmap', href: '#roadmap' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const id = href.replace('#', '');
    onGoTo?.(id);
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 pointer-events-none -translate-y-full'
      }`}
    >
      <div className="bg-black/80 backdrop-blur-md border-b border-gray-900">
        <div className="px-4 md:px-8 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-white">MNX</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-gray-400 hover:text-orange-500 transition-colors duration-200 text-sm"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="/resume.pdf"
                className="px-4 py-2 border border-orange-500/50 text-orange-500 hover:bg-orange-500/10 transition-all duration-200 text-sm rounded-sm"
              >
                Resume
              </a>
            </nav>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-900 bg-black/95 backdrop-blur-md">
            <nav className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="block px-4 py-2 text-gray-400 hover:text-orange-500 hover:bg-gray-900/50 transition-all duration-200 text-sm"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="/resume.pdf"
                className="block px-4 py-2 border border-orange-500/50 text-orange-500 hover:bg-orange-500/10 transition-all duration-200 text-sm text-center mt-4"
              >
                Download Resume
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

function useStepScroll(sectionIds: string[]) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const animatingRef = useRef(false); 
  const cooldownRef = useRef<number | null>(null);
  const wheelAccRef = useRef(0); 
  const touchStartYRef = useRef<number | null>(null);
  const touchDeltaYRef = useRef(0);

  const maxIndex = useMemo(() => sectionIds.length - 1, [sectionIds.length]);

  const goToIndex = useCallback((target: number) => {
    const next = clamp(target, 0, maxIndex);
    if (next === activeIndex || animatingRef.current) return;

    animatingRef.current = true;
    setActiveIndex(next);

    window.clearTimeout(cooldownRef.current ?? undefined);
    cooldownRef.current = window.setTimeout(() => {
      animatingRef.current = false;
    }, TRANSITION_MS + POST_COOLDOWN_MS);
  }, [activeIndex, maxIndex]);

  const goNext = useCallback(() => goToIndex(activeIndex + 1), [goToIndex, activeIndex]);
  const goPrev = useCallback(() => goToIndex(activeIndex - 1), [goToIndex, activeIndex]);

  const goToId = useCallback((id: string) => {
    const idx = sectionIds.findIndex((sectionId) => sectionId === id);
    if (idx >= 0) goToIndex(idx);
  }, [sectionIds, goToIndex]);

  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (animatingRef.current) return;

    wheelAccRef.current += e.deltaY;
    const acc = wheelAccRef.current;

    if (Math.abs(acc) >= WHEEL_THRESHOLD) {
      wheelAccRef.current = 0;
      if (acc > 0) goNext(); else goPrev();
    }
  }, [goNext, goPrev]);

  const onTouchStart = useCallback((e: TouchEvent) => {
    if (animatingRef.current) return;
    const t = e.touches[0];
    touchStartYRef.current = t.clientY;
    touchDeltaYRef.current = 0;
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const startY = touchStartYRef.current;
    if (startY == null || animatingRef.current) return;
    const currentY = e.touches[0].clientY;
    touchDeltaYRef.current = currentY - startY;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (animatingRef.current) return;
    const dy = touchDeltaYRef.current;
    if (Math.abs(dy) >= TOUCH_THRESHOLD) {
      if (dy < 0) goNext(); else goPrev();
    }
    touchStartYRef.current = null;
    touchDeltaYRef.current = 0;
  }, [goNext, goPrev]);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (animatingRef.current) return;
    if (['ArrowDown', 'PageDown', 'Space'].includes(e.key)) {
      e.preventDefault();
      goNext();
    } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToIndex(maxIndex);
    }
  }, [goNext, goPrev, goToIndex, maxIndex]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const wheelOpts = { passive: false } as AddEventListenerOptions;
    const touchOpts = { passive: false } as AddEventListenerOptions;

    el.addEventListener('wheel', onWheel, wheelOpts);
    el.addEventListener('touchstart', onTouchStart, touchOpts);
    el.addEventListener('touchmove', onTouchMove, touchOpts);
    el.addEventListener('touchend', onTouchEnd, touchOpts);

    window.addEventListener('keydown', onKeyDown, { passive: false });

    el.tabIndex = 0;

    return () => {
      el.removeEventListener('wheel', onWheel as EventListener);
      el.removeEventListener('touchstart', onTouchStart as EventListener);
      el.removeEventListener('touchmove', onTouchMove as EventListener);
      el.removeEventListener('touchend', onTouchEnd as EventListener);
      window.removeEventListener('keydown', onKeyDown as EventListener);
    };
  }, [onWheel, onTouchStart, onTouchMove, onTouchEnd, onKeyDown]);

  const isHeaderVisible = activeIndex > 0;
  return { activeIndex, isHeaderVisible, goToId, containerRef };
}

const SECTION_IDS = ['home', 'about', 'roadmap', 'projects', 'contact'] as const;

type SectionId = (typeof SECTION_IDS)[number];

export default function HomePage() {
  const { activeIndex, isHeaderVisible, goToId, containerRef } = useStepScroll(
    SECTION_IDS as unknown as string[]
  );
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
    <div className="min-h-screen bg-black text-white font-mono relative">
      <CompactHeader isVisible={isHeaderVisible} onGoTo={goToId} />

      <main
        ref={containerRef}
        className="fixed inset-0 h-screen w-screen overflow-hidden outline-none focus:outline-none select-none"
        style={{
          overscrollBehaviorY: 'none',
          touchAction: 'none',
        }}
      >
        <div className="w-full" style={translateStyle}>
          <section
            id="home"
            className={`h-screen w-screen relative flex items-center justify-center overflow-hidden transition-opacity duration-1000 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-orange-500/5 via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.03)_0%,transparent_70%)]"></div>
            </div>

            <div className="relative z-10 text-center px-4">
              <div className="relative inline-block">
                <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-bold tracking-tighter text-white mb-4">MNX</h1>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[120%]">
                  <div className="relative h-[2px]">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent blur-sm"></div>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-400 text-sm md:text-lg tracking-[0.3em] uppercase mt-8">Backend Developer</p>
              <p className="text-gray-500 text-xs md:text-sm tracking-wider uppercase mt-2">System Architect • API Specialist</p>

              <div
                className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${
                  activeIndex > 0 ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <div className="flex flex-col items-center gap-2 text-gray-600">
                  <span className="text-xs uppercase tracking-wider">Scroll</span>
                  <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          <section
            id="about"
            className={`h-screen w-screen relative flex items-center justify-center px-4 md:px-8 transition-all duration-700 ${
              activeIndex >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-black via-transparent to-transparent"></div>
            </div>
            <div className="w-full max-w-6xl mx-auto relative z-10">
              <HeroSection />
            </div>
          </section>

          <section
            id="roadmap"
            className={`h-screen w-screen relative px-4 md:px-8 py-16 md:py-24 flex items-center transition-all duration-700 ${
              activeIndex >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="max-w-6xl mx-auto w-full">
              <NextSection />
            </div>
          </section>

          <section
            id="projects"
            className="h-screen w-screen relative px-4 md:px-8 py-16 md:py-24 flex items-center justify-center"
          >
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-200">Projects</h2>
              <p className="text-gray-500">Coming soon...</p>
            </div>
          </section>

          <section
            id="contact"
            className="h-screen w-screen relative px-4 md:px-8 py-16 md:py-24 flex items-center justify-center"
          >
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-200">Contact</h2>
              <p className="text-gray-500">Get in touch...</p>
            </div>
          </section>
        </div>
      </main>

      <nav className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
        {SECTION_IDS.map((sectionId, i) => (
          <button
            key={sectionId}
            aria-label={`Go to ${sectionId}`}
            onClick={() => goToId(sectionId)}
            className={`h-3 w-3 rounded-full border border-white/40 transition-transform ${i === activeIndex ? 'scale-125 bg-white' : 'bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </nav>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 text-xs md:text-sm text-white/60 z-50">
        Scroll / Swipe · ↑/↓ / PgUp/PgDn · Click dots
      </div>

      <div 
        className="fixed bottom-0 left-0 right-0 z-40 transition-all duration-700"
        style={{
          transform: `translateY(${activeIndex === SECTION_IDS.length - 1 ? '0' : '100%'})`,
          transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      >
        <footer className="border-t border-gray-900 px-4 md:px-8 py-8 bg-black/90 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">© 2024 Mark Reshetov. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/Zenn1t" className="text-gray-600 hover:text-orange-500 transition-colors">
                GitHub
              </a>
              <a href="https://t.me/yourchannel" className="text-gray-600 hover:text-orange-500 transition-colors">
                Telegram
              </a>
              <a href="mailto:mnx.private.dev@gmail.com" className="text-gray-600 hover:text-orange-500 transition-colors">
                Email
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
