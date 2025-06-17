import { Link } from "wouter";
import mimiLogo from "@assets/df9f9953-0ac5-4cb9-9b1a-c9da40670f54_1750160795103.png";
import { SwipeToOrder } from "../components/SwipeToOrder";

export default function HomePage() {
  const handleSwipeComplete = () => {
    console.log('Swipe completed - navigating to chat');
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-8" style={{ backgroundColor: '#ffe6b0' }}>
      {/* Main Logo Container */}
      <div className="relative z-10 flex flex-col items-center flex-1 justify-center max-w-full">
        {/* Mimi Logo with Halfway Positioned Text */}
        <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="rounded-full flex items-center justify-center p-4 sm:p-6 md:p-8 logo-pulse-simple w-full aspect-square max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl" style={{ transform: 'scale(1.3)' }}>
            <img 
              src={mimiLogo} 
              alt="Mimi Waitress" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        {/* Text Positioned Below Logo Container */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <div className="flex flex-col items-center justify-center">
            <div className="text-center px-4">
              <div 
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-1"
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
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4"
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
              
              {/* Visual swipe hint below text */}
              <div className="flex items-center justify-center space-x-2 opacity-60">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-black rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-black rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-xl sm:text-2xl">→</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Swipe to Order Component (invisible interaction layer) */}
        <SwipeToOrder onSwipe={handleSwipeComplete} />
      </div>
    </div>
  );
}