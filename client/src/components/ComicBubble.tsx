import { ReactNode } from 'react';

interface ComicBubbleProps {
  children: ReactNode;
  isUser?: boolean;
  className?: string;
}

export function ComicBubble({ children, isUser = false, className = '' }: ComicBubbleProps) {
  const bubbleId = `bubble-${Math.random().toString(36).substr(2, 9)}`;
  
  // Select a random bubble style from the comic book collection
  const bubbleStyles = isUser ? [
    // User bubbles (right-aligned, blue theme)
    {
      path: "M40 30 Q35 15 55 12 L280 10 Q300 15 298 35 L300 110 Q295 130 275 132 L90 135 Q70 130 65 115 L60 80 Q55 70 50 75 L35 85 Q25 75 30 65 Z",
      tail: "M275 115 Q290 130 300 120 Q295 140 280 125 Z",
      rotation: -0.5
    },
    {
      path: "M45 35 Q40 20 60 17 L275 15 Q295 20 293 40 L295 115 Q290 135 270 137 L95 140 Q75 135 70 120 L65 85 Q60 75 55 80 L40 90 Q30 80 35 70 Z",
      tail: "M270 120 Q285 135 295 125 Q290 145 275 130 Z",
      rotation: 0.8
    }
  ] : [
    // AI bubbles (left-aligned, cream/orange theme)
    {
      path: "M30 35 Q25 18 45 15 L270 12 Q290 18 288 38 L292 118 Q287 138 267 140 L75 143 Q55 138 50 123 L45 88 Q40 78 35 83 L20 93 Q10 83 15 73 Z",
      tail: "M35 118 Q20 133 10 123 Q15 143 30 128 Z",
      rotation: 1.2
    },
    {
      path: "M35 40 Q30 22 50 18 L275 16 Q295 22 292 42 L296 122 Q291 142 271 144 L80 147 Q60 142 55 127 L50 92 Q45 82 40 87 L25 97 Q15 87 20 77 Z",
      tail: "M40 122 Q25 137 15 127 Q20 147 35 132 Z",
      rotation: -1.5
    },
    {
      path: "M32 38 Q27 20 47 16 L272 14 Q292 20 290 40 L294 120 Q289 140 269 142 L77 145 Q57 140 52 125 L47 90 Q42 80 37 85 L22 95 Q12 85 17 75 Z",
      tail: "M37 120 Q22 135 12 125 Q17 145 32 130 Z",
      rotation: 0.3
    }
  ];
  
  const selectedStyle = bubbleStyles[Math.floor(Math.random() * bubbleStyles.length)];
  
  return (
    <div className={`relative comic-bubble ${className}`}>
      {/* SVG Speech Bubble Background - Authentic Comic Book Style */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 320 160"
        preserveAspectRatio="none"
        style={{ zIndex: -1 }}
      >
        <defs>
          {/* Halftone pattern for authentic comic book effect */}
          <pattern id={`halftone-${bubbleId}`} patternUnits="userSpaceOnUse" width="8" height="8">
            <circle cx="2" cy="2" r="1" fill="rgba(0,0,0,0.1)" />
            <circle cx="6" cy="2" r="0.8" fill="rgba(0,0,0,0.08)" />
            <circle cx="2" cy="6" r="0.6" fill="rgba(0,0,0,0.06)" />
            <circle cx="6" cy="6" r="1.2" fill="rgba(0,0,0,0.12)" />
          </pattern>
          
          {/* Comic book shadow effect */}
          <filter id={`comic-shadow-${bubbleId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="4" dy="6" stdDeviation="3" floodColor="rgba(0,0,0,0.4)" />
          </filter>
          
          {/* Hand-drawn stroke effect */}
          <filter id={`rough-paper-${bubbleId}`}>
            <feTurbulence baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
          </filter>
        </defs>
        
        {isUser ? (
          // User bubble - Blue comic style
          <g>
            <path
              d={selectedStyle.path}
              fill="white"
              stroke="black"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#comic-shadow-${bubbleId})`}
              style={{
                transform: `rotate(${selectedStyle.rotation}deg)`,
                transformOrigin: 'center'
              }}
            />
            {/* Halftone shading */}
            <path
              d={selectedStyle.path}
              fill={`url(#halftone-${bubbleId})`}
              style={{
                transform: `rotate(${selectedStyle.rotation}deg)`,
                transformOrigin: 'center'
              }}
            />
            {/* Tail */}
            <path
              d={selectedStyle.tail}
              fill="white"
              stroke="black"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        ) : (
          // AI bubble - Cream/white comic style  
          <g>
            <path
              d={selectedStyle.path}
              fill="#FBE4BC"
              stroke="black"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#comic-shadow-${bubbleId})`}
              style={{
                transform: `rotate(${selectedStyle.rotation}deg)`,
                transformOrigin: 'center'
              }}
            />
            {/* Halftone shading for depth */}
            <path
              d={selectedStyle.path}
              fill={`url(#halftone-${bubbleId})`}
              style={{
                transform: `rotate(${selectedStyle.rotation}deg)`,
                transformOrigin: 'center'
              }}
            />
            {/* Tail */}
            <path
              d={selectedStyle.tail}
              fill="#FBE4BC"
              stroke="black"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Inner highlight typical of comic bubbles */}
            <ellipse
              cx="160"
              cy="60"
              rx="60"
              ry="15"
              fill="rgba(255,255,255,0.6)"
              style={{
                transform: `rotate(${selectedStyle.rotation * 0.3}deg)`,
                transformOrigin: 'center'
              }}
            />
          </g>
        )}
      </svg>
      
      {/* Content */}
      <div className={`relative z-10 p-6 ${isUser ? 'pr-10' : 'pl-10'}`}>
        {children}
      </div>
    </div>
  );
}