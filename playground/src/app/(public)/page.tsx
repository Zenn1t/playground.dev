'use client';
import React, { useState, useEffect, useRef } from 'react';
import type { Metadata } from "next";
import HeroSection from "@/sections/hero/HeroSection";
import NextSection from "@/sections/next-section/NextSection";

const Header = ({ isCompact, scrollProgress }: { isCompact: boolean; scrollProgress: number }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          isCompact ? 'opacity-0 pointer-events-none translate-y-[-100%]' : 'opacity-100'
        }`}
      >
        <div className="p-8 md:p-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
                  MNX
                </div>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-60"></div>
              </div>
              
              <p className="text-gray-400 text-sm md:text-base tracking-wider uppercase">
                Backend Developer • System Architect
              </p>
              
              <nav className="hidden md:flex items-center gap-8 mt-4">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="text-gray-400 hover:text-orange-500 transition-colors duration-200 text-sm uppercase tracking-wider"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className={`mt-8 transition-opacity duration-500 ${scrollProgress > 0.1 ? 'opacity-0' : 'opacity-100'}`}>
                <div className="flex flex-col items-center gap-2 text-gray-600">
                  <span className="text-xs uppercase tracking-wider">Scroll</span>
                  <svg 
                    className="w-5 h-5 animate-bounce"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          isCompact ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-[-100%]'
        }`}
      >
        <div className="bg-black/80 backdrop-blur-md border-b border-gray-900">
          <div className="px-4 md:px-8 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-white">MNX</span>
                <span className="hidden md:inline text-gray-500 text-sm">Backend Developer</span>
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
    </>
  );
};

const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      const progress = scrollTop / (documentHeight - windowHeight);
      setScrollProgress(progress);
      
      const switchPoint = windowHeight * 0.3;
      setIsHeaderCompact(scrollTop > switchPoint);
    };

    handleScroll(); // Начальная проверка
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollProgress, isHeaderCompact };
};

export default function HomePage() {
  const { scrollProgress, isHeaderCompact } = useScrollProgress();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-orange-500/10 via-orange-500/5 to-transparent"></div>
      </div>
      
      <Header isCompact={isHeaderCompact} scrollProgress={scrollProgress} />
      
      <section 
        id="about"
        className={`relative min-h-screen flex items-center justify-center pt-32 md:pt-40 px-4 md:px-8 transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-full max-w-6xl mx-auto">
          <div className={`transition-all duration-700 ${
            isHeaderCompact ? 'scale-100' : 'scale-95'
          }`}>
            <HeroSection />
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
      </section>
      
      <section 
        id="skills"
        className={`relative min-h-screen px-4 md:px-8 py-16 md:py-24 transition-all duration-1000 ${
          scrollProgress > 0.1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <NextSection />
        </div>
      </section>
      
      <section 
        id="projects"
        className="relative min-h-screen px-4 md:px-8 py-16 md:py-24 flex items-center justify-center"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Projects</h2>
          <p className="text-gray-600">Coming soon...</p>
        </div>
      </section>
      
      <section 
        id="contact"
        className="relative min-h-screen px-4 md:px-8 py-16 md:py-24 flex items-center justify-center"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Contact</h2>
          <p className="text-gray-600">Get in touch...</p>
        </div>
      </section>

      {/* Простой футер */}
      <footer className="border-t border-gray-900 px-4 md:px-8 py-8 bg-black/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © 2024 Mark Reshetov. All rights reserved.
          </p>
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
  );
}