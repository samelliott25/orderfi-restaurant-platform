
import { useEffect, useState } from 'react';

export default function OrderFiLogo({ className = "" }: { className?: string }) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation after component mounts
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        <svg
          width="400"
          height="120"
          viewBox="0 0 400 120"
          className="text-6xl md:text-7xl lg:text-8xl"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(139, 121, 94, 0.2))' }}
        >
          {/* OrderFi handwritten text paths */}
          <g fill="none" stroke="#8b795e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            {/* O */}
            <path
              d="M 20 60 Q 20 30 40 30 Q 60 30 60 60 Q 60 90 40 90 Q 20 90 20 60"
              className={`handwrite-path ${isAnimating ? 'animate-draw' : ''}`}
              style={{ animationDelay: '0s', animationDuration: '0.8s' }}
            />
            
            {/* r */}
            <path
              d="M 75 90 L 75 45 Q 75 35 85 35 Q 95 35 95 45"
              className={`handwrite-path ${isAnimating ? 'animate-draw' : ''}`}
              style={{ animationDelay: '0.3s', animationDuration: '0.6s' }}
            />
            
            {/* d */}
            <path
              d="M 130 90 Q 110 90 110 70 Q 110 50 130 50 Q 150 50 150 70 L 150 30 L 150 90"
              className={`handwrite-path ${isAnimating ? 'animate-draw' : ''}`}
              style={{ animationDelay: '0.6s', animationDuration: '0.8s' }}
            />
            
            {/* e */}
            <path
              d="M 185 70 L 165 70 Q 165 50 185 50 Q 205 50 205 70 Q 205 90 185 90 Q 165 90 165 70"
              className={`handwrite-path ${isAnimating ? 'animate-draw' : ''}`}
              style={{ animationDelay: '0.9s', animationDuration: '0.7s' }}
            />
            
            {/* r */}
            <path
              d="M 220 90 L 220 45 Q 220 35 230 35 Q 240 35 240 45"
              className={`handwrite-path ${isAnimating ? 'animate-draw' : ''}`}
              style={{ animationDelay: '1.2s', animationDuration: '0.6s' }}
            />
            
            {/* F */}
            <path
              d="M 265 30 L 265 90 M 265 30 L 285 30 M 265 60 L 280 60"
              className={`handwrite-path ${isAnimating ? 'animate-draw' : ''}`}
              style={{ animationDelay: '1.5s', animationDuration: '0.8s' }}
            />
            
            {/* i */}
            <path
              d="M 305 50 L 305 90 M 305 35 L 305 40"
              className={`handwrite-path ${isAnimating ? 'animate-draw' : ''}`}
              style={{ animationDelay: '1.8s', animationDuration: '0.5s' }}
            />
            
            {/* Decorative underline */}
            <path
              d="M 20 100 Q 200 95 380 100"
              className={`handwrite-path ${isAnimating ? 'animate-draw' : ''}`}
              style={{ animationDelay: '2.3s', animationDuration: '1.2s' }}
              strokeWidth="2"
              opacity="0.6"
            />
          </g>
          
          {/* Subtle glow effect */}
          <g className="opacity-30">
            <path
              d="M 20 60 Q 20 30 40 30 Q 60 30 60 60 Q 60 90 40 90 Q 20 90 20 60"
              fill="none"
              stroke="url(#glow)"
              strokeWidth="6"
              className={`${isAnimating ? 'animate-glow' : ''}`}
              style={{ animationDelay: '0s' }}
            />
            <path
              d="M 75 90 L 75 45 Q 75 35 85 35 Q 95 35 95 45"
              fill="none"
              stroke="url(#glow)"
              strokeWidth="6"
              className={`${isAnimating ? 'animate-glow' : ''}`}
              style={{ animationDelay: '0.3s' }}
            />
            <path
              d="M 130 90 Q 110 90 110 70 Q 110 50 130 50 Q 150 50 150 70 L 150 30 L 150 90"
              fill="none"
              stroke="url(#glow)"
              strokeWidth="6"
              className={`${isAnimating ? 'animate-glow' : ''}`}
              style={{ animationDelay: '0.6s' }}
            />
            <path
              d="M 185 70 L 165 70 Q 165 50 185 50 Q 205 50 205 70 Q 205 90 185 90 Q 165 90 165 70"
              fill="none"
              stroke="url(#glow)"
              strokeWidth="6"
              className={`${isAnimating ? 'animate-glow' : ''}`}
              style={{ animationDelay: '0.9s' }}
            />
            <path
              d="M 220 90 L 220 45 Q 220 35 230 35 Q 240 35 240 45"
              fill="none"
              stroke="url(#glow)"
              strokeWidth="6"
              className={`${isAnimating ? 'animate-glow' : ''}`}
              style={{ animationDelay: '1.2s' }}
            />
            <path
              d="M 265 30 L 265 90 M 265 30 L 285 30 M 265 60 L 280 60"
              fill="none"
              stroke="url(#glow)"
              strokeWidth="6"
              className={`${isAnimating ? 'animate-glow' : ''}`}
              style={{ animationDelay: '1.5s' }}
            />
            <path
              d="M 305 50 L 305 90 M 305 35 L 305 40"
              fill="none"
              stroke="url(#glow)"
              strokeWidth="6"
              className={`${isAnimating ? 'animate-glow' : ''}`}
              style={{ animationDelay: '1.8s' }}
            />
          </g>
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
