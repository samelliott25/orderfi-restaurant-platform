import { useState, useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

interface SwipeableCardProps {
  children: ReactNode;
  onSwipe: (direction: SwipeDirection) => void;
  className?: string;
  swipeThreshold?: number;
}

export function SwipeableCard({ 
  children, 
  onSwipe, 
  className, 
  swipeThreshold = 50 
}: SwipeableCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - startPos.x;
    const deltaY = clientY - startPos.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    const { x, y } = dragOffset;
    
    // Determine swipe direction based on largest offset
    if (Math.abs(x) > Math.abs(y)) {
      if (Math.abs(x) > swipeThreshold) {
        onSwipe(x > 0 ? 'right' : 'left');
      }
    } else {
      if (Math.abs(y) > swipeThreshold) {
        onSwipe(y > 0 ? 'down' : 'up');
      }
    }
    
    // Reset state
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  const transform = isDragging 
    ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.1}deg)`
    : 'translate(0px, 0px) rotate(0deg)';

  const opacity = isDragging ? Math.max(0.7, 1 - Math.abs(dragOffset.x) / 200) : 1;

  return (
    <div
      ref={cardRef}
      className={cn(
        "cursor-grab active:cursor-grabbing select-none transition-all duration-200",
        isDragging ? "z-10" : "",
        className
      )}
      style={{
        transform,
        opacity,
        transition: isDragging ? 'none' : 'all 0.3s ease-out'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={isDragging ? handleMouseMove : undefined}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
      
      {/* Swipe indicators */}
      {isDragging && (
        <div className="absolute inset-0 pointer-events-none">
          {dragOffset.x > 30 && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Add to order
            </div>
          )}
          {dragOffset.x < -30 && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Skip
            </div>
          )}
        </div>
      )}
    </div>
  );
}