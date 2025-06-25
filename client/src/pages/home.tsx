import orderFiLogo from "@assets/20250625_2213_Elegant Logo Animation_loop_01jykg3kywe6yadwjhwn5nypcx_1750853752703.gif";
import { Button } from "@/components/ui/button";

export default function HomePage() {

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-white">
      {/* Main Container - Centered Vertically */}
      <div className="flex flex-col items-center justify-center w-full max-w-lg space-y-6">
        
        {/* OrderFi Logo - Responsive Size */}
        <div className="relative w-60 h-40 sm:w-72 sm:h-48 md:w-80 md:h-56">
          <div className="flex items-center justify-center w-full h-full">
            <img 
              src={orderFiLogo}
              alt="OrderFi Logo"
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
            onClick={() => window.location.href = '/orderfi'}
            className="w-full py-4 sm:py-6 text-lg sm:text-xl font-bold text-white shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl bg-black hover:bg-gray-800 rounded-xl"
          >
            Enter DApp
          </Button>
          

        </div>
      </div>
    </div>
  );
}