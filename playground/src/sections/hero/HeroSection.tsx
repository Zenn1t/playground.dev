'use client';
import CodeTerminal from './CodeTerminal';

export default function HeroSection() {
  return (
    <div className="border border-gray-900 rounded-sm p-4 md:p-8 flex flex-col lg:flex-row bg-black/50 backdrop-blur-sm">
      <div className="flex-1 space-y-6 mb-8 lg:mb-0">
        <div className="border-b border-gray-900 pb-6 space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold">[ Mark Reshetov ]</h1>
          <div className="inline-block">
            <p className="text-sm md:text-base text-gray-500 border border-gray-800 px-3 py-1 rounded-sm">
              Backend Developer
            </p>
          </div>
        </div>
        
        <div className="space-y-5">
          <div className="flex flex-col space-y-1">
            <span className="text-gray-600 text-xs uppercase tracking-wider">Contact</span>
            <span className="text-gray-300">mnx.private.dev@gmail.com</span>
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
      
      <CodeTerminal />
    </div>
  );
}