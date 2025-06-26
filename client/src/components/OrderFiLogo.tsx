
import { useEffect, useState, useRef } from 'react';

export default function OrderFiLogo({ className = "" }: { className?: string }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentLetter, setCurrentLetter] = useState(0);
  const [showLetter, setShowLetter] = useState<boolean[]>(new Array(7).fill(false));
  const letters = ['O', 'r', 'd', 'e', 'r', 'F', 'i'];
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Start animation after delay
    const startDelay = setTimeout(() => {
      setIsAnimating(true);
      animateLetters();
    }, 800);

    return () => clearTimeout(startDelay);
  }, []);

  const animateLetters = () => {
    letters.forEach((_, index) => {
      setTimeout(() => {
        setCurrentLetter(index);
        setShowLetter(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, index * 500); // 500ms delay between letters
    });
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Main text with handwriting animation */}
        <h1 
          className="text-6xl md:text-7xl lg:text-8xl font-heading text-gray-900 relative z-10"
          style={{
            fontWeight: '400',
            letterSpacing: '-0.04em',
            lineHeight: '1.1'
          }}
        >
          {letters.map((letter, index) => (
            <span
              key={index}
              className={`inline-block relative handwriting-letter ${
                showLetter[index] 
                  ? 'opacity-100 animate-handwrite-draw' 
                  : 'opacity-0'
              }`}
              style={{
                animationDelay: `${index * 500}ms`,
                animationDuration: '800ms',
                animationFillMode: 'forwards'
              }}
            >
              {letter}
            </span>
          ))}
        </h1>

        {/* SVG overlay for drawing path effect */}
        <svg
          ref={svgRef}
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            width: '100%',
            height: '100%'
          }}
        >
          {/* Animated drawing path */}
          <path
            d="M 20 60 Q 100 20 180 60 Q 250 40 320 60 Q 380 45 440 60 Q 500 50 560 60 Q 620 45 680 60 Q 740 50 800 60"
            stroke="rgba(139, 121, 94, 0.3)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            className={`handwriting-path ${isAnimating ? 'animate-draw-path' : ''}`}
            style={{
              strokeDasharray: '1000',
              strokeDashoffset: isAnimating ? '0' : '1000',
              transition: 'stroke-dashoffset 3.5s ease-out',
              transitionDelay: '200ms'
            }}
          />
        </svg>

        {/* Ink blot effects */}
        {showLetter.map((show, index) => (
          show && (
            <div
              key={`blot-${index}`}
              className="absolute ink-blot"
              style={{
                left: `${12 + index * 14}%`,
                bottom: '-5px',
                animationDelay: `${index * 500 + 600}ms`
              }}
            />
          )
        ))}

        {/* Subtle paper texture overlay */}
        <div className="absolute inset-0 -z-10 opacity-5 bg-gradient-to-br from-amber-100 via-transparent to-orange-100 blur-3xl" />
      </div>
    </div>
  );
}
