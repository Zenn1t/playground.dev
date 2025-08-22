'use client';

import React from 'react';

interface FooterProps {
  isVisible: boolean;
  transitionMs?: number;
}

export default function Footer({ isVisible, transitionMs = 720 }: FooterProps) {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-40 transition-all"
      style={{
        transform: `translateY(${isVisible ? '0' : '100%'})`,
        transition: `transform ${transitionMs}ms cubic-bezier(0.22, 1, 0.36, 1)`,
      }}
    >
      <footer className="border-t border-gray-900 px-4 md:px-8 py-8 bg-black/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
        <p className="text-xs font-mono bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 
                       bg-clip-text text-transparent animate-[shine_4s_linear_infinite]">
          © 2025 Mark Reshetov · Licensed under the&nbsp;
          <a href="https://github.com/Zenn1t/playground.dev/blob/main/LICENSE"
             target="_blank"
             rel="noopener noreferrer"
             className="underline hover:opacity-80">
            Apache License 2.0
          </a>
          &nbsp;— open for learning and reuse.
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
