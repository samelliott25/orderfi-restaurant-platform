import { Link } from "wouter";
import mimiVideo from "@assets/20250618_2023_Retro Waitress Spin_simple_compose_01jy190he3fbbafrrzzfgz9784_1750242597851.mp4";
import { Button } from "@/components/ui/button";
import { User, UserCheck } from "lucide-react";

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
        
        {/* Sign-in Options Below Logo Container */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <div className="flex flex-col items-center justify-center space-y-4 px-4">
            <div className="text-center mb-4">
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
                Ready to Order?
              </div>
            </div>
            
            {/* Authentication Options */}
            <div className="flex flex-col space-y-3 w-full max-w-xs">
              <Button
                asChild
                className="w-full py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 transform hover:scale-105 hover:opacity-90"
                style={{ 
                  backgroundColor: '#8b795e'
                }}
              >
                <Link href="/mimi-order">
                  <UserCheck className="mr-2 h-5 w-5" />
                  Sign In / Sign Up
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="w-full py-3 text-lg font-semibold border-2 shadow-lg transition-all duration-200 transform hover:scale-105"
                style={{ 
                  borderColor: '#8b795e',
                  color: '#8b795e',
                  backgroundColor: '#ffe6b0'
                }}
              >
                <Link href="/mimi-order">
                  <User className="mr-2 h-5 w-5" />
                  Order as Guest
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}