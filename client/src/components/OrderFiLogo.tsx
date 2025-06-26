import { useEffect, useState } from 'react';

export default function OrderFiLogo({ className = "" }: { className?: string }) {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const phases = [
      { delay: 0, phase: 1 },     // Start writing
      { delay: 800, phase: 2 },   // Continue writing
      { delay: 1600, phase: 3 },  // Finish writing
      { delay: 2200, phase: 4 },  // Final reveal
    ];

    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setAnimationPhase(phase), delay);
    });
  }, []);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative overflow-hidden">
        {/* Background stroke animation */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #f59e0b 50%, transparent 100%)',
            transform: `translateX(${animationPhase >= 1 ? '0%' : '-100%'})`,
            transition: 'transform 2s cubic-bezier(0.4, 0, 0.2, 1)',
            height: '4px',
            top: '50%',
            borderRadius: '2px'
          }}
        />
        
        {/* Main OrderFi text with advanced animation */}
        <h1 
          className="text-6xl md:text-7xl lg:text-8xl font-heading relative z-10"
          style={{
            fontWeight: '400',
            letterSpacing: '-0.02em',
            lineHeight: '1.1',
            background: `linear-gradient(90deg, 
              transparent 0%, 
              transparent ${Math.max(0, (animationPhase - 1) * 25)}%, 
              #1f2937 ${Math.max(5, (animationPhase - 1) * 25 + 10)}%, 
              #1f2937 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            opacity: animationPhase >= 1 ? 1 : 0,
            transform: `translateY(${animationPhase >= 1 ? '0px' : '20px'}) scale(${animationPhase >= 4 ? 1 : 0.98})`,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            textShadow: animationPhase >= 4 ? '0 2px 20px rgba(245, 158, 11, 0.3)' : 'none',
            filter: `blur(${animationPhase >= 3 ? 0 : 1}px)`
          }}
        >
          OrderFi
        </h1>

        {/* Elegant writing cursor */}
        <div 
          className={`absolute top-1/2 h-16 w-0.5 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full ${
            animationPhase >= 1 && animationPhase < 4 ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            left: `${Math.min(100, animationPhase * 25)}%`,
            transform: 'translateY(-50%)',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.6)'
          }}
        />

        {/* Subtle particle effects */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-orange-400 rounded-full ${
              animationPhase >= 3 ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              left: `${20 + i * 25}%`,
              top: `${30 + i * 10}%`,
              transform: `translate(-50%, -50%) scale(${animationPhase >= 4 ? 0 : 1})`,
              transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${0.5 + i * 0.2}s`,
              animation: animationPhase >= 3 ? `float ${2 + i * 0.5}s ease-in-out infinite` : 'none'
            }}
          />
        ))}
      </div>
    </div>
  );
}