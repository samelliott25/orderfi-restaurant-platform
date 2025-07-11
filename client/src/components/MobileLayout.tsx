import React, { useState } from 'react';
import MobileNavigation from './MobileNavigation';
import CustomerAiChat from './CustomerAiChat';
import { ChevronLeft } from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function MobileLayout({ 
  children, 
  title, 
  subtitle, 
  showBackButton = false,
  onBack 
}: MobileLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      {(title || subtitle) && (
        <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between">
            {showBackButton && onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            
            <div className="flex-1 text-center">
              {title && (
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white playwrite-font bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation onChatToggle={() => setIsChatOpen(!isChatOpen)} />

      {/* Chat Interface */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsChatOpen(false)}>
          <div className="absolute bottom-20 left-4 right-4 h-96">
            <CustomerAiChat />
          </div>
        </div>
      )}
    </div>
  );
}