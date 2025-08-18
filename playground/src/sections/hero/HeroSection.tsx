'use client';
import CodeTerminal from './CodeTerminal';

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const TelegramIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22l-4-9-9-4 20-7z" />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 5L2 7" />
  </svg>
);

const OutlookIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="9" y="5" width="12" height="14" rx="2" />
    <path d="M9 9l6 4 6-4" />

    <rect x="3" y="7" width="7" height="10" rx="1.5" />
    <circle cx="6.5" cy="12" r="2.5" />
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
            <div className="flex gap-3">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-600 transition-colors duration-200 ${link.hoverColor}`}
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