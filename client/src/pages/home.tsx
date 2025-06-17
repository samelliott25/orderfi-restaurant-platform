import { Link } from "wouter";
import mimiLogo from "@assets/df9f9953-0ac5-4cb9-9b1a-c9da40670f54_1750160795103.png";
import { SwipeToOrder } from "../components/SwipeToOrder";

export default function HomePage() {
  const handleSwipeComplete = () => {
    console.log('Swipe completed - navigating to chat');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#ffe6b0' }}>
      {/* Main Logo Container */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Mimi Logo */}
        <div className="relative" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="rounded-full flex items-center justify-center p-8 logo-pulse-simple" style={{ width: '576px', height: '576px' }}>
            <img 
              src={mimiLogo} 
              alt="Mimi Waitress" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        {/* Text Below Logo */}
        <div className="mt-4 text-center">
          <div 
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-1"
            style={{ 
              fontFamily: 'Permanent Marker, cursive',
              letterSpacing: '0.02em',
              fontWeight: '400',
              transform: 'rotate(-5deg)',
              color: '#D2691E'
            }}
          >
            Swipe Right
          </div>
          <div 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
            style={{ 
              fontFamily: 'Permanent Marker, cursive',
              letterSpacing: '0.02em',
              fontWeight: '400',
              transform: 'rotate(-3deg)',
              color: '#D2691E'
            }}
          >
            To Order!
          </div>
        </div>
        
        {/* Visual swipe hint below logo */}
        <div className="mt-6 flex items-center justify-center space-x-2 opacity-60">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-black rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-black rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span className="text-2xl">→</span>
        </div>
        
        {/* Swipe to Order Component (invisible interaction layer) */}
        <SwipeToOrder onSwipe={handleSwipeComplete} />
      </div>
    </div>
  );
}