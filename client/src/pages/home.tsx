import { Link } from "wouter";
import mimiLogo from "@assets/5ff63cd3-a67c-49ab-a371-14b12a36506d_1750080680868.png";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-dots">
          <div className="dot dot-1"></div>
          <div className="dot dot-2"></div>
          <div className="dot dot-3"></div>
          <div className="dot dot-4"></div>
          <div className="dot dot-5"></div>
        </div>
      </div>
      
      {/* Main Logo */}
      <Link href="/customer">
        <div className="relative z-10 flex flex-col items-center space-y-6 cursor-pointer group">
          {/* Mimi Logo */}
          <div className="relative">
            <div className="w-48 h-48 md:w-56 md:h-56 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center paper-shadow cartoon-button group-hover:scale-110 transition-all duration-500 ease-out logo-pulse p-4">
              <img 
                src={mimiLogo} 
                alt="Mimi Waitress" 
                className="w-full h-full object-contain group-hover:rotate-3 transition-transform duration-300"
              />
            </div>
            {/* Floating rings */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 ring-animation ring-1"></div>
            <div className="absolute inset-0 rounded-full border-2 border-accent/30 ring-animation ring-2"></div>
          </div>
          
          {/* Text */}
          <div className="text-center space-y-2">
            <h1 className="text-5xl md:text-6xl retro-text text-primary group-hover:scale-105 transition-transform duration-300">
              Mimi
            </h1>
            <p className="text-muted-foreground text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              Your AI Waitress
            </p>
          </div>
          
          {/* Floating action hint */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
            <div className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-lg font-medium pulse-glow">
              Tap to start ordering
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}