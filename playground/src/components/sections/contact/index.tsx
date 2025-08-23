'use client';
import React, { useState, useEffect, useRef } from 'react';
import { parsePhoneNumberFromString, getCountries, getCountryCallingCode } from 'libphonenumber-js';

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
      d="M6 18L18 6M6 6l12 12" 
    />
  </svg>
);

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
    className={`p-1 sm:p-1.5 rounded transition-colors ${
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
  editorRef: React.RefObject<HTMLDivElement | null>;
  messageHtml: string;
  onMessageChange: (html: string) => void;
  activeFormats: { bold: boolean; italic: boolean; underline: boolean };
  formatText: (command: string) => void;
}) => {
  const modalEditorRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen && modalEditorRef.current) {
      modalEditorRef.current.innerHTML = messageHtml;
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(modalEditorRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
      modalEditorRef.current.focus();
    }
  }, [isOpen, messageHtml]);

  const handleModalMessageChange = () => {
    if (modalEditorRef.current) {
      const html = modalEditorRef.current.innerHTML;
      onMessageChange(html);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 animate-modal-backdrop">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      <div className={`relative w-full ${
        isMobile 
          ? 'h-[70vh] rounded-t-xl' 
          : 'max-w-4xl h-[80vh] sm:h-[70vh] md:h-[80vh] rounded-xl'
      } bg-gray-950 border border-gray-800 flex flex-col animate-modal-slide shadow-2xl shadow-black/50`}>
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-800">
          <h3 className="text-base sm:text-lg font-medium text-gray-200">Compose Message</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-800/50"
            title="Close (Esc)"
          >
            <MinimizeIcon />
          </button>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1 px-4 sm:px-6 py-2 sm:py-3 border-b border-gray-800 overflow-x-auto">
          <EditorButton 
            onClick={() => {
              document.execCommand('bold', false);
              handleModalMessageChange();
            }} 
            active={activeFormats.bold}
            title="Bold (Ctrl+B)"
          >
            <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
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
            <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
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
            <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 4a1 1 0 011 1v5a3 3 0 11-6 0V5a1 1 0 112 0v5a1 1 0 102 0V5a1 1 0 011-1zM5 15a1 1 0 100 2h10a1 1 0 100-2H5z"/>
            </svg>
          </EditorButton>
        </div>

        <div className="flex-1 overflow-hidden px-4 sm:px-6 py-3 sm:py-4">
          <div
            ref={modalEditorRef}
            contentEditable
            onInput={handleModalMessageChange}
            className="w-full h-full overflow-y-auto text-sm sm:text-base text-gray-100 focus:outline-none selection-bg"
            style={{ 
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
              WebkitUserSelect: 'text',
              userSelect: 'text'
            }}
            data-scroll-ignore="true"
            suppressContentEditableWarning
          />
        </div>

        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-800">
          <span className="text-xs text-gray-600 hidden sm:block">
            Press Esc to close • Changes are saved automatically
          </span>
          <span className="text-xs text-gray-600 sm:hidden">
            Changes saved
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors"
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
  const [phoneCountry, setPhoneCountry] = useState<string | null>(null);
  const [formattedPhone, setFormattedPhone] = useState<string>('');
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
    const value = formData.contact.trim();
    
    if (!value) {
      setContactType(null);
      setIsContactValid(null);
      setPhoneCountry(null);
      setFormattedPhone('');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.includes('@')) {
      setContactType('email');
      setIsContactValid(emailPattern.test(value));
      setPhoneCountry(null);
      setFormattedPhone('');
      return;
    }

    try {
      const phoneValue = value.startsWith('+') ? value : `+${value}`;
      const phoneNumber = parsePhoneNumberFromString(phoneValue);
      
      if (phoneNumber) {
        setContactType('phone');
        setIsContactValid(phoneNumber.isValid());
        setPhoneCountry(phoneNumber.country || null);
        setFormattedPhone(phoneNumber.formatInternational());
      } else {
        setContactType('phone');
        setIsContactValid(false);
        setPhoneCountry(null);
        setFormattedPhone('');
      }
    } catch (error) {
      setContactType('phone');
      setIsContactValid(false);
      setPhoneCountry(null);
      setFormattedPhone('');
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

  const handleModalMessageChange = (html: string) => {
    setMessageHtml(html);
    if (editorRef.current) {
      editorRef.current.innerHTML = html;
    }
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.innerText || tempDiv.textContent || '';
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
          contactType,
          formattedPhone: contactType === 'phone' ? formattedPhone : undefined,
          phoneCountry
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
      className={`min-h-screen w-screen relative px-4 md:px-8 py-12 sm:py-16 md:py-24 flex items-center justify-center transition-all duration-700 ${
        activeIndex >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="max-w-xl w-full mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-gray-100">
            Get In Touch
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Let's build something amazing together
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
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
              className="w-full px-0 py-2 sm:py-3 bg-transparent border-0 border-b border-gray-800 text-gray-100 placeholder-transparent focus:outline-none focus:border-gray-600 transition-colors peer selection-bg text-sm sm:text-base"
              placeholder="Name"
              autoComplete="name"
            />
            <label
              htmlFor="name"
              className={`absolute left-0 transition-all duration-200 ${
                formData.name || focusedField === 'name'
                  ? '-top-5 text-xs text-gray-600'
                  : 'top-2 sm:top-3 text-sm sm:text-base text-gray-500'
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
              className={`w-full px-0 py-2 sm:py-3 bg-transparent border-0 border-b ${getBorderColor()} text-gray-100 placeholder-transparent focus:outline-none transition-all duration-200 peer selection-bg text-sm sm:text-base`}
              placeholder="Email or Phone"
              autoComplete="email tel"
            />
            <label
              htmlFor="contact"
              className={`absolute left-0 transition-all duration-200 ${
                formData.contact || focusedField === 'contact'
                  ? '-top-5 text-xs'
                  : 'top-2 sm:top-3 text-sm sm:text-base'
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
            
            {phoneCountry && isContactValid && (
              <span className="absolute right-0 top-2 sm:top-3 flex items-center gap-1.5 text-sm text-gray-500 animate-fade-in">
                <img 
                  src={`https://flagcdn.com/24x18/${phoneCountry.toLowerCase()}.png`}
                  alt={`${phoneCountry} flag`}
                  className="w-5 h-4 object-cover rounded-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-xs hidden sm:inline">{phoneCountry}</span>
              </span>
            )}
            
            {formData.contact && !phoneCountry && isContactValid === true && (
              <span className="absolute right-0 top-2 sm:top-3 transition-all duration-200">
                <span className="flex items-center justify-center w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-green-500/20 text-green-500">
                  <CheckIcon />
                </span>
              </span>
            )}

            {formattedPhone && isContactValid && focusedField !== 'contact' && (
              <span className="absolute left-0 -bottom-5 text-xs text-gray-600 animate-fade-in">
                {formattedPhone}
              </span>
            )}
          </div>

          <div className="relative">
            <div className={`transition-all duration-200 ${
              focusedField === 'message' ? 'border-gray-600' : 'border-gray-800'
            } border-b`}>
              <div className={`flex items-center gap-0.5 sm:gap-1 pb-1 sm:pb-2 transition-opacity duration-200 ${
                focusedField === 'message' || formData.message ? 'opacity-100' : 'opacity-0'
              }`}>
                <EditorButton 
                  onClick={() => formatText('bold')} 
                  active={activeFormats.bold}
                  title="Bold (Ctrl+B)"
                >
                  <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 4a1 1 0 00-1 1v10a1 1 0 001 1h4.5a3.5 3.5 0 001.852-6.49A3.5 3.5 0 0010.5 4H6zm4.5 5H7V6h3.5a1.5 1.5 0 010 3zM7 11h3.5a1.5 1.5 0 010 3H7v-3z"/>
                  </svg>
                </EditorButton>
                
                <EditorButton 
                  onClick={() => formatText('italic')} 
                  active={activeFormats.italic}
                  title="Italic (Ctrl+I)"
                >
                  <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 4a1 1 0 011-1h4a1 1 0 110 2h-1.25l-2 10H11a1 1 0 110 2H7a1 1 0 110-2h1.25l2-10H9a1 1 0 01-1-1z"/>
                  </svg>
                </EditorButton>
                
                <EditorButton 
                  onClick={() => formatText('underline')} 
                  active={activeFormats.underline}
                  title="Underline (Ctrl+U)"
                >
                  <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 4a1 1 0 011 1v5a3 3 0 11-6 0V5a1 1 0 112 0v5a1 1 0 102 0V5a1 1 0 011-1zM5 15a1 1 0 100 2h10a1 1 0 100-2H5z"/>
                  </svg>
                </EditorButton>
                
                <button
                  type="button"
                  onClick={() => setIsFullScreen(true)}
                  className="ml-auto p-1 sm:p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors"
                  title="Expand editor"
                >
                  <ExpandIcon />
                </button>
                
                <span className="text-xs text-gray-600 ml-1 sm:ml-2 hidden sm:inline">
                  {formData.message.length > 0 && `${formData.message.length} chars`}
                </span>
              </div>

              <div
                ref={editorRef}
                contentEditable
                onInput={handleMessageChange}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                className="w-full h-[100px] sm:h-[120px] overflow-y-auto py-2 sm:py-3 bg-transparent text-gray-100 focus:outline-none scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent selection-bg text-sm sm:text-base"
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
                  : 'top-2 sm:top-3 text-sm sm:text-base text-gray-500'
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

          <div className="pt-6 sm:pt-8">
            <button
              type="submit"
              disabled={isSubmitting || (formData.contact && !isContactValid) || !formData.message}
              className={`group relative w-full h-10 sm:h-12 border border-gray-800 text-gray-300 font-medium overflow-hidden transition-all duration-300 text-sm sm:text-base ${
                isSubmitting || (formData.contact && !isContactValid) || !formData.message
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:border-gray-600 hover:text-gray-100'
              }`}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              
              <span className="relative flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <span className="w-3 sm:w-4 h-3 sm:h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></span>
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
              <div className="mt-3 sm:mt-4 text-center text-gray-400 text-xs sm:text-sm animate-fade-in">
                Message sent. I'll respond within 24 hours.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mt-3 sm:mt-4 text-center text-red-500/80 text-xs sm:text-sm animate-fade-in">
                Failed to send. Please try again.
              </div>
            )}
          </div>
        </form>

        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-900">
          <div className="flex justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm">
            <a 
              href="https://github.com/Zenn1t" 
              className="text-gray-600 hover:text-gray-400 transition-colors"
            >
              GitHub
            </a>
            <span className="text-gray-800">•</span>
            <a 
              href="https://t.me/yourchannel" 
              className="text-gray-600 hover:text-gray-400 transition-colors"
            >
              Telegram
            </a>
            <span className="text-gray-800">•</span>
            <a 
              href="mailto:mnx.private.dev@gmail.com" 
              className="text-gray-600 hover:text-gray-400 transition-colors"
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
        onMessageChange={handleModalMessageChange}
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
        
        @keyframes modal-backdrop {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes modal-slide {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-modal-backdrop {
          animation: modal-backdrop 0.2s ease-out;
        }
        
        .animate-modal-slide {
          animation: modal-slide 0.3s cubic-bezier(0.16, 1, 0.3, 1);
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
        
        /* Custom text selection color */
        .selection-bg::selection {
          background-color: rgba(147, 51, 234, 0.3);
          color: #f3f4f6;
        }
        
        .selection-bg::-moz-selection {
          background-color: rgba(147, 51, 234, 0.3);
          color: #f3f4f6;
        }
        
        .selection-bg *::selection {
          background-color: rgba(147, 51, 234, 0.3);
          color: #f3f4f6;
        }
        
        .selection-bg *::-moz-selection {
          background-color: rgba(147, 51, 234, 0.3);
          color: #f3f4f6;
        }
      `}</style>
    </section>
  );
}