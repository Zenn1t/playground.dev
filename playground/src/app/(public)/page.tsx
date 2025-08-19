'use client';
import React, { useState, useEffect, useRef } from 'react';
import type { Metadata } from "next";
import HeroSection from "@/sections/hero/HeroSection";
import NextSection from "@/sections/next-section/NextSection";

const CompactHeader = ({ isVisible }: { isVisible: boolean }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Roadmap', href: '#roadmap' },
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
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-[-100%]'
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

const useScrollSnap = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<any>();

  useEffect(() => {
    const sections = ['home', 'about', 'roadmap', 'projects', 'contact'];
    
    const handleScroll = () => {
      if (isScrolling.current) return;
      
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      
      const section = Math.round(scrollTop / windowHeight);
      setCurrentSection(section);
      setIsHeaderVisible(scrollTop > windowHeight * 0.8);
      
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      scrollTimeout.current = setTimeout(() => {
        const targetSection = Math.round(scrollTop / windowHeight);
        const targetY = targetSection * windowHeight;
        
        if (Math.abs(scrollTop - targetY) > 5) {
          isScrolling.current = true;
          
          window.scrollTo({
            top: targetY,
            behavior: 'smooth'
          });
          
          setTimeout(() => {
            isScrolling.current = false;
          }, 600);
        }
      }, 150);
    };

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current) {
        e.preventDefault();
        return;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return { currentSection, isHeaderVisible };
};

export default function HomePage() {
  const { currentSection, isHeaderVisible } = useScrollSnap();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono relative">
      <CompactHeader isVisible={isHeaderVisible} />
      
      <section 
        id="home"
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
            <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-bold tracking-tighter text-white mb-4">
              MNX
            </h1>
            
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
          
          <p className="text-gray-400 text-sm md:text-lg tracking-[0.3em] uppercase mt-8">
            Backend Developer
          </p>
          
          <p className="text-gray-500 text-xs md:text-sm tracking-wider uppercase mt-2">
            System Architect • API Specialist
          </p>

          <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${
            currentSection > 0 ? 'opacity-0' : 'opacity-100'
          }`}>
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
      </section>
      
      <section 
        id="about"
        className={`relative min-h-screen flex items-center justify-center px-4 md:px-8 py-16 transition-all duration-1000 ${
          currentSection >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
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
        className={`relative min-h-screen px-4 md:px-8 py-16 md:py-24 flex items-center transition-all duration-1000 ${
          currentSection >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto w-full">
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
