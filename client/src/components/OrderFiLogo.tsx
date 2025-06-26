import { useEffect, useState } from 'react';

export default function OrderFiLogo({ className = "" }: { className?: string }) {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [isWriting, setIsWriting] = useState(false);
  const letters = ['O', 'r', 'd', 'e', 'r', 'F', 'i'];

  useEffect(() => {
    // Start writing animation after initial delay
    const startTimer = setTimeout(() => {
      setIsWriting(true);
    }, 800);

    letters.forEach((_, index) => {
      setTimeout(() => {
        setVisibleLetters(index + 1);
      }, index * 300 + 1000); // Start after 1s, then 300ms between letters
    });

    return () => clearTimeout(startTimer);
  }, []);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        <h1 
          className="text-6xl md:text-7xl lg:text-8xl font-heading text-gray-900 relative"
          style={{
            fontWeight: '400',
            letterSpacing: '-0.02em',
            lineHeight: '1.1'
          }}
        >
          {letters.map((letter, index) => (
            <span
              key={index}
              className={`inline-block relative transition-all duration-500 ease-out ${
                index < visibleLetters 
                  ? 'opacity-100 transform translate-y-0 scale-100 handwritten-letter' 
                  : 'opacity-0 transform translate-y-4 scale-90'
              }`}
              style={{
                transitionDelay: `${index * 50}ms`,
                filter: index < visibleLetters ? 'blur(0px)' : 'blur(1px)',
                animationDelay: `${index * 300 + 1000}ms`
              }}
            >
              {letter}
              {/* Handwriting cursor effect */}
              {isWriting && index === visibleLetters - 1 && (
                <span className="absolute -right-1 top-0 writing-cursor">|</span>
              )}
            </span>
          ))}
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 -z-10 opacity-30 blur-xl bg-gradient-to-r from-amber-300 via-orange-300 to-amber-400 animate-pulse" />
        </h1>
        
        {/* Handwritten underline effect */}
        {visibleLetters >= letters.length && (
          <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full handwritten-underline opacity-60" />
          </div>
        )}
      </div>
    </div>
  );
}