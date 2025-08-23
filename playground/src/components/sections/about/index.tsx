'use client';

import React, { useLayoutEffect, useRef, useState, useEffect, memo } from 'react';
import CodeTerminal from './CodeTerminal';
import { TERMINAL_FILES } from './constants';

const WineParticleSystem = memo(() => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    const particleArray = Array.from({ length: 20 }, (_, i) => ({ 
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.3 + 0.1, 
      duration: 20 + Math.random() * 10, 
    }));
    setParticles(particleArray);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full will-change-transform"
          style={{
            background: 'linear-gradient(to right, rgb(114, 47, 55), rgb(139, 69, 76))',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            transform: 'translate(-50%, -50%) translateZ(0)',
            animation: `particleFloat ${particle.duration}s infinite linear`,
          }}
        />
      ))}
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes particleFloat {
            0% { transform: translate(-50%, -50%) translateZ(0) translateX(0px) translateY(0px); }
            25% { transform: translate(-50%, -50%) translateZ(0) translateX(30px) translateY(-20px); }
            50% { transform: translate(-50%, -50%) translateZ(0) translateX(-20px) translateY(30px); }
            75% { transform: translate(-50%, -50%) translateZ(0) translateX(20px) translateY(-10px); }
            100% { transform: translate(-50%, -50%) translateZ(0) translateX(0px) translateY(0px); }
          }
        `
      }} />
    </div>
  );
});

WineParticleSystem.displayName = 'WineParticleSystem';

const BackgroundEffects = memo(() => (
  <div className="absolute inset-0 pointer-events-none">
    <div 
      className="absolute inset-0 opacity-20"
      style={{
        background: `linear-gradient(45deg, rgba(114, 47, 55, 0.08) 25%, transparent 25%, transparent 50%, rgba(114, 47, 55, 0.08) 50%, rgba(114, 47, 55, 0.08) 75%, transparent 75%, transparent)`,
        backgroundSize: '40px 40px',
        transform: 'translateZ(0)',
      }}
    />
    
    <div 
      className="absolute inset-0 opacity-15"
      style={{
        background: `linear-gradient(135deg, rgba(139, 69, 76, 0.05) 25%, transparent 25%, transparent 50%, rgba(139, 69, 76, 0.05) 50%, rgba(139, 69, 76, 0.05) 75%, transparent 75%, transparent)`,
        backgroundSize: '60px 60px',
        transform: 'translateZ(0)',
      }}
    />
    
    <div 
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(114, 47, 55, 0.03) 2px, rgba(114, 47, 55, 0.03) 4px),
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 69, 76, 0.02) 2px, rgba(139, 69, 76, 0.02) 4px)
        `,
        transform: 'translateZ(0)',
      }}
    />
    
    <div 
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(circle at 30% 20%, rgba(114, 47, 55, 0.15) 0%, transparent 40%),
          radial-gradient(circle at 70% 80%, rgba(139, 69, 76, 0.12) 0%, transparent 45%)
        `,
        transform: 'translateZ(0)',
      }}
    />
    
    <div 
      className="absolute inset-0"
      style={{
        background: `radial-gradient(circle at center, transparent 0%, transparent 30%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.3) 70%, rgba(0, 0, 0, 0.5) 85%, rgba(0, 0, 0, 0.7) 95%, rgba(0, 0, 0, 0.85) 100%)`,
        transform: 'translateZ(0)',
      }}
    />
    
    <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-black via-transparent to-transparent" />
  </div>
));

BackgroundEffects.displayName = 'BackgroundEffects';

type IconProps = { className?: string };

const GithubIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    className={`block ${className ?? ''}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3" />
    <path d="M15 22v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1C19.91 1 18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77 5.44 5.44 0 0 0 3.5 8.55c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const TelegramIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    className={`block ${className ?? ''}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21.3 4.1L3.2 10.5c-.6.2-.6 1 .02 1.2l6.2 2.1c.3.1.5.3.6.6l2.1 6.2c.2.62 1 .62 1.2.02L21.7 4.6c.2-.56-.28-1.06-.92-.5Z" />
    <path d="M9.8 13.3L21.3 4.1" />
  </svg>
);

const MailIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    className={`block ${className ?? ''}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2.2" y="4.5" width="19.6" height="15" rx="2" />
    <path d="M21.5 7.2L12 12.3 2.5 7.2" />
  </svg>
);

const OutlookIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    className={`block ${className ?? ''}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2.2" y="4.5" width="19.6" height="15" rx="2" />
    <path d="M21.5 7.2L12 12.3" />
    <path d="M12 4.5v15" />
    <circle cx="7.1" cy="12" r="2.3" />
  </svg>
);

const IconButton = memo(({
  href,
  label,
  hoverColor,
  children,
}: {
  href: string;
  label: string;
  hoverColor?: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={`inline-flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 border border-gray-800 rounded-sm text-gray-600 hover:border-gray-700 transition-colors duration-200 ${
      hoverColor || 'hover:text-white'
    } focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700`}
  >
    <span className="text-[16px] sm:text-[18px] md:text-[20px] leading-none">
      {children}
    </span>
  </a>
));

IconButton.displayName = 'IconButton';

function BracketHeader({
  width,
  children,
  isReady,
}: {
  width: number;
  children: React.ReactNode;
  isReady: boolean;
}) {
  return (
    <div
      className={`relative w-fit transition-opacity duration-300 ${
        isReady ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ width: width ? `${width}px` : undefined }}
    >
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-center select-none">
        {children}
      </h1>
      <span aria-hidden className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">
        <span className="relative block h-[1.1em] w-0 border-l border-gray-600">
          <span className="absolute -top-[0.28em] left-0 w-[0.5em] sm:w-[0.6em] border-t border-gray-600" />
          <span className="absolute -bottom-[0.28em] left-0 w-[0.5em] sm:w-[0.6em] border-b border-gray-600" />
        </span>
      </span>
      <span aria-hidden className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
        <span className="relative block h-[1.1em] w-0 border-r border-gray-600">
          <span className="absolute -top-[0.28em] right-0 w-[0.5em] sm:w-[0.6em] border-t border-gray-600" />
          <span className="absolute -bottom-[0.28em] right-0 w-[0.5em] sm:w-[0.6em] border-b border-gray-600" />
        </span>
      </span>
    </div>
  );
}

interface AboutSectionProps {
  activeIndex: number;
}

export default function AboutSection({ activeIndex }: AboutSectionProps) {
  const socialLinks = [
    {
      icon: <MailIcon />,
      href: 'mailto:mnx.private.dev@gmail.com',
      label: 'Email',
      hoverColor: 'hover:text-orange-500',
    },
    {
      icon: <OutlookIcon />,
      href: 'mailto:mnx.private.dev@outlook.com',
      label: 'Outlook',
      hoverColor: 'hover:text-[#0078D4]',
    },
    {
      icon: <GithubIcon />,
      href: 'https://github.com/Zenn1t',
      label: 'GitHub',
      hoverColor: 'hover:text-white',
    },
    {
      icon: <TelegramIcon />,
      href: 'https://t.me/yourchannel',
      label: 'Telegram',
      hoverColor: 'hover:text-[#229ED9]',
    },
  ];

  const devRef = useRef<HTMLParagraphElement | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [dimensions, setDimensions] = useState({
    dev: 0,
    row: 0,
    container: 0,
  });
  const [isReady, setIsReady] = useState(false);
  const [useStackedLayout, setUseStackedLayout] = useState(false);

  useLayoutEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const newDimensions = { ...dimensions };
      
      for (const entry of entries) {
        const width = Math.ceil(entry.contentRect.width);
        if (entry.target === devRef.current) newDimensions.dev = width;
        else if (entry.target === rowRef.current) newDimensions.row = width;
        else if (entry.target === containerRef.current) newDimensions.container = width;
      }
      
      setDimensions(newDimensions);
    });

    if (devRef.current) observer.observe(devRef.current);
    if (rowRef.current) observer.observe(rowRef.current);
    if (containerRef.current) observer.observe(containerRef.current);

    const timer = setTimeout(() => setIsReady(true), 100);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []); 

  useLayoutEffect(() => {
    if (dimensions.row && dimensions.container) {
      const shouldStack = dimensions.row > dimensions.container - 32;
      setUseStackedLayout(shouldStack);
    }
  }, [dimensions]);

  return (
    <section
      id="about"
      className={`h-screen w-screen relative flex items-center justify-center px-4 md:px-8 transition-opacity transition-transform duration-700 transform-gpu ${
        activeIndex >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <BackgroundEffects />
      <WineParticleSystem />
      
      <div className="w-full max-w-6xl mx-auto relative z-10">
        <div
          ref={containerRef}
          className="border border-gray-900 rounded-sm p-4 md:p-8 flex flex-col lg:flex-row bg-black/50 backdrop-blur-sm will-change-transform"
        >
          <div className="flex-1 space-y-6 mb-8 lg:mb-0">
            <div className="border-b border-gray-900 pb-6 space-y-3">
              <BracketHeader width={useStackedLayout ? 0 : dimensions.row} isReady={isReady}>
                Mark Reshetov
              </BracketHeader>

              <div className={`transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
                {useStackedLayout ? (
                  <div className="space-y-3">
                    <p
                      ref={devRef}
                      className="h-8 sm:h-9 px-3 inline-flex items-center whitespace-nowrap select-none text-sm md:text-base text-gray-500 border border-gray-800 rounded-sm leading-none"
                    >
                      Backend Developer
                    </p>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {socialLinks.map((link, i) => (
                        <IconButton key={i} href={link.href} label={link.label} hoverColor={link.hoverColor}>
                          {link.icon}
                        </IconButton>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div ref={rowRef} className="inline-flex items-center">
                    <p
                      ref={devRef}
                      className="h-8 sm:h-9 px-3 inline-flex items-center whitespace-nowrap select-none text-sm md:text-base text-gray-500 border border-gray-800 rounded-sm leading-none"
                    >
                      Backend Developer
                    </p>

                    <div className="ml-2" style={dimensions.dev ? { width: `${dimensions.dev}px` } : undefined}>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {socialLinks.map((link, i) => (
                          <IconButton key={i} href={link.href} label={link.label} hoverColor={link.hoverColor}>
                            {link.icon}
                          </IconButton>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`space-y-5 transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex flex-col space-y-1">
                <span className="text-gray-600 text-xs uppercase tracking-wider">Contact</span>
                <a
                  href="mailto:mnx.private.dev@gmail.com"
                  className="text-gray-300 hover:text-orange-500 transition-colors duration-200 w-fit select-text cursor-text break-all"
                  onClick={(e) => {
                    if (window.getSelection()?.toString()) e.preventDefault();
                  }}
                >
                  mnx.private.dev@gmail.com
                </a>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-gray-600 text-xs uppercase tracking-wider">Location</span>
                <span className="text-gray-300">Bern, Switzerland</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-gray-600 text-xs uppercase tracking-wider">Experience</span>
                <span className="text-gray-300">2+ years in backend</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-gray-600 text-xs uppercase tracking-wider">Languages</span>
                <span className="text-gray-300">DE (A2) / EN (A1) / RU / UK</span>
              </div>
            </div>
          </div>

          <CodeTerminal
            files={TERMINAL_FILES}
            typingSpeed={4}
            betweenFilesDelay={900}
            restartDelay={1400}
            lineHeightPx={12}
          />
        </div>
      </div>
    </section>
  );
}