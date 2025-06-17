import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';

interface SwipeToOrderProps {
  onSwipe: () => void;
}

export function SwipeToOrder({ onSwipe }: SwipeToOrderProps) {
  const [, setLocation] = useLocation();
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number) => {
    setStartX(clientX);
    setCurrentX(clientX);
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    
    const diff = clientX - startX;
    const maxOffset = 100; // Maximum swipe distance
    const offset = Math.max(0, Math.min(diff, maxOffset));
    setDragOffset(offset);
    setCurrentX(clientX);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    const swipeDistance = currentX - startX;
    const threshold = 80; // Minimum swipe distance to trigger
    
    if (swipeDistance > threshold) {
      setLocation('/customer');
      onSwipe();
    } else {
      // Snap back
      setDragOffset(0);
    }
    
    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
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

  // Reset drag offset when not dragging
  useEffect(() => {
    if (!isDragging && dragOffset > 0) {
      const timer = setTimeout(() => setDragOffset(0), 200);
      return () => clearTimeout(timer);
    }
  }, [isDragging, dragOffset]);

  return (
    <div className="mt-8 w-full max-w-sm mx-auto">
      {/* Swipe Instruction */}
      <div className="text-center mb-4">
        <h2 
          className="text-2xl font-black tracking-wider text-black"
          style={{ 
            fontFamily: 'system-ui, -apple-system, sans-serif',
            textShadow: '2px 2px 0px rgba(0,0,0,0.1)',
            letterSpacing: '0.05em'
          }}
        >
          SWIPE RIGHT TO ORDER!
        </h2>
      </div>

      {/* Swipe Track */}
      <div 
        ref={containerRef}
        className="relative bg-white rounded-full h-16 border-4 border-black shadow-lg overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? handleMouseMove : undefined}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'none' }}
      >
        {/* Background Arrow Indicators */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
          <div className="flex space-x-2">
            <span className="text-2xl">→</span>
            <span className="text-2xl">→</span>
            <span className="text-2xl">→</span>
          </div>
        </div>

        {/* Swipe Button */}
        <div 
          className="absolute left-1 top-1 w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-transform duration-200 ease-out border-2 border-black"
          style={{ 
            transform: `translateX(${dragOffset}px)`,
            background: 'linear-gradient(135deg, #ff4444, #cc0000)'
          }}
        >
          <span className="text-xl">→</span>
        </div>

        {/* Track Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className="text-black font-bold text-lg tracking-wide"
            style={{ 
              opacity: dragOffset > 20 ? 0.3 : 1,
              transition: 'opacity 0.2s ease'
            }}
          >
            SLIDE TO START
          </span>
        </div>
      </div>

      {/* Additional Instructions */}
      <div className="text-center mt-3">
        <p className="text-black text-sm font-semibold">
          Meet Mimi, your AI waitress
        </p>
      </div>
    </div>
  );
}