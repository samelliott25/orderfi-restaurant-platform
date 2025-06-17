import { ReactNode } from 'react';

interface ComicBubbleProps {
  children: ReactNode;
  isUser?: boolean;
  className?: string;
}

export function ComicBubble({ children, isUser = false, className = '' }: ComicBubbleProps) {
  const bubbleId = `bubble-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`relative ${className} max-w-full`}>
      {/* SVG hand-drawn bubble outline */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ zIndex: 0 }}
      >
        <defs>
          {/* Hand-drawn effect filter */}
          <filter id={`roughen-${bubbleId}`}>
            <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.8"/>
          </filter>
        </defs>
        
        {isUser ? (
          // User bubble - right side with tail
          <g>
            <path
              d="M15 25 Q12 15 22 12 L85 10 Q92 15 90 25 L92 65 Q90 75 82 77 L35 80 Q25 77 22 70 L20 50 Q18 45 15 47 L8 52 Q5 47 8 42 Z"
              fill="none"
              stroke="black"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#roughen-${bubbleId})`}
            />
            {/* Tail */}
            <path
              d="M82 65 Q88 72 92 68 Q90 78 85 72 Z"
              fill="none"
              stroke="black"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter={`url(#roughen-${bubbleId})`}
            />
          </g>
        ) : (
          // AI bubble - left side with tail  
          <g>
            <path
              d="M8 25 Q10 15 18 12 L75 10 Q85 15 88 25 L90 65 Q85 75 77 77 L30 80 Q20 77 15 70 L12 50 Q10 45 8 47 L5 52 Q2 47 5 42 Z"
              fill="none"
              stroke="black"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#roughen-${bubbleId})`}
            />
            {/* Tail */}
            <path
              d="M18 65 Q12 72 8 68 Q10 78 15 72 Z"
              fill="none"
              stroke="black"
              strokeWidth="3"
              strokeLinecap="round"
              filter={`url(#roughen-${bubbleId})`}
            />
          </g>
        )}
      </svg>
      
      {/* Content with proper spacing */}
      <div className={`relative z-10 p-4 ${isUser ? 'pr-8 pl-6' : 'pl-8 pr-6'}`}>
        {children}
      </div>
    </div>
  );
}