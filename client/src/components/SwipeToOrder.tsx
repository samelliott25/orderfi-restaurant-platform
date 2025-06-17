import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface SwipeToOrderProps {
  onSwipe: () => void;
}

export function SwipeToOrder({ onSwipe }: SwipeToOrderProps) {
  const [, setLocation] = useLocation();
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);

  const handleStart = (clientX: number) => {
    setStartX(clientX);
    setCurrentX(clientX);
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    
    const diff = clientX - startX;
    const windowWidth = window.innerWidth;
    const progress = Math.max(0, Math.min(diff / (windowWidth * 0.3), 1)); // 30% of screen width
    setSwipeProgress(progress);
    setCurrentX(clientX);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    const swipeDistance = currentX - startX;
    const threshold = window.innerWidth * 0.25; // 25% of screen width
    
    if (swipeDistance > threshold) {
      setLocation('/customer');
      onSwipe();
    } else {
      // Reset progress
      setSwipeProgress(0);
    }
    
    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Mouse events for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => handleMove(e.clientX);
      const handleGlobalMouseUp = () => handleEnd();

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, startX, currentX]);

  // Reset swipe progress when not dragging
  useEffect(() => {
    if (!isDragging && swipeProgress > 0) {
      const timer = setTimeout(() => setSwipeProgress(0), 300);
      return () => clearTimeout(timer);
    }
  }, [isDragging, swipeProgress]);

  return (
    <>
      {/* Full screen swipe overlay */}
      <div 
        className="fixed inset-0 z-50 pointer-events-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        style={{ touchAction: 'none' }}
      >
        {/* Swipe progress indicator */}
        {swipeProgress > 0 && (
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-500/20 to-transparent transition-all duration-200 ease-out"
            style={{ width: `${swipeProgress * 100}%` }}
          >
            <div className="h-full flex items-center justify-start pl-8">
              <div className="bg-red-500 rounded-full p-3 shadow-lg animate-pulse">
                <span className="text-white text-2xl">→</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instruction text */}
      <div className="mt-8 text-center">
        <h2 
          className="text-5xl text-black mb-2 italic"
          style={{ 
            fontFamily: 'Permanent Marker, cursive',
            letterSpacing: '0.02em',
            fontWeight: '400'
          }}
        >
          Swipe Right to Order!
        </h2>
        
        {/* Visual swipe hint */}
        <div className="mt-4 flex items-center justify-center space-x-2 opacity-60">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-black rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-black rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span className="text-2xl">→</span>
        </div>
      </div>
    </>
  );
}