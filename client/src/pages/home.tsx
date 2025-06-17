import { Link } from "wouter";
import mimiLogo from "@assets/5ff63cd3-a67c-49ab-a371-14b12a36506d_1750080680868.png";

export default function HomePage() {
  return (
    <div className="min-h-screen retro-background flex items-center justify-center p-4">
      {/* Main Logo and Options */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
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

        {/* Chat Options */}
        <div className="flex flex-col space-y-4 w-full max-w-sm">
          <Link href="/retro">
            <button className="w-full p-4 bg-green-700 hover:bg-green-800 text-white rounded-xl retro-text-message font-bold border-3 border-green-900 retro-shadow transition-all hover:transform hover:translate-y-1">
              🎯 Try Retro Swipe Chat
            </button>
          </Link>
          
          <Link href="/customer">
            <button className="w-full p-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl retro-text-message font-bold border-3 border-orange-700 retro-shadow transition-all hover:transform hover:translate-y-1">
              💬 Full Chat Experience
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}