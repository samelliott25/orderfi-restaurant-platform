import { useEffect, useState } from 'react';

export default function OrderFiLogo({ className = "" }: { className?: string }) {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const letters = ['O', 'r', 'd', 'e', 'r', 'F', 'i'];

  useEffect(() => {
    letters.forEach((_, index) => {
      setTimeout(() => {
        setVisibleLetters(index + 1);
      }, index * 200 + 500); // Start after 500ms, then 200ms between letters
    });
  }, []);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        <h1 
          className="text-6xl md:text-7xl lg:text-8xl font-heading text-gray-900"
          style={{
            fontWeight: '400',
            letterSpacing: '-0.02em',
            lineHeight: '1.1'
          }}
        >
          {letters.map((letter, index) => (
            <span
              key={index}
              className={`inline-block transition-all duration-700 ease-out ${
                index < visibleLetters 
                  ? 'opacity-100 transform translate-y-0 scale-100' 
                  : 'opacity-0 transform translate-y-8 scale-75'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
                filter: index < visibleLetters ? 'blur(0px)' : 'blur(2px)'
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