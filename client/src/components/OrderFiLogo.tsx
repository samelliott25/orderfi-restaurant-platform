import { useEffect, useState } from 'react';

export default function OrderFiLogo({ className = "" }: { className?: string }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Start animation after component mounts
    const timer = setTimeout(() => setAnimate(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Animated handwritten OrderFi text with joined letters */}
        <h1 
          className={`text-6xl md:text-7xl lg:text-8xl font-heading text-gray-900 ${
            animate ? 'animate-write-in' : 'opacity-0'
          }`}
          style={{
            fontWeight: '400',
            letterSpacing: '-0.02em', // Negative spacing to join letters
            lineHeight: '1.1'
          }}
        >
          OrderFi
        </h1>
      </div>
    </div>
  );
}