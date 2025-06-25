import mimiVideo from "@assets/20250618_2023_Retro Waitress Spin_simple_compose_01jy190he3fbbafrrzzfgz9784_1750242597851.mp4";
import { Button } from "@/components/ui/button";

export default function HomePage() {

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-8" style={{ backgroundColor: '#ffe6b0' }}>
      {/* Main Logo Container */}
      <div className="relative z-10 flex flex-col items-center flex-1 justify-center max-w-full">
        {/* Mimi Logo with Halfway Positioned Text */}
        <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="rounded-full flex items-center justify-center p-4 sm:p-6 md:p-8 logo-pulse-simple w-full aspect-square max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl" style={{ transform: 'scale(1.3)' }}>
            <video 
              src={mimiVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain"
              style={{ borderRadius: '50%' }}
            />
          </div>
        </div>
        
        {/* Single Enter DApp Button */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <div className="flex flex-col items-center justify-center space-y-4 px-4">
            <div className="text-center mb-6">
              <div 
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2"
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
              <p className="text-sm text-[#8b795e]/70 mb-4">
                AI-Powered Restaurant Platform with Blockchain Rewards
              </p>
            </div>
            
            {/* Single DApp Entry Button */}
            <div className="w-full max-w-xs">
              <Button
                onClick={() => window.location.href = '/orderfi'}
                className="w-full py-6 text-xl font-bold text-white shadow-xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl"
                style={{ 
                  backgroundColor: '#8b795e',
                  borderRadius: '16px'
                }}
              >
                Enter DApp
              </Button>
              
              <p className="text-center text-xs text-[#8b795e]/60 mt-3">
                Use navigation menu for restaurant dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}