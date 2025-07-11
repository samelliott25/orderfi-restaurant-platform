import React from 'react';

interface SimpleMobileLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function SimpleMobileLayout({ children, title }: SimpleMobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      {title && (
        <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
          <h1 className="text-lg font-semibold text-center playwrite-font bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>

      {/* Simple Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
        <div className="relative px-4 py-3">
          <div className="flex items-center justify-center">
            {/* AI Center Button */}
            <div className="relative">
              <button
                className="relative w-16 h-16 rounded-full p-0 border-4 border-white shadow-lg overflow-hidden transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)'
                }}
              >
                <div className="flex items-center justify-center h-full">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
              </button>
              
              {/* AI label */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-orange-600">
                ChatOps
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}