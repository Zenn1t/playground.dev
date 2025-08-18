'use client';
import React, { useState, useEffect, useRef } from 'react';

interface Token {
  text: string;
  type: string;
}

const Portfolio = () => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [highlightedLines, setHighlightedLines] = useState<Token[][]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  const lineHeight = 12;
  const getScrollOffset = () => {
    if (!terminalRef.current) return 0;
    
    const terminalHeight = terminalRef.current.clientHeight;
    const visibleLines = Math.floor(terminalHeight / lineHeight) - 2;
    
    return Math.max(0, (currentLineIndex - visibleLines) * lineHeight);
  };
  
  const scrollOffset = getScrollOffset();
  
  const codeLines = [
    'from fastapi import FastAPI, HTTPException',
    'from sqlalchemy.orm import Session',
    'from typing import Dict, Any, Optional',
    'import stripe',
    'import logging',
    '',
    'logger = logging.getLogger(__name__)',
    '',
    'class PaymentService:',
    '    """Handle all payment operations through Stripe"""',
    '    ',
    '    def __init__(self, db: Session):',
    '        self.db = db',
    '        self.stripe = stripe',
    '        self.stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")',
    '        ',
    '    async def process_payment(',
    '        self, ',
    '        amount: float, ',
    '        currency: str = "usd",',
    '        metadata: Optional[Dict[str, Any]] = None',
    '    ) -> Dict[str, Any]:',
    '        """',
    '        Process payment through Stripe API',
    '        ',
    '        Args:',
    '            amount: Payment amount in base currency units',
    '            currency: Three-letter ISO currency code',
    '            metadata: Additional payment metadata',
    '            ',
    '        Returns:',
    '            Dict containing client_secret and payment_intent_id',
    '        """',
    '        try:',
    '            # Create payment intent with idempotency key',
    '            intent = await self.stripe.PaymentIntent.create(',
    '                amount=int(amount * 100),',
    '                currency=currency.lower(),',
    '                automatic_payment_methods={"enabled": True},',
    '                metadata=metadata or {},',
    '                idempotency_key=self._generate_idempotency_key()',
    '            )',
    '            ',
    '            # Log successful intent creation',
    '            logger.info(f"Payment intent created: {intent.id}")',
    '            ',
    '            # Store payment record in database',
    '            payment_record = PaymentRecord(',
    '                intent_id=intent.id,',
    '                amount=amount,',
    '                currency=currency,',
    '                status="pending",',
    '                created_at=datetime.utcnow()',
    '            )',
    '            self.db.add(payment_record)',
    '            await self.db.commit()',
    '            ',
    '            return {',
    '                "client_secret": intent.client_secret,',
    '                "payment_intent_id": intent.id,',
    '                "amount": amount,',
    '                "currency": currency',
    '            }',
    '            ',
    '        except stripe.error.StripeError as e:',
    '            logger.error(f"Stripe error: {str(e)}")',
    '            raise HTTPException(',
    '                status_code=400, ',
    '                detail=f"Payment processing failed: {str(e)}"',
    '            )',
    '        except Exception as e:',
    '            logger.error(f"Unexpected error: {str(e)}")',
    '            await self.db.rollback()',
    '            raise HTTPException(',
    '                status_code=500,',
    '                detail="Internal server error"',
    '            )',
  ];

  const getTokens = (line: string): Token[] => {
    const leadingSpaces = line.match(/^(\s*)/)?.[1] || '';
    const content = line.trim();
    
    if (!content) return [{ text: leadingSpaces, type: 'text' }];
    
    const tokens: Token[] = [];
    let remaining = content;
    
    const patterns = [
      { regex: /^(from|import|class|def|async|await|try|except|return|raise|if|else|for|in|with|as|is|not|and|or|True|False|None|self)\b/, type: 'keyword' },
      { regex: /^("[^"]*"|'[^']*')/, type: 'string' },
      { regex: /^(#.*$|""".*""")/, type: 'comment' },
      { regex: /^\b(\d+)\b/, type: 'number' },
      { regex: /^(Dict|Any|Optional|str|float|int|bool|List|Tuple|Session)\b/, type: 'type' },
      { regex: /^(\w+)/, type: 'text' },
      { regex: /^(\W+)/, type: 'text' }
    ];
    
    if (leadingSpaces) {
      tokens.push({ text: leadingSpaces, type: 'text' });
    }
    
    while (remaining.length > 0) {
      let matched = false;
      
      for (const pattern of patterns) {
        const match = remaining.match(pattern.regex);
        if (match) {
          tokens.push({ text: match[1], type: pattern.type });
          remaining = remaining.slice(match[0].length);
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        tokens.push({ text: remaining[0], type: 'text' });
        remaining = remaining.slice(1);
      }
    }
    
    return tokens;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentLineIndex < codeLines.length) {
        const currentLine = codeLines[currentLineIndex];
        
        if (currentCharIndex <= currentLine.length) {
          if (currentCharIndex === 0) {
            setDisplayedLines(prev => [...prev, currentLine.slice(0, currentCharIndex)]);
          } else {
            setDisplayedLines(prev => {
              const newLines = [...prev];
              newLines[newLines.length - 1] = currentLine.slice(0, currentCharIndex);
              return newLines;
            });
          }
          
          if (currentCharIndex === currentLine.length) {
            const completedLine = codeLines[currentLineIndex];
            setHighlightedLines(prev => {
              const newHighlighted = [...prev];
              newHighlighted[currentLineIndex] = getTokens(completedLine);
              return newHighlighted;
            });
            
            setCurrentLineIndex(prev => prev + 1);
            setCurrentCharIndex(0);
          } else {
            setCurrentCharIndex(prev => prev + 1);
          }
        }
      } else {
        setDisplayedLines([]);
        setHighlightedLines([]);
        setCurrentLineIndex(0);
        setCurrentCharIndex(0);
      }
    }, 20); 

    return () => clearTimeout(timer);
  }, [currentLineIndex, currentCharIndex, codeLines]);

  return (
    <div 
      className="min-h-screen bg-black text-white font-mono relative overflow-hidden select-none" 
      style={{ 
        transform: 'scale(var(--zoom, 1))', 
        transformOrigin: 'top left',
        width: 'calc(100% / var(--zoom, 1))',
        height: 'calc(100% / var(--zoom, 1))'
      }}
      onWheel={(e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const currentZoom = parseFloat(getComputedStyle(e.currentTarget).getPropertyValue('--zoom') || '1');
          const delta = e.deltaY > 0 ? -0.1 : 0.1;
          const newZoom = Math.max(0.5, Math.min(2, currentZoom + delta));
          e.currentTarget.style.setProperty('--zoom', newZoom.toString());
        }
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-orange-500/10 via-orange-500/5 to-transparent"></div>
      </div>
      
      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
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
            
            <div className="w-full lg:w-96 lg:ml-12 border border-gray-900 rounded-sm bg-gray-950/80" style={{ overflow: 'hidden' }}>
              <div className="border-b border-gray-900 px-4 py-2 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                <span className="ml-4 text-xs text-gray-700">payment_service.py</span>
              </div>
              
              <div 
                ref={terminalRef}
                className="p-3 font-mono h-64 md:h-80 relative"
                style={{ 
                  fontSize: '10px',
                  lineHeight: '12px',
                  overflow: 'hidden'
                }}
              >
                <div 
                  style={{ 
                    whiteSpace: 'pre', 
                    color: '#9ca3af',
                    transform: `translateY(-${scrollOffset}px)`,
                    transition: 'transform 0.2s ease-out'
                  }}
                >
                  {displayedLines.map((line, i) => {
                    const isCompleted = highlightedLines[i];
                    
                    return (
                      <div key={i}>
                        {isCompleted ? (
                          isCompleted.map((token: Token, j: number) => (
                            <span
                              key={j}
                              style={{
                                color: token.type === 'keyword' ? '#f87171' :
                                      token.type === 'string' ? '#4ade80' :
                                      token.type === 'comment' ? '#6b7280' :
                                      token.type === 'number' ? '#fbbf24' :
                                      token.type === 'type' ? '#60a5fa' :
                                      '#9ca3af'
                              }}
                            >
                              {token.text}
                            </span>
                          ))
                        ) : (
                          <span>{line}</span>
                        )}
                        {i === displayedLines.length - 1 && !isCompleted && (
                          <span className="animate-pulse" style={{ color: '#fb923c' }}>▊</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-900 rounded-sm p-6 bg-black/50 backdrop-blur-sm">
            <div className="text-gray-700 text-center py-12">
              [ Next Section ]
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Portfolio;