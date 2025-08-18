'use client';
import CodeTerminal from './CodeTerminal';

type IconProps = { className?: string };

const GithubIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    className={className}
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
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 3 3 10l7 3 3 7 9-17z" />
    <path d="M10 13l8-8" />
  </svg>
);

const MailIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7 12 12 2 7" />
  </svg>
);

const OutlookIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2.5" y="6.5" width="6.5" height="11" rx="1.5" />
    <circle cx="5.75" cy="12" r="2.25" />
    <rect x="9.5" y="4.5" width="12" height="15" rx="2" />
    <path d="M9.5 8l6 4.5L21.5 8" />
  </svg>
);

const IconButton = ({
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
    className={`
      inline-flex items-center justify-center
      h-8 w-8 md:h-9 md:w-9
      border border-gray-800 rounded-sm
      text-gray-600 hover:border-gray-700
      transition-all duration-200
      ${hoverColor || 'hover:text-white'}
    `}
  >
    <span className="text-[18px] md:text-[20px] leading-none">
      {children}
    </span>
  </a>
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
            <div className="flex items-center gap-2 md:gap-2.5">
              {socialLinks.map((link, i) => (
                <IconButton 
                  key={i} 
                  href={link.href} 
                  label={link.label}
                  hoverColor={link.hoverColor}
                >
                  {link.icon}
                </IconButton>
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