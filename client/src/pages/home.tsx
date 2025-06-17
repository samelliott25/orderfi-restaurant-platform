import { Link } from "wouter";
import mimiLogo from "@assets/df9f9953-0ac5-4cb9-9b1a-c9da40670f54_1750160795103.png";
import { SwipeToOrder } from "../components/SwipeToOrder";

export default function HomePage() {
  const handleSwipeComplete = () => {
    console.log('Swipe completed - navigating to chat');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#fae4be' }}>
      {/* Main Logo */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Mimi Logo */}
        <div className="relative">
          <div className="w-96 h-96 md:w-108 md:h-108 rounded-full flex items-center justify-center p-8 logo-pulse-simple">
            <img 
              src={mimiLogo} 
              alt="Mimi Waitress" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        {/* Swipe to Order Component */}
        <SwipeToOrder onSwipe={handleSwipeComplete} />
      </div>
    </div>
  );
}