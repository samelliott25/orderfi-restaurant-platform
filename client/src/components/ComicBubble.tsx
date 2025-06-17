import { ReactNode } from 'react';

interface ComicBubbleProps {
  children: ReactNode;
  isUser?: boolean;
  className?: string;
}

export function ComicBubble({ children, isUser = false, className = '' }: ComicBubbleProps) {
  // Simplified approach with clean comic book styling
  const rotation = (Math.random() - 0.5) * 4; // -2 to +2 degrees
  
  return (
    <div className={`relative ${className}`} style={{ transform: `rotate(${rotation}deg)` }}>
      {/* Main bubble container with comic styling */}
      <div 
        className={`
          relative p-4 px-6 
          ${isUser 
            ? 'bg-white border-4 border-black ml-8' 
            : 'bg-yellow-50 border-4 border-black mr-8'
          }
          shadow-lg
        `}
        style={{
          borderRadius: isUser 
            ? '25px 25px 8px 25px'  // User: rounded except bottom-left (tail area)
            : '25px 25px 25px 8px',  // AI: rounded except bottom-right (tail area)
          boxShadow: '6px 6px 0px rgba(0,0,0,0.8)',
          backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      >
        {/* Speech bubble tail */}
        <div 
          className={`absolute ${isUser ? '-left-6 bottom-4' : '-right-6 bottom-4'} w-0 h-0`}
          style={{
            borderStyle: 'solid',
            ...(isUser ? {
              borderWidth: '0 20px 20px 0',
              borderColor: 'transparent black transparent transparent',
            } : {
              borderWidth: '0 0 20px 20px', 
              borderColor: 'transparent transparent black transparent',
            })
          }}
        />
        
        {/* Tail fill (to match bubble background) */}
        <div 
          className={`absolute ${isUser ? '-left-5 bottom-4' : '-right-5 bottom-4'} w-0 h-0`}
          style={{
            borderStyle: 'solid',
            ...(isUser ? {
              borderWidth: '0 17px 17px 0',
              borderColor: 'transparent white transparent transparent',
            } : {
              borderWidth: '0 0 17px 17px',
              borderColor: 'transparent transparent #fefce8 transparent',
            })
          }}
        />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}