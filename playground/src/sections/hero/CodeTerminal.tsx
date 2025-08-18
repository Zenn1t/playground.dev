'use client';
import { useState, useEffect, useRef } from 'react';
import { codeLines } from './constants';

interface Token {
  text: string;
  type: string;
}

export default function CodeTerminal() {
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
  }, [currentLineIndex, currentCharIndex]);

  return (
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
  );
}

