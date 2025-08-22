'use client';
import React, { useState } from 'react';

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

export default function ContactSection({ activeIndex }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
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
            />
            <label
              htmlFor="name"
              className={`absolute left-0 transition-all duration-200 ${
                formData.name || focusedField === 'name'
                  ? '-top-5 text-xs text-gray-600'
                  : 'top-3 text-base text-gray-500'
              } pointer-events-none`}
            >
              Name
            </label>
          </div>

          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-800 text-gray-100 placeholder-transparent focus:outline-none focus:border-gray-600 transition-colors peer"
              placeholder="Email"
            />
            <label
              htmlFor="email"
              className={`absolute left-0 transition-all duration-200 ${
                formData.email || focusedField === 'email'
                  ? '-top-5 text-xs text-gray-600'
                  : 'top-3 text-base text-gray-500'
              } pointer-events-none`}
            >
              Email
            </label>
          </div>

          <div className="relative">
            <textarea
              id="message"
              name="message"
              required
              rows={1}
              value={formData.message}
              onChange={handleChange}
              onFocus={() => setFocusedField('message')}
              onBlur={() => setFocusedField(null)}
              className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-800 text-gray-100 placeholder-transparent focus:outline-none focus:border-gray-600 transition-colors resize-none"
              placeholder="Message"
              style={{
                minHeight: '48px',
                height: formData.message ? 'auto' : '48px'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
            <label
              htmlFor="message"
              className={`absolute left-0 transition-all duration-200 ${
                formData.message || focusedField === 'message'
                  ? '-top-5 text-xs text-gray-600'
                  : 'top-3 text-base text-gray-500'
              } pointer-events-none`}
            >
              Message
            </label>
          </div>

          <div className="pt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full h-12 border border-gray-800 text-gray-300 font-medium overflow-hidden transition-all duration-300 ${
                isSubmitting 
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
      `}</style>
    </section>
  );
}