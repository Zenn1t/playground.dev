'use client';
import React, { useState, useEffect, useRef } from 'react';

interface ContactSectionProps {
  activeIndex: number;
}

const SendIcon = () => (
  <svg 
    className="w-4 h-4" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M14 5l7 7m0 0l-7 7m7-7H3" 
    />
  </svg>
);

const CheckIcon = () => (
  <svg 
    className="w-3 h-3" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={3} 
      d="M5 13l4 4L19 7" 
    />
  </svg>
);

const ExpandIcon = () => (
  <svg 
    className="w-4 h-4" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" 
    />
  </svg>
);

const MinimizeIcon = () => (
  <svg 
    className="w-4 h-4" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M9 9V5m0 0H5m4 0l-5 5m11-5h4m0 0v4m0-4l-5 5M9 15v4m0 0H5m4 0l-5-5m11 5h4m0 0v-4m0 4l-5-5" 
    />
  </svg>
);

const countryCodes = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+7', country: 'RU', flag: '🇷🇺' },
  { code: '+41', country: 'CH', flag: '🇨🇭' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+31', country: 'NL', flag: '🇳🇱' },
  { code: '+46', country: 'SE', flag: '🇸🇪' },
  { code: '+47', country: 'NO', flag: '🇳🇴' },
  { code: '+48', country: 'PL', flag: '🇵🇱' },
  { code: '+380', country: 'UA', flag: '🇺🇦' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+82', country: 'KR', flag: '🇰🇷' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+52', country: 'MX', flag: '🇲🇽' },
];

