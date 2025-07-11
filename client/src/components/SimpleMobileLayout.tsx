import React from 'react';

interface SimpleMobileLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function SimpleMobileLayout({ children, title }: SimpleMobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
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

      {/* Clean bottom spacing */}
      <div className="pb-4"></div>
    </div>
  );
}