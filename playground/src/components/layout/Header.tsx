'use client';

import React, { useState } from 'react';

interface HeaderProps {
  isVisible: boolean;
  onGoTo?: (id: string) => void;
}

export default function Header({ isVisible, onGoTo }: HeaderProps) {
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
                  href="#contact"
                  onClick={(e) => handleNavClick(e, '#contact')}
                  className="px-4 py-2 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black transition-all duration-300 text-sm rounded-sm font-semibold shadow-md"
                >
                  Let’s Talk
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
                  href="#contact"
                  onClick={(e) => handleNavClick(e, '#contact')}
                  className="block px-4 py-2 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black transition-all duration-300 text-sm text-center mt-4 rounded-sm font-semibold shadow-md"
                >
                  Let’s Talk 
                </a>

            </nav>
          </div>
        )}
      </div>
    </header>
  );
}