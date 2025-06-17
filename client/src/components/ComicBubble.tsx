import { ReactNode } from 'react';

interface ComicBubbleProps {
  children: ReactNode;
  isUser?: boolean;
  className?: string;
}

export function ComicBubble({ children, isUser = false, className = '' }: ComicBubbleProps) {
  const bubbleId = `bubble-${Math.random().toString(36).substr(2, 9)}`;
  
  // Generate slightly randomized organic shapes for each bubble
  const wobbleOffset = () => Math.random() * 4 - 2;
  const rotation = Math.random() * 3 - 1.5;
  
  return (
    <div className={`relative comic-bubble ${className}`}>
      {/* SVG Speech Bubble Background */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 320 180"
        preserveAspectRatio="none"
        style={{ zIndex: -1 }}
      >
        <defs>
          <filter id={`bubble-shadow-${bubbleId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="rgba(0,0,0,0.25)" />
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          </filter>
          <filter id={`inner-shadow-${bubbleId}`}>
            <feOffset dx="1" dy="1"/>
            <feGaussianBlur stdDeviation="2" result="offset-blur"/>
            <feFlood floodColor="rgba(255,255,255,0.8)"/>
            <feComposite in2="offset-blur" operator="in"/>
          </filter>
        </defs>
        
        {isUser ? (
          // User bubble (right side, blue-ish) - More organic hand-drawn shape
          <g>
            <path
              d={`M${25 + wobbleOffset()} ${45 + wobbleOffset()} 
                 Q${18 + wobbleOffset()} ${28 + wobbleOffset()} ${38 + wobbleOffset()} ${22 + wobbleOffset()} 
                 L${255 + wobbleOffset()} ${18 + wobbleOffset()} 
                 Q${288 + wobbleOffset()} ${24 + wobbleOffset()} ${287 + wobbleOffset()} ${42 + wobbleOffset()} 
                 L${292 + wobbleOffset()} ${125 + wobbleOffset()} 
                 Q${286 + wobbleOffset()} ${148 + wobbleOffset()} ${268 + wobbleOffset()} ${152 + wobbleOffset()} 
                 L${85 + wobbleOffset()} ${157 + wobbleOffset()} 
                 Q${62 + wobbleOffset()} ${153 + wobbleOffset()} ${58 + wobbleOffset()} ${138 + wobbleOffset()} 
                 L${52 + wobbleOffset()} ${95 + wobbleOffset()} 
                 Q${48 + wobbleOffset()} ${82 + wobbleOffset()} ${43 + wobbleOffset()} ${88 + wobbleOffset()} 
                 L${28 + wobbleOffset()} ${98 + wobbleOffset()} 
                 Q${17 + wobbleOffset()} ${87 + wobbleOffset()} ${22 + wobbleOffset()} ${78 + wobbleOffset()} Z`}
              fill="#E8F4FD"
              stroke="#2196F3"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#bubble-shadow-${bubbleId})`}
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: 'center'
              }}
            />
            {/* Tail pointing right - more organic */}
            <path
              d={`M${272 + wobbleOffset()} ${138 + wobbleOffset()} 
                 Q${287 + wobbleOffset()} ${152 + wobbleOffset()} ${296 + wobbleOffset()} ${143 + wobbleOffset()} 
                 Q${293 + wobbleOffset()} ${165 + wobbleOffset()} ${278 + wobbleOffset()} ${148 + wobbleOffset()} Z`}
              fill="#E8F4FD"
              stroke="#2196F3"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        ) : (
          // AI bubble (left side, cream/orange) - More organic hand-drawn shape
          <g>
            <path
              d={`M${28 + wobbleOffset()} ${38 + wobbleOffset()} 
                 Q${22 + wobbleOffset()} ${22 + wobbleOffset()} ${42 + wobbleOffset()} ${18 + wobbleOffset()} 
                 L${265 + wobbleOffset()} ${22 + wobbleOffset()} 
                 Q${285 + wobbleOffset()} ${28 + wobbleOffset()} ${282 + wobbleOffset()} ${48 + wobbleOffset()} 
                 L${287 + wobbleOffset()} ${128 + wobbleOffset()} 
                 Q${281 + wobbleOffset()} ${150 + wobbleOffset()} ${258 + wobbleOffset()} ${153 + wobbleOffset()} 
                 L${75 + wobbleOffset()} ${158 + wobbleOffset()} 
                 Q${52 + wobbleOffset()} ${154 + wobbleOffset()} ${48 + wobbleOffset()} ${138 + wobbleOffset()} 
                 L${42 + wobbleOffset()} ${88 + wobbleOffset()} 
                 Q${38 + wobbleOffset()} ${78 + wobbleOffset()} ${33 + wobbleOffset()} ${83 + wobbleOffset()} 
                 L${18 + wobbleOffset()} ${93 + wobbleOffset()} 
                 Q${7 + wobbleOffset()} ${83 + wobbleOffset()} ${12 + wobbleOffset()} ${73 + wobbleOffset()} Z`}
              fill="#FBE4BC"
              stroke="#E6A547"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#bubble-shadow-${bubbleId})`}
              style={{
                transform: `rotate(${-rotation}deg)`,
                transformOrigin: 'center'
              }}
            />
            {/* Tail pointing left - more organic */}
            <path
              d={`M${32 + wobbleOffset()} ${128 + wobbleOffset()} 
                 Q${17 + wobbleOffset()} ${143 + wobbleOffset()} ${8 + wobbleOffset()} ${133 + wobbleOffset()} 
                 Q${12 + wobbleOffset()} ${155 + wobbleOffset()} ${27 + wobbleOffset()} ${138 + wobbleOffset()} Z`}
              fill="#FBE4BC"
              stroke="#E6A547"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Inner highlight for depth */}
            <ellipse
              cx="160"
              cy="70"
              rx="80"
              ry="25"
              fill="rgba(255,255,255,0.3)"
              style={{
                transform: `rotate(${rotation * 0.5}deg)`,
                transformOrigin: 'center'
              }}
            />
          </g>
        )}
      </svg>
      
      {/* Content */}
      <div className={`relative z-10 p-5 ${isUser ? 'pr-8' : 'pl-8'}`}>
        {children}
      </div>
    </div>
  );
}