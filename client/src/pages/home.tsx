import { Link } from "wouter";
import mimiLogo from "@assets/ChatGPT Image Jun 17, 2025, 09_31_09 PM_1750159877241.png";
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
          <div className="w-64 h-64 md:w-72 md:h-72 rounded-full flex items-center justify-center p-8 logo-pulse-simple">
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