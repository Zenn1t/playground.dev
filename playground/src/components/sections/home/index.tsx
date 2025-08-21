import React, { useState, useEffect } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  duration: number;
}

const ParticleSystem = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const particleArray: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.6 + 0.1,
      duration: 15 + Math.random() * 10,
    }));
    setParticles(particleArray);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-gray-400 to-gray-500"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            transform: 'translate(-50%, -50%)',
            animation: `particleFloat${particle.id % 3} ${particle.duration}s infinite linear`,
          }}
        />
      ))}
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes particleFloat0 {
            0% { transform: translate(-50%, -50%) translateX(0px) translateY(0px); }
            25% { transform: translate(-50%, -50%) translateX(50px) translateY(-30px); }
            50% { transform: translate(-50%, -50%) translateX(-30px) translateY(40px); }
            75% { transform: translate(-50%, -50%) translateX(40px) translateY(-20px); }
            100% { transform: translate(-50%, -50%) translateX(0px) translateY(0px); }
          }
          
          @keyframes particleFloat1 {
            0% { transform: translate(-50%, -50%) translateX(0px) translateY(0px); }
            25% { transform: translate(-50%, -50%) translateX(-40px) translateY(50px); }
            50% { transform: translate(-50%, -50%) translateX(60px) translateY(-25px); }
            75% { transform: translate(-50%, -50%) translateX(-20px) translateY(-45px); }
            100% { transform: translate(-50%, -50%) translateX(0px) translateY(0px); }
          }
          
          @keyframes particleFloat2 {
            0% { transform: translate(-50%, -50%) translateX(0px) translateY(0px); }
            25% { transform: translate(-50%, -50%) translateX(35px) translateY(40px); }
            50% { transform: translate(-50%, -50%) translateX(-50px) translateY(-35px); }
            75% { transform: translate(-50%, -50%) translateX(25px) translateY(30px); }
            100% { transform: translate(-50%, -50%) translateX(0px) translateY(0px); }
          }
        `
      }} />
    </div>
  );
};

interface HomeSectionProps {
  isLoaded: boolean;
  activeIndex: number;
}

export default function HomeSection({ isLoaded, activeIndex }: HomeSectionProps) {
  return (
    <section
      id="home"
      className={`h-screen w-screen relative flex items-center justify-center overflow-hidden transition-opacity duration-1000 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(156,163,175,0.08)_25%,transparent_25%,transparent_50%,rgba(156,163,175,0.08)_50%,rgba(156,163,175,0.08)_75%,transparent_75%,transparent)] bg-[length:40px_40px] opacity-30" />
        
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(209,213,219,0.05)_25%,transparent_25%,transparent_50%,rgba(209,213,219,0.05)_50%,rgba(209,213,219,0.05)_75%,transparent_75%,transparent)] bg-[length:60px_60px] opacity-20" />
        
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(156,163,175,0.03)_2px,rgba(156,163,175,0.03)_4px)] opacity-50" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(156,163,175,0.02)_2px,rgba(156,163,175,0.02)_4px)] opacity-40" />
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(156,163,175,0.2)_0%,rgba(75,85,99,0.1)_30%,transparent_50%)]" />
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_40%,rgba(0,0,0,0.05)_50%,rgba(0,0,0,0.15)_65%,rgba(0,0,0,0.35)_80%,rgba(0,0,0,0.6)_90%,rgba(0,0,0,0.8)_100%)]" />
      </div>

      <ParticleSystem />

      <div className="relative z-10 text-center px-0 sm:px-4">
        <div className="relative inline-block">
          <h1 className="text-[12rem] sm:text-[15rem] md:text-9xl lg:text-[25rem] font-extrabold tracking-tighter bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 bg-clip-text text-transparent drop-shadow-[0_8px_32px_rgba(0,0,0,0.8)] filter">
            MNX
          </h1>
        </div>
        <p className="text-gray-400 text-lg sm:text-xl md:text-3xl lg:text-4xl tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] uppercase mt-1">
          Backend Developer
        </p>
        <p className="text-gray-500 text-base sm:text-lg md:text-xl lg:text-2xl tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] uppercase mt-2 sm:mt-3 opacity-90">
          4 Years Experience
        </p>
       
        <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.25em] uppercase mt-1 sm:mt-2 opacity-70">
          Yes, Really
        </p>
        
        <div className="absolute left-1/2 -translate-x-1/2 mt-12">
          <div className="w-px h-48 bg-gradient-to-b from-gray-600/20 via-gray-500/40 via-gray-400/60 to-gray-300/80 shadow-sm"></div>
        </div>
        
        <div
          className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${
            activeIndex > 0 ? 'opacity-0' : 'opacity-100'
          }`}
        >
        </div>
      </div>
    </section>
  );
}