const EditorButton = ({ 
  onClick, 
  active, 
  children, 
  title 
}: { 
  onClick: () => void; 
  active?: boolean; 
  children: React.ReactNode; 
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-1.5 rounded transition-colors ${
      active 
        ? 'bg-gray-700 text-gray-100' 
        : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
    }`}
  >
    {children}
  </button>
);

const FullScreenEditor = ({ 
  isOpen, 
  onClose, 
  editorRef,
  messageHtml,
  onMessageChange,
  activeFormats,
  formatText
}: {
  isOpen: boolean;
  onClose: () => void;
  editorRef: React.RefObject<HTMLDivElement>;
  messageHtml: string;
  onMessageChange: () => void;
  activeFormats: { bold: boolean; italic: boolean; underline: boolean };
  formatText: (command: string) => void;
}) => {
  const modalEditorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalEditorRef.current) {
      modalEditorRef.current.innerHTML = messageHtml;
      modalEditorRef.current.focus();
    }
  }, [isOpen, messageHtml]);

  const handleModalMessageChange = () => {
    if (modalEditorRef.current && editorRef.current) {
      const html = modalEditorRef.current.innerHTML;
      editorRef.current.innerHTML = html;
      onMessageChange();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl h-[80vh] bg-gray-950 border border-gray-800 rounded-lg flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h3 className="text-lg font-medium text-gray-200">Compose Message</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-300 transition-colors"
            title="Close (Esc)"
          >
            <MinimizeIcon />
          </button>
        </div>

        <div className="flex items-center gap-1 px-6 py-3 border-b border-gray-800">
          <EditorButton 
            onClick={() => {
              document.execCommand('bold', false);
              handleModalMessageChange();
            }} 
            active={activeFormats.bold}
            title="Bold (Ctrl+B)"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 4a1 1 0 00-1 1v10a1 1 0 001 1h4.5a3.5 3.5 0 001.852-6.49A3.5 3.5 0 0010.5 4H6zm4.5 5H7V6h3.5a1.5 1.5 0 010 3zM7 11h3.5a1.5 1.5 0 010 3H7v-3z"/>
            </svg>
          </EditorButton>
          
          <EditorButton 
            onClick={() => {
              document.execCommand('italic', false);
              handleModalMessageChange();
            }} 
            active={activeFormats.italic}
            title="Italic (Ctrl+I)"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 4a1 1 0 011-1h4a1 1 0 110 2h-1.25l-2 10H11a1 1 0 110 2H7a1 1 0 110-2h1.25l2-10H9a1 1 0 01-1-1z"/>
            </svg>
          </EditorButton>
          
          <EditorButton 
            onClick={() => {
              document.execCommand('underline', false);
              handleModalMessageChange();
            }} 
            active={activeFormats.underline}
            title="Underline (Ctrl+U)"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 4a1 1 0 011 1v5a3 3 0 11-6 0V5a1 1 0 112 0v5a1 1 0 102 0V5a1 1 0 011-1zM5 15a1 1 0 100 2h10a1 1 0 100-2H5z"/>
            </svg>
          </EditorButton>
          
          <div className="w-px h-4 bg-gray-700 mx-1" />
          
          <EditorButton 
            onClick={() => {
              document.execCommand('insertUnorderedList', false);
              handleModalMessageChange();
            }} 
            title="Bullet List"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 6a1 1 0 100 2h10a1 1 0 100-2H7zM7 11a1 1 0 100 2h10a1 1 0 100-2H7zM3 7a1 1 0 110-2 1 1 0 010 2zM3 12a1 1 0 110-2 1 1 0 010 2z"/>
            </svg>
          </EditorButton>

          <EditorButton 
            onClick={() => {
              document.execCommand('insertOrderedList', false);
              handleModalMessageChange();
            }} 
            title="Numbered List"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 6a1 1 0 100 2h10a1 1 0 100-2H7zM7 11a1 1 0 100 2h10a1 1 0 100-2H7zM2 7.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zM2 12.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1z"/>
            </svg>
          </EditorButton>
        </div>

        <div className="flex-1 overflow-hidden px-6 py-4">
          <div
            ref={modalEditorRef}
            contentEditable
            onInput={handleModalMessageChange}
            className="w-full h-full overflow-y-auto text-gray-100 focus:outline-none [&>*]:mb-2 [&>ul]:ml-4 [&>ul]:list-disc [&>ol]:ml-4 [&>ol]:list-decimal"
            style={{ 
              wordBreak: 'break-word',
              overflowWrap: 'anywhere'
            }}
            data-scroll-ignore="true"
            suppressContentEditableWarning
          />
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
          <span className="text-xs text-gray-600">
            Press Esc to close • Changes are saved automatically
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ContactSection({ activeIndex }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    message: ''
  });
  const [messageHtml, setMessageHtml] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [contactType, setContactType] = useState<'email' | 'phone' | null>(null);
  const [isContactValid, setIsContactValid] = useState<boolean | null>(null);
  const [detectedCountry, setDetectedCountry] = useState<typeof countryCodes[0] | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false
  });
  
  const editorRef = useRef<HTMLDivElement>(null);
  const lastSaveTime = useRef(0);

  useEffect(() => {
    const savedData = localStorage.getItem('contactFormDraft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed.formData || { name: '', contact: '', message: '' });
        setMessageHtml(parsed.messageHtml || '');
        if (editorRef.current && parsed.messageHtml) {
          editorRef.current.innerHTML = parsed.messageHtml;
        }
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  useEffect(() => {
    const now = Date.now();
    if (now - lastSaveTime.current < 1000) return;
    
    lastSaveTime.current = now;
    const dataToSave = {
      formData,
      messageHtml,
      timestamp: now
    };
    
    try {
      localStorage.setItem('contactFormDraft', JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Failed to save draft:', e);
    }
  }, [formData, messageHtml]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isFullScreen]);

  useEffect(() => {
    if (contactType === 'phone' && formData.contact.startsWith('+')) {
      const input = formData.contact;
      const detected = countryCodes.find(c => 
        input.startsWith(c.code) && 
        (input.length === c.code.length || input[c.code.length] === ' ' || /\d/.test(input[c.code.length]))
      );
      setDetectedCountry(detected || null);
    } else {
      setDetectedCountry(null);
    }
  }, [formData.contact, contactType]);

  useEffect(() => {
    const value = formData.contact.trim();
    
    if (!value) {
      setContactType(null);
      setIsContactValid(null);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasOnlyPhoneChars = /^[\d\s\-\(\)\+]+$/.test(value);
    const hasEnoughDigits = value.replace(/\D/g, '').length >= 7;
    
    if (hasOnlyPhoneChars && hasEnoughDigits) {
      setContactType('phone');
      const cleanPhone = value.replace(/\D/g, '');
      setIsContactValid(cleanPhone.length >= 10 && cleanPhone.length <= 15);
    } else if (value.includes('@')) {
      setContactType('email');
      setIsContactValid(emailPattern.test(value));
    } else if (hasOnlyPhoneChars) {
      setContactType('phone');
      setIsContactValid(false);
    } else {
      setContactType('email');
      setIsContactValid(false);
    }
  }, [formData.contact]);

  useEffect(() => {
    const checkFormats = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      if (!editorRef.current?.contains(range.commonAncestorContainer)) return;

      let node = range.commonAncestorContainer;
      if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentNode as Node;
      }

      const checkTag = (tag: string) => {
        let current = node;
        while (current && current !== editorRef.current) {
          if ((current as Element).tagName === tag.toUpperCase()) return true;
          current = current.parentNode as Node;
        }
        return false;
      };

      setActiveFormats({
        bold: checkTag('b') || checkTag('strong'),
        italic: checkTag('i') || checkTag('em'),
        underline: checkTag('u')
      });
    };

    document.addEventListener('selectionchange', checkFormats);
    return () => document.removeEventListener('selectionchange', checkFormats);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const formatText = (command: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false);
    handleMessageChange();
  };

  const handleMessageChange = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const text = editorRef.current.innerText || editorRef.current.textContent || '';
    setMessageHtml(html);
    setFormData(prev => ({ ...prev, message: text }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isContactValid) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          messageHtml,
          contactType
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', contact: '', message: '' });
        setMessageHtml('');
        if (editorRef.current) {
          editorRef.current.innerHTML = '';
        }
        setContactType(null);
        setIsContactValid(null);
        localStorage.removeItem('contactFormDraft');
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getContactLabel = () => {
    if (!formData.contact && focusedField !== 'contact') {
      return 'Email or Phone';
    }
    if (contactType === 'phone') {
      return 'Phone Number';
    }
    if (contactType === 'email') {
      return 'Email Address';
    }
    return 'Email or Phone';
  };

  const getBorderColor = () => {
    if (focusedField === 'contact') {
      if (formData.contact && isContactValid === false) {
        return 'border-red-500/50';
      }
      if (isContactValid === true) {
        return 'border-green-500/50';
      }
      return 'border-gray-600';
    }
    if (formData.contact && isContactValid === false) {
      return 'border-red-500/30';
    }
    if (isContactValid === true) {
      return 'border-green-500/30';
    }
    return 'border-gray-800';
  };

  return (
    <section
      id="contact"
      className={`min-h-screen w-screen relative px-4 md:px-8 py-16 md:py-24 flex items-center justify-center transition-all duration-700 ${
        activeIndex >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="max-w-xl w-full mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-100">
            Get In Touch
          </h2>
          <p className="text-gray-500 text-base">
            Let's build something amazing together
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-800 text-gray-100 placeholder-transparent focus:outline-none focus:border-gray-600 transition-colors peer"
              placeholder="Name"
              autoComplete="name"
            />
            <label
              htmlFor="name"
              className={`absolute left-0 transition-all duration-200 ${
                formData.name || focusedField === 'name'
                  ? '-top-5 text-xs text-gray-600'
                  : 'top-3 text-base text-gray-500'
              } pointer-events-none`}
            >
              Your Name
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              id="contact"
              name="contact"
              required
              value={formData.contact}
              onChange={handleChange}
              onFocus={() => setFocusedField('contact')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-0 py-3 bg-transparent border-0 border-b ${getBorderColor()} text-gray-100 placeholder-transparent focus:outline-none transition-all duration-200 peer`}
              placeholder="Email or Phone"
              autoComplete="email tel"
            />
            <label
              htmlFor="contact"
              className={`absolute left-0 transition-all duration-200 ${
                formData.contact || focusedField === 'contact'
                  ? '-top-5 text-xs'
                  : 'top-3 text-base'
              } ${
                formData.contact && isContactValid === false
                  ? 'text-red-500/70'
                  : isContactValid === true
                  ? 'text-green-500/70'
                  : 'text-gray-500'
              } pointer-events-none`}
            >
              {getContactLabel()}
            </label>
            
            {detectedCountry && (
              <span className="absolute right-0 top-3 flex items-center gap-1 text-sm text-gray-500 animate-fade-in">
                <span className="text-base">{detectedCountry.flag}</span>
                <span className="text-xs">{detectedCountry.country}</span>
              </span>
            )}
            
            {formData.contact && !detectedCountry && (
              <span className={`absolute right-0 top-3 transition-all duration-200 ${
                isContactValid === true ? 'opacity-100' : 'opacity-0'
              }`}>
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/20 text-green-500">
                  <CheckIcon />
                </span>
              </span>
            )}

            {formData.contact && isContactValid === false && (
              <span className="absolute left-0 -bottom-5 text-xs text-red-500/70 animate-fade-in">
                {contactType === 'phone' 
                  ? 'Please enter a valid phone number' 
                  : 'Please enter a valid email address'}
              </span>
            )}
          </div>

          <div className="relative">
            <div className={`transition-all duration-200 ${
              focusedField === 'message' ? 'border-gray-600' : 'border-gray-800'
            } border-b`}>
              <div className={`flex items-center gap-1 pb-2 transition-opacity duration-200 ${
                focusedField === 'message' || formData.message ? 'opacity-100' : 'opacity-0'
              }`}>
                <EditorButton 
                  onClick={() => formatText('bold')} 
                  active={activeFormats.bold}
                  title="Bold (Ctrl+B)"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 4a1 1 0 00-1 1v10a1 1 0 001 1h4.5a3.5 3.5 0 001.852-6.49A3.5 3.5 0 0010.5 4H6zm4.5 5H7V6h3.5a1.5 1.5 0 010 3zM7 11h3.5a1.5 1.5 0 010 3H7v-3z"/>
                  </svg>
                </EditorButton>
                
                <EditorButton 
                  onClick={() => formatText('italic')} 
                  active={activeFormats.italic}
                  title="Italic (Ctrl+I)"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 4a1 1 0 011-1h4a1 1 0 110 2h-1.25l-2 10H11a1 1 0 110 2H7a1 1 0 110-2h1.25l2-10H9a1 1 0 01-1-1z"/>
                  </svg>
                </EditorButton>
                
                <EditorButton 
                  onClick={() => formatText('underline')} 
                  active={activeFormats.underline}
                  title="Underline (Ctrl+U)"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 4a1 1 0 011 1v5a3 3 0 11-6 0V5a1 1 0 112 0v5a1 1 0 102 0V5a1 1 0 011-1zM5 15a1 1 0 100 2h10a1 1 0 100-2H5z"/>
                  </svg>
                </EditorButton>
                
                <div className="w-px h-4 bg-gray-700 mx-1" />
                
                <EditorButton 
                  onClick={() => formatText('insertUnorderedList')} 
                  title="Bullet List"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 6a1 1 0 100 2h10a1 1 0 100-2H7zM7 11a1 1 0 100 2h10a1 1 0 100-2H7zM3 7a1 1 0 110-2 1 1 0 010 2zM3 12a1 1 0 110-2 1 1 0 010 2z"/>
                  </svg>
                </EditorButton>
                
                <button
                  type="button"
                  onClick={() => setIsFullScreen(true)}
                  className="ml-auto p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors"
                  title="Expand editor"
                >
                  <ExpandIcon />
                </button>
                
                <span className="text-xs text-gray-600 ml-2">
                  {formData.message.length > 0 && `${formData.message.length} chars`}
                </span>
              </div>

              <div
                ref={editorRef}
                contentEditable
                onInput={handleMessageChange}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                className="w-full h-[120px] overflow-y-auto py-3 bg-transparent text-gray-100 focus:outline-none [&>*]:mb-2 [&>ul]:ml-4 [&>ul]:list-disc scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
                style={{ 
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere'
                }}
                data-scroll-ignore="true"
                suppressContentEditableWarning
              />
            </div>
            
            <label
              className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                formData.message || focusedField === 'message'
                  ? '-top-5 text-xs text-gray-600'
                  : 'top-3 text-base text-gray-500'
              }`}
            >
              Your Message
            </label>

            {formData.message && (
              <span className="absolute right-0 -bottom-5 text-xs text-gray-600 animate-fade-in">
                Draft saved
              </span>
            )}
          </div>

          <div className="pt-8">
            <button
              type="submit"
              disabled={isSubmitting || (formData.contact && !isContactValid) || !formData.message}
              className={`group relative w-full h-12 border border-gray-800 text-gray-300 font-medium overflow-hidden transition-all duration-300 ${
                isSubmitting || (formData.contact && !isContactValid) || !formData.message
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:border-gray-600 hover:text-gray-100'
              }`}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              
              <span className="relative flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></span>
                    <span>Sending</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <SendIcon />
                  </>
                )}
              </span>
            </button>

            {submitStatus === 'success' && (
              <div className="mt-4 text-center text-gray-400 text-sm animate-fade-in">
                Message sent. I'll respond within 24 hours.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mt-4 text-center text-red-500/80 text-sm animate-fade-in">
                Failed to send. Please try again.
              </div>
            )}
          </div>
        </form>

        <div className="mt-16 pt-8 border-t border-gray-900">
          <div className="flex justify-center items-center gap-8">
            <a 
              href="https://github.com/Zenn1t" 
              className="text-gray-600 hover:text-gray-400 transition-colors text-sm"
            >
              GitHub
            </a>
            <span className="text-gray-800">•</span>
            <a 
              href="https://t.me/yourchannel" 
              className="text-gray-600 hover:text-gray-400 transition-colors text-sm"
            >
              Telegram
            </a>
            <span className="text-gray-800">•</span>
            <a 
              href="mailto:mnx.private.dev@gmail.com" 
              className="text-gray-600 hover:text-gray-400 transition-colors text-sm"
            >
              Email
            </a>
          </div>
        </div>
      </div>

      <FullScreenEditor
        isOpen={isFullScreen}
        onClose={() => setIsFullScreen(false)}
        editorRef={editorRef}
        messageHtml={messageHtml}
        onMessageChange={handleMessageChange}
        activeFormats={activeFormats}
        formatText={formatText}
      />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        /* Custom scrollbar styles */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thumb-gray-700::-webkit-scrollbar-thumb {
          background-color: #374151;
          border-radius: 3px;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </section>
  );
}