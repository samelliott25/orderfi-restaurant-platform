import { Link } from "wouter";
import mimiLogo from "@assets/df9f9953-0ac5-4cb9-9b1a-c9da40670f54_1750160795103.png";
import { SwipeToOrder } from "../components/SwipeToOrder";

export default function HomePage() {
  const handleSwipeComplete = () => {
    console.log('Swipe completed - navigating to chat');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#ffe6b0' }}>
      {/* Main Logo */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Mimi Logo */}
        <div className="relative">
          <div className="rounded-full flex items-center justify-center p-8 logo-pulse-simple relative" style={{ width: '576px', height: '576px' }}>
            <img 
              src={mimiLogo} 
              alt="Mimi Waitress" 
              className="w-full h-full object-contain"
            />
            {/* Overlay text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <h1 className="text-8xl md:text-9xl font-bold text-orange-600 mb-2" style={{ fontFamily: 'Arial Black, sans-serif', textShadow: '3px 3px 0px #1a3d36' }}>
                MIMI
              </h1>
              <p className="text-3xl md:text-4xl font-bold text-orange-500" style={{ fontFamily: 'Arial, sans-serif', textShadow: '2px 2px 0px #1a3d36' }}>
                WAITRESS
              </p>
            </div>
          </div>
        </div>
        
        {/* Swipe to Order Component */}
        <SwipeToOrder onSwipe={handleSwipeComplete} />
      </div>
    </div>
  );
}