import { useEffect, useState } from 'react';

export default function OrderFiLogo({ className = "" }: { className?: string }) {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const letters = ['O', 'r', 'd', 'e', 'r', 'F', 'i'];

  useEffect(() => {
    letters.forEach((_, index) => {
      setTimeout(() => {
        setVisibleLetters(index + 1);
      }, index * 400 + 800); // Start after 800ms, then 400ms between letters
    });
  }, []);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        <h1 
          className="text-6xl md:text-7xl lg:text-8xl font-heading text-gray-900 relative"
          style={{
            fontWeight: '400',
            letterSpacing: '-0.08em',
            lineHeight: '1.1'
          }}
        >
          {letters.map((letter, index) => (
            <span
              key={index}
              className={`inline-block relative handwriting-reveal ${
                index < visibleLetters 
                  ? 'opacity-100 transform translate-y-0 scale-100' 
                  : 'opacity-0 transform translate-y-2 scale-95'
              }`}
              style={{
                transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transitionDelay: `${index * 80}ms`,
                filter: index < visibleLetters ? 'blur(0px)' : 'blur(0.5px)',
                animationDelay: `${index * 400 + 800}ms`
              }}
            >
              {letter}
            </span>
          ))}
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 -z-10 opacity-20 blur-2xl bg-gradient-to-r from-amber-300 via-orange-300 to-amber-400" />
        </h1>
      </div>
    </div>
  );
}