import mimiVideo from "@assets/20250618_2023_Retro Waitress Spin_simple_compose_01jy190he3fbbafrrzzfgz9784_1750242597851.mp4";
import { Button } from "@/components/ui/button";

export default function HomePage() {

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 overflow-hidden" style={{ backgroundColor: '#ffe6b0' }}>
      {/* Main Container - Centered Vertically */}
      <div className="flex flex-col items-center justify-center w-full max-w-lg space-y-6">
        
        {/* Mimi Logo - Responsive Size */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56">
          <div className="rounded-full flex items-center justify-center logo-pulse-simple w-full h-full">
            <video 
              src={mimiVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>
        
        {/* Title and Description */}
        <div className="text-center space-y-2">
          <div 
            className="text-xl sm:text-2xl md:text-3xl font-bold"
            style={{ 
              fontFamily: 'Permanent Marker, cursive',
              letterSpacing: '0.02em',
              fontWeight: '400',
              transform: 'rotate(-2deg)',
              color: '#8b795e'
            }}
          >
            Welcome to Mimi Waitress
          </div>
          <p className="text-xs sm:text-sm text-[#8b795e]/70 px-4">
            AI-Powered Restaurant Platform with Blockchain Rewards
          </p>
        </div>
        
        {/* Single DApp Entry Button */}
        <div className="w-full max-w-xs space-y-2">
          <Button
            onClick={() => window.location.href = '/orderfi'}
            className="w-full py-4 sm:py-6 text-lg sm:text-xl font-bold text-white shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            style={{ 
              backgroundColor: '#8b795e',
              borderRadius: '12px'
            }}
          >
            Enter DApp
          </Button>
          
          <p className="text-center text-xs text-[#8b795e]/60">
            Use navigation menu for restaurant dashboard
          </p>
        </div>
      </div>
    </div>
  );
}