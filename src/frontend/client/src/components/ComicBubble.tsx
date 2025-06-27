import { ReactNode } from 'react';

interface ComicBubbleProps {
  children: ReactNode;
  isUser?: boolean;
  className?: string;
}

export function ComicBubble({ children, isUser = false, className = '' }: ComicBubbleProps) {
  const bubbleId = `bubble-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`relative inline-block ${className}`}>
      {/* Content container to measure text size */}
      <div 
        className={`relative bg-background border-4 border-black p-4 ${
          isUser ? 'ml-4' : 'mr-4'
        }`}
        style={{
          borderRadius: '20px',
          minWidth: '120px',
          maxWidth: '280px'
        }}
      >
        {/* Halftone shadow pattern matching the reference */}
        <div 
          className="absolute -bottom-2 -right-2 w-full h-full border-4 border-black -z-10"
          style={{
            borderRadius: '20px',
            backgroundImage: `
              radial-gradient(circle at 25% 25%, black 1.5px, transparent 1.5px),
              radial-gradient(circle at 75% 75%, black 1px, transparent 1px)
            `,
            backgroundSize: '8px 8px, 6px 6px',
            backgroundPosition: '0 0, 4px 4px'
          }}
        />
        
        {/* Speech bubble tail */}
        <div
          className={`absolute ${
            isUser 
              ? '-right-3 bottom-6' 
              : '-left-3 bottom-6'
          } w-0 h-0`}
          style={{
            borderStyle: 'solid',
            ...(isUser ? {
              borderWidth: '0 0 20px 20px',
              borderColor: 'transparent transparent #ffe6b0 transparent',
            } : {
              borderWidth: '0 20px 20px 0',
              borderColor: 'transparent #ffe6b0 transparent transparent',
            })
          }}
        />
        
        {/* Tail border */}
        <div
          className={`absolute ${
            isUser 
              ? '-right-4 bottom-5' 
              : '-left-4 bottom-5'
          } w-0 h-0`}
          style={{
            borderStyle: 'solid',
            ...(isUser ? {
              borderWidth: '0 0 22px 22px',
              borderColor: 'transparent transparent black transparent',
            } : {
              borderWidth: '0 22px 22px 0',
              borderColor: 'transparent black transparent transparent',
            })
          }}
        />
        
        {/* Tail halftone shadow */}
        <div
          className={`absolute ${
            isUser 
              ? '-right-1 bottom-3' 
              : '-left-1 bottom-3'
          } w-4 h-4`}
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, black 1.5px, transparent 1.5px),
              radial-gradient(circle at 75% 75%, black 1px, transparent 1px)
            `,
            backgroundSize: '8px 8px, 6px 6px',
            backgroundPosition: '0 0, 4px 4px',
            clipPath: isUser 
              ? 'polygon(0% 100%, 100% 100%, 100% 0%)'
              : 'polygon(0% 0%, 0% 100%, 100% 100%)'
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