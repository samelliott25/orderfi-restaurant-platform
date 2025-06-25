import orderFiLogo from "@assets/20250625_2213_Elegant Logo Animation_loop_01jykg3kywe6yadwjhwn5nypcx_1750853921628.mp4";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function HomePage() {
  const [isClicked, setIsClicked] = useState(false);
  const [showBlockchainOverlay, setShowBlockchainOverlay] = useState(false);

  const handleDAppClick = () => {
    setIsClicked(true);
    setShowBlockchainOverlay(true);
    
    // Navigate after the blockchain animation
    setTimeout(() => {
      window.location.href = '/orderfi';
    }, 2000);
  };

  return (
    <div className="relative h-screen flex flex-col items-center justify-center p-4 overflow-hidden" style={{ backgroundColor: '#fcfcfc' }}>
      
      {/* Blockchain Spider Web Overlay */}
      {showBlockchainOverlay && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Animated blockchain network */}
            <svg 
              className="absolute inset-0 w-full h-full animate-pulse"
              viewBox="0 0 1200 800"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Spider web grid lines */}
              <defs>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
                </pattern>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Background grid */}
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Network nodes */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30) * Math.PI / 180;
                const radius = 200 + (i % 3) * 80;
                const x = 600 + Math.cos(angle) * radius;
                const y = 400 + Math.sin(angle) * radius;
                
                return (
                  <g key={i}>
                    {/* Connection lines */}
                    <line 
                      x1="600" y1="400" 
                      x2={x} y2={y}
                      stroke="rgba(59, 130, 246, 0.6)" 
                      strokeWidth="2"
                      className="animate-pulse"
                      style={{ 
                        animationDelay: `${i * 100}ms`,
                        animationDuration: '2s'
                      }}
                    />
                    
                    {/* Animated nodes */}
                    <circle 
                      cx={x} 
                      cy={y} 
                      r="8"
                      fill="rgba(59, 130, 246, 0.8)"
                      stroke="rgba(147, 197, 253, 1)"
                      strokeWidth="2"
                      filter="url(#glow)"
                      className="animate-ping"
                      style={{ 
                        animationDelay: `${i * 150}ms`,
                        animationDuration: '1.5s'
                      }}
                    />
                  </g>
                );
              })}
              
              {/* Central hub */}
              <circle 
                cx="600" 
                cy="400" 
                r="20"
                fill="rgba(34, 197, 94, 0.8)"
                stroke="rgba(134, 239, 172, 1)"
                strokeWidth="3"
                filter="url(#glow)"
                className="animate-pulse"
              />
              
              {/* Floating blockchain blocks */}
              {[...Array(6)].map((_, i) => {
                const x = 200 + i * 160;
                const y = 100 + (i % 2) * 600;
                
                return (
                  <g key={`block-${i}`}>
                    <rect 
                      x={x} 
                      y={y} 
                      width="40" 
                      height="40"
                      fill="rgba(168, 85, 247, 0.7)"
                      stroke="rgba(196, 181, 253, 1)"
                      strokeWidth="2"
                      rx="4"
                      filter="url(#glow)"
                      className="animate-bounce"
                      style={{ 
                        animationDelay: `${i * 200}ms`,
                        animationDuration: '2s'
                      }}
                    />
                    
                    {/* Block chain connections */}
                    {i < 5 && (
                      <line 
                        x1={x + 40} y1={y + 20}
                        x2={x + 120} y2={y + (i % 2 === 0 ? 620 : -600) + 20}
                        stroke="rgba(168, 85, 247, 0.5)" 
                        strokeWidth="3"
                        strokeDasharray="5,5"
                        className="animate-pulse"
                        style={{ 
                          animationDelay: `${i * 100}ms`
                        }}
                      />
                    )}
                  </g>
                );
              })}
            </svg>
            
            {/* Loading text */}
            <div className="relative z-10 text-center text-white">
              <div className="text-4xl font-bold mb-4 animate-pulse">
                Entering OrderFi Network
              </div>
              <div className="text-lg text-blue-300 animate-bounce">
                Connecting to blockchain...
              </div>
              
              {/* Loading dots */}
              <div className="flex justify-center mt-6 space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
                    style={{ 
                      animationDelay: `${i * 200}ms`,
                      animationDuration: '1s'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Main Container - Centered Vertically */}
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
    </div>
  );
}