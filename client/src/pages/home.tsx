import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  const [isClicked, setIsClicked] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [location, setLocation] = useLocation();

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

  // Navigate when data is ready using wouter for SPA navigation
  useEffect(() => {
    if (showTransition && !menuLoading && !restaurantLoading && menuItems && restaurants) {
      // Wait for keyhole animation to complete then navigate using SPA routing
      const timer = setTimeout(() => {
        setLocation('/orderfi');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [showTransition, menuLoading, restaurantLoading, menuItems, restaurants]);

  return (
    <div className="relative h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-background text-foreground">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-40">
        <ThemeToggle />
      </div>
      {/* Keyhole Reveal Transition */}
      {showTransition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background with keyhole reveal animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 animate-keyhole-reveal">
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/30" />
          </div>
          
          {/* Center content - positioned exactly like home page */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg space-y-6">
            {/* OrderFi Logo - Same container as home page */}
            <div className="relative w-80 h-48 sm:w-88 sm:h-56 md:w-[26rem] md:h-72 flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl sm:text-8xl md:text-9xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent animate-bounce playwrite-font px-4 py-6 gentle-glow">
                  OrderFi
                </div>
              </div>
            </div>
            
            {/* Loading text below logo */}
            <div className="text-center">
              <div className="text-xl text-white animate-pulse">
                {menuLoading || restaurantLoading ? 'Loading restaurant data...' : 'Launching AI Assistant...'}
              </div>
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
          
          {/* OrderFi Logo - Animated SVG */}
          <div className="relative w-80 h-48 sm:w-88 sm:h-56 md:w-[26rem] md:h-72 flex items-center justify-center">
            <div className="text-center">
              <div className="text-7xl sm:text-8xl md:text-9xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent animate-pulse playwrite-font px-4 py-6 gentle-glow">
                OrderFi
              </div>
              
            </div>
          </div>
          
          {/* Logo spacing */}
          <div className="text-center space-y-2">
            <p className="text-xs sm:text-sm text-muted-foreground px-4">
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
                bg-gradient-to-r from-orange-500 via-red-500 to-pink-500
                hover:from-orange-600 hover:via-red-600 hover:to-pink-600
                hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50
                active:scale-95 active:shadow-lg
                dark-mode-button
                ${isClicked ? 'animate-pulse scale-95' : ''}
                before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                before:via-white/20 before:to-transparent before:-translate-x-full 
                hover:before:translate-x-full before:transition-transform before:duration-700
              `}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {/* Stars scattered across the entire button */}
                <div className="absolute inset-0 pointer-events-none opacity-40">
                  {/* Row 1 - Top */}
                  <svg className="w-0.5 h-0.5 absolute ai-sparkle-1" style={{ top: '8%', left: '5%' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="w-1 h-1 absolute ai-sparkle-2" style={{ top: '12%', left: '18%', animationDelay: '0.5s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="w-0.5 h-0.5 absolute ai-sparkle-3" style={{ top: '6%', left: '35%', animationDelay: '1.2s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="w-0.5 h-0.5 absolute ai-sparkle-4" style={{ top: '15%', left: '52%', animationDelay: '2.1s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="w-1 h-1 absolute ai-sparkle-1" style={{ top: '10%', left: '72%', animationDelay: '0.8s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="w-0.5 h-0.5 absolute ai-sparkle-2" style={{ top: '18%', left: '88%', animationDelay: '1.7s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>

                  {/* Row 2 - Middle-Top */}
                  <svg className="w-0.5 h-0.5 absolute ai-sparkle-3" style={{ top: '30%', left: '8%', animationDelay: '1.5s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="w-0.5 h-0.5 absolute ai-sparkle-4" style={{ top: '25%', left: '25%', animationDelay: '0.3s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="w-1 h-1 absolute ai-sparkle-1" style={{ top: '32%', left: '45%', animationDelay: '2.3s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="w-0.5 h-0.5 absolute ai-sparkle-2" style={{ top: '28%', left: '68%', animationDelay: '1.1s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="w-0.5 h-0.5 absolute ai-sparkle-3" style={{ top: '35%', left: '85%', animationDelay: '0.7s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>

                  {/* Row 3 - Middle */}
                  <svg className="w-1 h-1 absolute ai-sparkle-4" style={{ top: '48%', left: '12%', animationDelay: '1.9s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="w-0.5 h-0.5 absolute ai-sparkle-1" style={{ top: '55%', left: '28%', animationDelay: '0.4s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="w-0.5 h-0.5 absolute ai-sparkle-2" style={{ top: '45%', left: '62%', animationDelay: '2.5s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="w-1 h-1 absolute ai-sparkle-3" style={{ top: '52%', left: '78%', animationDelay: '1.3s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>

                  {/* Row 4 - Middle-Bottom */}
                  <svg className="w-0.5 h-0.5 absolute ai-sparkle-4" style={{ top: '68%', left: '15%', animationDelay: '0.9s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="w-0.5 h-0.5 absolute ai-sparkle-1" style={{ top: '72%', left: '32%', animationDelay: '2.7s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="w-1 h-1 absolute ai-sparkle-2" style={{ top: '65%', left: '48%', animationDelay: '1.6s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="w-0.5 h-0.5 absolute ai-sparkle-3" style={{ top: '75%', left: '66%', animationDelay: '0.6s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="w-0.5 h-0.5 absolute ai-sparkle-4" style={{ top: '70%', left: '82%', animationDelay: '2.2s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>

                  {/* Row 5 - Bottom */}
                  <svg className="w-1 h-1 absolute ai-sparkle-1" style={{ top: '88%', left: '10%', animationDelay: '1.4s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="w-0.5 h-0.5 absolute ai-sparkle-2" style={{ top: '85%', left: '22%', animationDelay: '0.2s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="w-0.5 h-0.5 absolute ai-sparkle-3" style={{ top: '92%', left: '40%', animationDelay: '2.8s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="w-0.5 h-0.5 absolute ai-sparkle-4" style={{ top: '90%', left: '58%', animationDelay: '1.8s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="w-1 h-1 absolute ai-sparkle-1" style={{ top: '86%', left: '75%', animationDelay: '0.1s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="w-0.5 h-0.5 absolute ai-sparkle-2" style={{ top: '94%', left: '90%', animationDelay: '2.4s' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                </div>
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