'use client';
import CodeTerminal from './CodeTerminal';

const GithubIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const TelegramIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 3L3 10l7 2.5m11-9.5L9 16l-2 6 5-6m9-13L9 16" />
  </svg>
);

const MailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

const OutlookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 2v10a3 3 0 0 0 3 3h11a1 1 0 0 0 1-1V4a2 2 0 0 0-2-2H7z"/>
    <path d="M2 7h12v12H4a2 2 0 0 1-2-2V7z"/>
    <circle cx="8" cy="13" r="2"/>
  </svg>
);

export default function HeroSection() {
  const socialLinks = [
    { 
      icon: <MailIcon />, 
      href: 'mailto:mnx.private.dev@gmail.com',
      label: 'Email',
      hoverColor: 'hover:text-orange-500'
    },
    { 
      icon: <OutlookIcon />, 
      href: 'mailto:mnx.private.dev@outlook.com',
      label: 'Outlook',
      hoverColor: 'hover:text-[#0078D4]'
    },
    { 
      icon: <GithubIcon />, 
      href: 'https://github.com/Zenn1t',
      label: 'GitHub', 
      hoverColor: 'hover:text-white'
    },
    { 
      icon: <TelegramIcon />, 
      href: 'https://t.me/yourchannel',
      label: 'Telegram',
      hoverColor: 'hover:text-[#229ED9]'
    },
  ];

  return (
    <div className="border border-gray-900 rounded-sm p-4 md:p-8 flex flex-col lg:flex-row bg-black/50 backdrop-blur-sm">
      <div className="flex-1 space-y-6 mb-8 lg:mb-0">
        <div className="border-b border-gray-900 pb-6 space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold">[ Mark Reshetov ]</h1>
          <div className="flex items-center gap-4">
            <div className="inline-block">
              <p className="text-sm md:text-base text-gray-500 border border-gray-800 px-3 py-1 rounded-sm">
                Backend Developer
              </p>
            </div>
            <div className="flex gap-3 items-center">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-600 transition-all duration-200 ${link.hoverColor} hover:scale-110`}
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-5">
          <div className="flex flex-col space-y-1">
            <span className="text-gray-600 text-xs uppercase tracking-wider">Contact</span>
            <a 
              href="mailto:mnx.private.dev@gmail.com" 
              className="text-gray-300 hover:text-orange-500 transition-colors duration-200 w-fit select-text cursor-text"
              onClick={(e) => {
                if (window.getSelection()?.toString()) {
                  e.preventDefault();
                }
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
      
      <CodeTerminal />
    </div>
  );
}