'use client';

import React, { useEffect, useRef, useState } from 'react';
import HeroSection from '@/sections/hero/HeroSection';
import NextSection from '@/sections/next-section/NextSection';

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


const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function useStepScroll(sectionIds: string[]) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const isAnimatingRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const touchLockedRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);

  const sectionById = (id: string) => sectionsRef.current.find((el) => el?.id === id) || null;

  const ensureSections = () => {
    const c = containerRef.current;
    if (!c) return;
    sectionsRef.current = sectionIds
      .map((id) => c.querySelector<HTMLElement>(`section#${id}`))
      .filter((el): el is HTMLElement => !!el);
  };

  const waitForScrollTo = (targetTop: number, timeout = 1400) =>
    new Promise<void>((resolve) => {
      const c = containerRef.current!;
      let raf = 0;
      const t0 = performance.now();
      const tick = () => {
        const close = Math.abs(c.scrollTop - targetTop) < 2;
        const expired = performance.now() - t0 > timeout;
        if (close || expired) {
          cancelAnimationFrame(raf);
          resolve();
          return;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });

  const goToIndex = async (next: number) => {
    const c = containerRef.current;
    if (!c || isAnimatingRef.current) return;
    ensureSections();
    const sections = sectionsRef.current;
    if (!sections.length) return;

    const clamped = clamp(next, 0, sections.length - 1);
    if (clamped === activeIndex) return;

    isAnimatingRef.current = true;
    const targetEl = sections[clamped];
    const top = targetEl.offsetTop;

    c.scrollTo({ top, behavior: 'smooth' });
    await waitForScrollTo(top);
    setActiveIndex(clamped);
    isAnimatingRef.current = false;
  };

  const goToId = (id: string) => {
    ensureSections();
    const idx = sectionsRef.current.findIndex((el) => el.id === id);
    if (idx >= 0) void goToIndex(idx);
  };

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;

    ensureSections();

    const onWheel = (e: WheelEvent) => {
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      const dir = Math.sign(e.deltaY);
      if (dir === 0) return;
      void goToIndex(activeIndex + (dir > 0 ? 1 : -1));
    };

    const onKey = (e: KeyboardEvent) => {
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        void goToIndex(activeIndex + 1);
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        void goToIndex(activeIndex - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        void goToIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        ensureSections();
        void goToIndex(sectionsRef.current.length - 1);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (isAnimatingRef.current) return;
      touchStartYRef.current = e.touches[0].clientY;
      touchLockedRef.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isAnimatingRef.current || touchLockedRef.current) return;
      const start = touchStartYRef.current;
      if (start == null) return;
      const dy = e.touches[0].clientY - start;
      const threshold = 28;
      if (Math.abs(dy) > threshold) {
        touchLockedRef.current = true;
        if (dy < 0) {
          void goToIndex(activeIndex + 1);
        } else {
          void goToIndex(activeIndex - 1);
        }
      }
    };

    const onTouchEnd = () => {
      touchStartYRef.current = null;
      touchLockedRef.current = false;
    };

    c.addEventListener('wheel', onWheel, { passive: false });
    c.addEventListener('keydown', onKey, { passive: false });
    c.addEventListener('touchstart', onTouchStart, { passive: true });
    c.addEventListener('touchmove', onTouchMove, { passive: true });
    c.addEventListener('touchend', onTouchEnd, { passive: true });

    c.tabIndex = 0;

    const onResize = () => {
      ensureSections();
      const el = sectionsRef.current[activeIndex];
      if (!el) return;
      c.scrollTo({ top: el.offsetTop });
    };
    window.addEventListener('resize', onResize);

    return () => {
      c.removeEventListener('wheel', onWheel as any);
      c.removeEventListener('keydown', onKey as any);
      c.removeEventListener('touchstart', onTouchStart as any);
      c.removeEventListener('touchmove', onTouchMove as any);
      c.removeEventListener('touchend', onTouchEnd as any);
      window.removeEventListener('resize', onResize);
    };
  }, [activeIndex]);

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

  return (
    <div className="min-h-screen bg-black text-white font-mono relative">
      <style jsx global>{`
        main[data-scroll-container] { -ms-overflow-style: none; scrollbar-width: none; }
        main[data-scroll-container]::-webkit-scrollbar { display: none; width: 0; height: 0; }
      `}</style>

      <CompactHeader isVisible={isHeaderVisible} onGoTo={goToId} />

      <main
        ref={containerRef}
        data-scroll-container
        className="h-screen overflow-y-scroll overscroll-none outline-none focus:outline-none"
      >
        <section
          id="home"
          data-step
          className={`relative h-screen flex items-center justify-center overflow-hidden transition-opacity duration-1000 ${
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
          data-step
          className={`relative h-screen flex items-center justify-center px-4 md:px-8 transition-all duration-700 ${
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
          data-step
          className={`relative h-screen px-4 md:px-8 py-16 md:py-24 flex items-center transition-all duration-700 ${
            activeIndex >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="max-w-6xl mx-auto w-full">
            <NextSection />
          </div>
        </section>

        <section
          id="projects"
          data-step
          className="relative h-screen px-4 md:px-8 py-16 md:py-24 flex items-center justify-center"
        >
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-200">Projects</h2>
            <p className="text-gray-500">Coming soon...</p>
          </div>
        </section>

        <section
          id="contact"
          data-step
          className="relative h-screen px-4 md:px-8 py-16 md:py-24 flex items-center justify-center"
        >
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-200">Contact</h2>
            <p className="text-gray-500">Get in touch...</p>
          </div>
        </section>

        <footer className="border-t border-gray-900 px-4 md:px-8 py-8 bg-black/50 backdrop-blur-sm">
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
      </main>
    </div>
  );
}
