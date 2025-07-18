import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";
import InteractiveStarryBackground from "@/components/InteractiveStarryBackground";

export default function LandingPage() {
  const [isClicked, setIsClicked] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [location, setLocation] = useLocation();

  const handleDAppClick = () => {
    setIsClicked(true);
    setShowTransition(true);
    
    // Immediate navigation backup for reliability
    setTimeout(() => {
      if (showTransition) {
        setLocation('/dashboard');
      }
    }, 2500);
  };

  // Smooth navigation after fade animation
  useEffect(() => {
    if (showTransition) {
      const timer = setTimeout(() => {
        setLocation('/dashboard');
      }, 2000); // Wait for smooth fade animation to complete
      
      return () => clearTimeout(timer);
    }
  }, [showTransition, setLocation]);

  return (
    <InteractiveStarryBackground>
      <div className="relative h-screen flex flex-col items-center justify-center p-4 overflow-hidden text-foreground">
        {/* Theme Toggle - Top Right */}
        <div className="absolute top-4 right-4 z-40">
          <ThemeToggle />
        </div>
      {/* Progressive Loading Transition */}
      {showTransition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Sophisticated overlay with subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-lg animate-fade-in" />
          
          {/* Center content with progressive reveal */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg space-y-8">
            {/* OrderFi Logo - Keep original styling with subtle enhancement */}
            <div className="relative w-80 h-48 sm:w-88 sm:h-56 md:w-[26rem] md:h-72 flex items-center justify-center animate-fade-in-up">
              <div className="text-center">
                <div className="text-7xl sm:text-8xl md:text-9xl bg-gradient-to-r from-[#F5A623] via-orange-500 to-pink-500 bg-clip-text text-transparent playwrite-font px-4 py-6 gentle-glow">
                  OrderFi
                </div>
              </div>
            </div>
            
            {/* Progressive status messages */}
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
              <div className="text-lg text-foreground/80 mb-2">
                Loading your restaurant experience...
              </div>
              <div className="text-sm text-muted-foreground">
                Setting up AI assistant and menu system
              </div>
            </div>
            
            {/* Modern skeleton-inspired loading indicator */}
            <div className="flex flex-col items-center space-y-4 animate-fade-in-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
              {/* Progress skeleton bars */}
              <div className="w-48 space-y-2">
                <div className="h-1 bg-gradient-to-r from-[#F5A623] to-pink-500 rounded-full skeleton-shimmer" />
                <div className="h-1 bg-gradient-to-r from-[#F5A623] to-pink-500 rounded-full skeleton-shimmer" style={{ animationDelay: '0.2s' }} />
                <div className="h-1 bg-gradient-to-r from-[#F5A623] to-pink-500 rounded-full skeleton-shimmer" style={{ animationDelay: '0.4s' }} />
              </div>
              
              {/* Elegant pulsating dots */}
              <div className="flex justify-center items-center gap-2 mt-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#F5A623] to-pink-500 animate-pulse"
                    style={{
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: '1.2s'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Main Container - Only visible when not transitioning */}
      {!showTransition && (
        <div className="flex flex-col items-center justify-center w-full max-w-lg space-y-6">
          
          {/* OrderFi Logo - Animated SVG */}
          <div className="relative w-80 h-48 sm:w-88 sm:h-56 md:w-[26rem] md:h-72 flex items-center justify-center animate-fade-in-up">
            <div className="text-center">
              <div className="text-7xl sm:text-8xl md:text-9xl bg-gradient-to-r from-[#F5A623] via-orange-500 to-pink-500 bg-clip-text text-transparent playwrite-font px-4 py-6 hover-float">
                OrderFi
              </div>
              
            </div>
          </div>
          
          {/* Logo spacing */}
          <div className="text-center space-y-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-xs sm:text-sm text-muted-foreground px-4">
              AI-Powered Restaurant Platform with Blockchain Rewards
            </p>
          </div>
          
          {/* Single DApp Entry Button */}
          <div className="w-full max-w-xs space-y-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={handleDAppClick}
              className={`
                relative overflow-hidden w-full py-4 sm:py-6 text-lg sm:text-xl font-normal text-white 
                shadow-xl transition-all duration-300 transform rounded-xl
                hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50
                active:scale-95 active:shadow-lg
                dark-mode-button
                ${isClicked ? 'animate-pulse scale-95' : ''}
              `}
              style={{
                background: 'linear-gradient(135deg, #F5A623 0%, #f97316 50%, #ec4899 100%)'
              }}
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                  <div className="w-full h-full rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
              </div>
              
              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-1 h-1 absolute bg-white/80 rounded-full animate-pulse" 
                     style={{ top: '25%', left: '15%', animationDelay: '0s', animationDuration: '2s' }}></div>
                <div className="w-1 h-1 absolute bg-white/60 rounded-full animate-pulse" 
                     style={{ top: '60%', left: '75%', animationDelay: '0.5s', animationDuration: '2.5s' }}></div>
                <div className="w-0.5 h-0.5 absolute bg-white/70 rounded-full animate-pulse" 
                     style={{ top: '40%', left: '85%', animationDelay: '1s', animationDuration: '3s' }}></div>
                <div className="w-1 h-1 absolute bg-white/50 rounded-full animate-pulse" 
                     style={{ top: '75%', left: '20%', animationDelay: '1.5s', animationDuration: '2.2s' }}></div>
              </div>
              <span className="relative z-10 flex items-center justify-center gap-2 rock-salt-font text-white">
                <svg 
                  className="w-4 h-4 ai-sparkle-1" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                Enter App
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
    </InteractiveStarryBackground>
  );
}