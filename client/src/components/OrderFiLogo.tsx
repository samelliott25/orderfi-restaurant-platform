import { useEffect, useState } from 'react';

export default function OrderFiLogo({ className = "" }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Main OrderFi Text */}
        <div className={`text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 transition-all duration-1000 ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
        }`}
        style={{
          fontFamily: '"Playwrite AU VIC", "Dancing Script", cursive',
          background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
        }}>
          <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0ms' }}>O</span>
          <span className="inline-block animate-fade-in-up" style={{ animationDelay: '100ms' }}>r</span>
          <span className="inline-block animate-fade-in-up" style={{ animationDelay: '200ms' }}>d</span>
          <span className="inline-block animate-fade-in-up" style={{ animationDelay: '300ms' }}>e</span>
          <span className="inline-block animate-fade-in-up" style={{ animationDelay: '400ms' }}>r</span>
          <span className="inline-block animate-fade-in-up" style={{ animationDelay: '500ms' }}>F</span>
          <span className="inline-block animate-fade-in-up" style={{ animationDelay: '600ms' }}>i</span>
        </div>
        
        {/* Animated Dot on 'i' */}
        <div 
          className={`absolute w-3 h-3 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full animate-bounce ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            top: '10%',
            right: '8%',
            animationDelay: '700ms',
            animationDuration: '2s'
          }}
        />
        
        {/* Subtle Glow Effect */}
        <div 
          className={`absolute inset-0 blur-xl opacity-30 transition-opacity duration-1000 ${
            isVisible ? 'opacity-30' : 'opacity-0'
          }`}
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)',
            zIndex: -1
          }}
        >
          <div className="text-6xl md:text-7xl lg:text-8xl font-bold text-transparent"
            style={{ fontFamily: '"Playwrite AU VIC", "Dancing Script", cursive' }}>
            OrderFi
          </div>
        </div>
      </div>
    </div>
  );
}