'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { codeLines } from './constants';

type Language = 'python' | 'cpp' | 'js' | 'ts' | 'json' | 'bash';

interface Token {
  text: string;
  type: 'keyword' | 'string' | 'comment' | 'number' | 'type' | 'text' | 'operator';
}

type FileSpec = { name: string; language: Language; lines: string[] };

interface CodeTerminalProps {
  files?: FileSpec[];
  typingSpeed?: number;
  betweenFilesDelay?: number;
  restartDelay?: number;
  lineHeightPx?: number;
}

export default function CodeTerminal({
  files,
  typingSpeed = 20,
  betweenFilesDelay = 800,
  restartDelay = 1200,
  lineHeightPx = 12,
}: CodeTerminalProps) {
  const defaultFiles: FileSpec[] = useMemo(() => {
    const safeLines = Array.isArray(codeLines) ? codeLines : ['# no data'];
    return [{ name: 'payment_service.py', language: 'python', lines: safeLines }];
  }, []);

  const fileList: FileSpec[] = files && files.length > 0 ? files : defaultFiles;

  const languagesAll = useMemo(
    () => Array.from(new Set(fileList.map(f => f.language))),
    [fileList]
  );

  const [fileIdx, setFileIdx] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [highlightedLines, setHighlightedLines] = useState<Token[][]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    isWaitingRef.current = isWaiting;
  }, [isWaiting]);

  const terminalRef = useRef<HTMLDivElement>(null);
  const isWaitingRef = useRef<boolean>(false);

  const activeFile = fileList[fileIdx];
  const activeLang = activeFile.language;
  const lines = activeFile.lines ?? [];

  // console.log('🔍 Debug info:', {
  //   fileIdx,
  //   fileName: activeFile.name,
  //   totalFiles: fileList.length,
  //   currentLineIndex,
  //   totalLines: lines.length,
  //   currentCharIndex,
  //   isWaiting,
  //   isLastFile: fileIdx === fileList.length - 1
  // });

