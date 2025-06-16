import { Link } from "wouter";
import mimiLogo from "@assets/5ff63cd3-a67c-49ab-a371-14b12a36506d_1750080680868.png";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-[#999fac] bg-[#fce5bd]" style={{ backgroundColor: '#F5E6D3' }}>
      {/* Main Logo */}
      <Link href="/customer">
        <div className="relative z-10 flex flex-col items-center cursor-pointer group">
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
        </div>
      </Link>
    </div>
  );
}