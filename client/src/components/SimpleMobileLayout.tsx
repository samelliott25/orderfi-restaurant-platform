import React from 'react';

interface SimpleMobileLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function SimpleMobileLayout({ children, title }: SimpleMobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 pb-20">
      {/* Header */}
      {title && (
        <div className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-b border-white/20 px-4 py-3 shadow-lg">
          <h1 className="text-lg font-semibold text-center playwrite-font bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>

      {/* Enhanced Mobile Navigation with OrderFi Theme */}
      <div className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-t border-white/20 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-pink-500/5"></div>
        <div className="relative px-4 py-3">
          <div className="flex items-center justify-center">
            {/* Enhanced AI Center Button */}
            <div className="relative">
              <button
                className="relative w-16 h-16 rounded-full p-0 border-4 border-white shadow-2xl overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-3xl group"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)'
                }}
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 animate-pulse opacity-75"></div>
                
                {/* Sparkle effects */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full animate-ping opacity-60"></div>
                  <div className="absolute top-3 right-3 w-1 h-1 bg-white rounded-full animate-ping opacity-80" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-70" style={{animationDelay: '1s'}}></div>
                </div>
                
                {/* Center icon */}
                <div className="relative flex items-center justify-center h-full z-10">
                  <span className="text-white font-bold text-sm drop-shadow-lg">AI</span>
                </div>
                
                {/* Pulsing ring */}
                <div className="absolute inset-0 rounded-full border-2 border-white/30 group-hover:animate-ping"></div>
              </button>
              
              {/* Enhanced AI label */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                ChatOps
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}