const getScrollOffsetValue = () => {
  if (!terminalRef.current) return 0;
  const terminalHeight = terminalRef.current.clientHeight;
  const visibleLines = Math.floor(terminalHeight / lineHeightPx);

  if (currentLineIndex < visibleLines) {
    return 0;
  }

  return (currentLineIndex - visibleLines + 1) * lineHeightPx;
};


  const getPythonPatterns = () => ([
    { regex: /^((?:from|import|class|def|async|await|try|except|return|raise|if|elif|else|for|in|while|with|as|is|not|and|or|True|False|None|self|pass|yield|lambda|global|nonlocal))\b/, type: 'keyword' as const },
    { regex: /^("([^"\\]|\\.)*"|'([^'\\]|\\.)*')/, type: 'string' as const },
    { regex: /^(#.*$|""".*?"""|'''.*?''')/, type: 'comment' as const },
    { regex: /^(\b\d+(?:\.\d+)?\b)/, type: 'number' as const },
    { regex: /^((?:Dict|Any|Optional|str|float|int|bool|List|Tuple|Set|Session))\b/, type: 'type' as const },
    { regex: /^([A-Za-z_]\w*)/, type: 'text' as const },
    { regex: /^([\[\]{}().,:;+\-*/%=&|^!~<>?]+)/, type: 'operator' as const },
    { regex: /^(\s+)/, type: 'text' as const },
  ]);

  const getCppPatterns = () => ([
    { regex: /^((?:alignas|alignof|asm|auto|bool|break|case|catch|char|class|const|constexpr|const_cast|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|false|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|true|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while))\b/, type: 'keyword' as const },
    { regex: /^((?:std::)?(?:string|vector|map|unordered_map|set|unordered_set|unique_ptr|shared_ptr|optional|tuple|array|deque|list))\b/, type: 'type' as const },
    { regex: /^("([^"\\]|\\.)*"|'([^'\\]|\\.)*')/, type: 'string' as const },
    { regex: /^(\/\/.*$|\/\*.*?\*\/)/, type: 'comment' as const },
    { regex: /^(\b\d+(?:\.\d+)?(?:u|U|l|L|ul|UL|llu|LLU|f|F)?)\b/, type: 'number' as const },
    { regex: /^([A-Za-z_]\w*)/, type: 'text' as const },
    { regex: /^([()[\]{}<>.,;:+\-*/%=&|^!~?:#]+)/, type: 'operator' as const },
    { regex: /^(\s+)/, type: 'text' as const },
  ]);

  const getGenericPatterns = () => ([
    { regex: /^("([^"\\]|\\.)*"|'([^'\\]|\\.)*')/, type: 'string' as const },
    { regex: /^(\/\/.*$|#.*$|\/\*.*?\*\/)/, type: 'comment' as const },
    { regex: /^(\b\d+(?:\.\d+)?\b)/, type: 'number' as const },
    { regex: /^([A-Za-z_]\w*)/, type: 'text' as const },
    { regex: /^([()[\]{}<>.,;:+\-*/%=&|^!~?:]+)/, type: 'operator' as const },
    { regex: /^(\s+)/, type: 'text' as const },
  ]);

  const getPatternsByLang = (lang: Language) => {
    if (lang === 'python') return getPythonPatterns();
    if (lang === 'cpp') return getCppPatterns();
    return getGenericPatterns();
  };

  const getTokens = (line: string, lang: Language): Token[] => {
    const leadingSpaces = line.match(/^(\s*)/)?.[1] ?? '';
    const content = line.slice(leadingSpaces.length);

    const tokens: Token[] = [];
    if (leadingSpaces) tokens.push({ text: leadingSpaces, type: 'text' });

    let remaining = content;
    const patterns = getPatternsByLang(lang);

    while (remaining.length > 0) {
      let matched = false;
      for (const p of patterns) {
        const m = remaining.match(p.regex);
        if (m) {
          tokens.push({ text: m[1] ?? m[0], type: p.type });
          remaining = remaining.slice(m[0].length);
          matched = true;
          break;
        }
      }
      if (!matched) {
        tokens.push({ text: remaining[0], type: 'text' });
        remaining = remaining.slice(1);
      }
    }
    if (tokens.length === 0) tokens.push({ text: '', type: 'text' });
    return tokens;
  };

const [scrollOffset, setScrollOffset] = useState(0);
const scrollOffsetRef = useRef(0);

useEffect(() => {
  const terminal = terminalRef.current;
  if (!terminal) return;

  const terminalHeight = terminal.clientHeight;
  const visibleLines = Math.floor(terminalHeight / lineHeightPx);

  const desiredOffset = Math.max(0, (Math.max(0, displayedLines.length) - visibleLines) * lineHeightPx);

  if (scrollOffsetRef.current === desiredOffset) {
    return;
  }

  let rafId: number;
  const duration = 120; 
  const startTime = performance.now();
  const from = scrollOffsetRef.current;
  const to = desiredOffset;

  const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  function step(now: number) {
    const t = Math.min(1, (now - startTime) / duration);
    const eased = easeInOutQuad(t);
    const next = Math.round(from + (to - from) * eased);
    scrollOffsetRef.current = next;
    setScrollOffset(next);
    if (t < 1) {
      rafId = requestAnimationFrame(step);
    }
  }

  rafId = requestAnimationFrame(step);

  return () => {
    if (rafId) cancelAnimationFrame(rafId);
  };
}, [displayedLines.length, lineHeightPx, terminalRef]);

  useEffect(() => {
    if (isWaiting) {
      // console.log('⏸️ Waiting, skipping typing effect');
      return;
    }

    if (currentLineIndex >= lines.length) {
      return;
    }

    const currentLine = lines[currentLineIndex] ?? '';

    const typingTimer = window.setTimeout(() => {
      if (currentCharIndex === 0) {
        setDisplayedLines(prev => [...prev, currentLine.slice(0, 0)]);
      } else {
        setDisplayedLines(prev => {
          const next = [...prev];
          next[next.length - 1] = currentLine.slice(0, currentCharIndex);
          return next;
        });
      }

      if (currentCharIndex >= currentLine.length) {
        setHighlightedLines(prev => {
          const next = [...prev];
          next[currentLineIndex] = getTokens(currentLine, activeLang);
          return next;
        });
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      } else {
        setCurrentCharIndex(prev => prev + 1);
      }
    }, typingSpeed);

    return () => clearTimeout(typingTimer);
  }, [currentLineIndex, currentCharIndex, isWaiting, lines, activeLang, typingSpeed]);

  const colorOf = (t: Token['type']) =>
    t === 'keyword' ? '#f87171' :
    t === 'string'  ? '#4ade80' :
    t === 'comment' ? '#6b7280' :
    t === 'number'  ? '#fbbf24' :
    t === 'type'    ? '#60a5fa' :
    t === 'operator'? '#c084fc' :
                      '#9ca3af';

  return (
    <div className="w-full lg:w-96 lg:ml-12 border border-gray-900 rounded-sm bg-gray-950/80" style={{ overflow: 'hidden' }}>
      <div className="border-b border-gray-900 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-gray-700"></div>
          <div className="w-3 h-3 rounded-full bg-gray-700"></div>
          <div className="w-3 h-3 rounded-full bg-gray-700"></div>
          <span className="ml-2 text-xs text-gray-700">{activeFile.name}</span>
        </div>

        <div className="flex items-center gap-1">
          {languagesAll.map((lang) => (
            <span
              key={lang}
              className="text-[10px] leading-none px-1.5 py-0.5 rounded-sm border"
              style={{
                borderColor: lang === activeLang ? '#374151' : '#111827',
                background: lang === activeLang ? 'rgba(55,65,81,0.35)' : 'rgba(17,24,39,0.35)',
                color: lang === activeLang ? '#e5e7eb' : '#9ca3af',
              }}
              title={lang.toUpperCase()}
            >
              {lang.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      <div
        ref={terminalRef}
        className="p-3 font-mono h-64 md:h-80 relative"
        style={{
          fontSize: '10px',
          lineHeight: `${lineHeightPx}px`,
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
            const tokens = highlightedLines[i];
            const isLast = i === displayedLines.length - 1;
            const showCursor = isLast && !tokens;

            return (
              <div key={`${fileIdx}-${i}`}>
                {tokens
                  ? tokens.map((tok, j) => (
                      <span key={`${i}-${j}`} style={{ color: colorOf(tok.type) }}>
                        {tok.text}
                      </span>
                    ))
                  : <span>{line}</span>}
                {showCursor && (
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