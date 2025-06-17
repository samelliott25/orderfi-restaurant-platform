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
      <div className="relative z-10 flex flex-col items-center">
        {/* Mimi Logo with Overlay Text */}
        <div className="relative">
          <div className="rounded-full flex items-center justify-center p-8 logo-pulse-simple relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[576px] lg:h-[576px]">
            <img 
              src={mimiLogo} 
              alt="Mimi Waitress" 
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Overlay Text on Lower 20% of Logo */}
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center pb-4 sm:pb-8" style={{ height: '20%' }}>
            <div className="text-center">
              <div 
                className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1"
                style={{ 
                  fontFamily: 'Molle, cursive',
                  letterSpacing: '0.02em',
                  fontWeight: '400',
                  transform: 'rotate(-5deg)',
                  color: '#E6A547',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                Swipe Right
              </div>
              <div 
                className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold"
                style={{ 
                  fontFamily: 'Molle, cursive',
                  letterSpacing: '0.02em',
                  fontWeight: '400',
                  transform: 'rotate(-3deg)',
                  color: '#E6A547',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                To Order!
              </div>
            </div>
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