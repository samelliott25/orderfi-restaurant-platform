import { useEffect, useState } from 'react';

export default function OrderFiLogo({ className = "" }: { className?: string }) {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const letters = ['O', 'r', 'd', 'e', 'r', 'F', 'i'];

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLetters(prev => {
        if (prev < letters.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 300); // Each letter appears after 300ms

    return () => clearInterval(timer);
  }, [letters.length]);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Animated handwritten OrderFi text */}
        <h1 
          className="text-6xl md:text-7xl lg:text-8xl font-heading text-gray-900"
          style={{
            fontWeight: '400',
            letterSpacing: '0.02em',
            lineHeight: '1.1'
          }}
        >
          {letters.map((letter, index) => (
            <span
              key={index}
              className={`inline-block transition-all duration-500 ease-out ${
                index < visibleLetters 
                  ? 'opacity-100 transform translate-y-0' 
                  : 'opacity-0 transform translate-y-2'
              }`}
              style={{
                animationDelay: `${index * 300}ms`,
                transitionDelay: `${index * 100}ms`
              }}
            >
              {letter}
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
}