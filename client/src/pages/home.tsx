import orderFiLogo from "@assets/20250625_2213_Elegant Logo Animation_loop_01jykg3kywe6yadwjhwn5nypcx_1750853921628.mp4";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const [isClicked, setIsClicked] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  // Preload data for OrderFi page
  const { data: menuItems, isLoading: menuLoading } = useQuery({
    queryKey: [`/api/restaurants/1/menu`],
    enabled: showTransition, // Only fetch when user clicks enter app
    staleTime: 5 * 60 * 1000,
  });

  const { data: restaurants, isLoading: restaurantLoading } = useQuery({
    queryKey: ['/api/restaurants'],
    enabled: showTransition,
    staleTime: 5 * 60 * 1000,
  });

  const handleDAppClick = () => {
    setIsClicked(true);
    setShowTransition(true);
  };

  // Navigate when data is ready
  useEffect(() => {
    if (showTransition && !menuLoading && !restaurantLoading && menuItems && restaurants) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        window.location.href = '/orderfi';
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showTransition, menuLoading, restaurantLoading, menuItems, restaurants]);

  return (
    <div className="relative h-screen flex flex-col items-center justify-center p-4 overflow-hidden" style={{ backgroundColor: '#fcfcfc' }}>
      
      {/* Sleek Transition Overlay */}
      {showTransition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/30" />
          
          {/* Center content */}
          <div className="relative z-10 text-center text-white">
            <div className="text-5xl font-bold mb-4 animate-bounce font-heading">
              OrderFi
            </div>
            <div className="text-xl animate-pulse">
              {menuLoading || restaurantLoading ? 'Loading restaurant data...' : 'Launching AI Assistant...'}
            </div>
          </div>
          
          {/* Morphing circles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/20 animate-ping"
                style={{
                  width: `${(i + 1) * 100}px`,
                  height: `${(i + 1) * 100}px`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${i * 200}ms`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Main Container - Only visible when not transitioning */}
      {!showTransition && (
        <div className="flex flex-col items-center justify-center w-full max-w-lg space-y-6">
          
          {/* OrderFi Logo - Responsive Size (25% larger) */}
          <div className="relative w-80 h-52 sm:w-96 sm:h-64 md:w-[26rem] md:h-80">
            <div className="flex items-center justify-center w-full h-full">
              <video 
                src={orderFiLogo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          {/* Logo spacing */}
          <div className="text-center space-y-2">
            <p className="text-xs sm:text-sm text-gray-600 px-4">
              AI-Powered Restaurant Platform with Blockchain Rewards
            </p>
          </div>
          
          {/* Single DApp Entry Button */}
          <div className="w-full max-w-xs space-y-2">
            <Button
              onClick={handleDAppClick}
              className={`
                relative overflow-hidden w-full py-4 sm:py-6 text-lg sm:text-xl font-bold text-white 
                shadow-xl transition-all duration-300 transform rounded-xl
                bg-gradient-to-r from-black to-gray-900 
                hover:from-gray-800 hover:to-black
                hover:scale-105 hover:shadow-2xl hover:shadow-black/50
                active:scale-95 active:shadow-lg
                ${isClicked ? 'animate-pulse scale-95' : ''}
                before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                before:via-white/20 before:to-transparent before:-translate-x-full 
                hover:before:translate-x-full before:transition-transform before:duration-700
              `}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Enter DApp
                <svg 
                  className={`w-5 h-5 transition-transform duration-300 ${isClicked ? 'translate-x-1' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              
              {/* Ripple effect */}
              <div className={`
                absolute inset-0 rounded-xl transition-opacity duration-300
                ${isClicked ? 'animate-ping bg-white/30' : 'opacity-0'}
              `} />
            </Button>
          </div>
          
        </div>
      )}
    </div>
  );
}