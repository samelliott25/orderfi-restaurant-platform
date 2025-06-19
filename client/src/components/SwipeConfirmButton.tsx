import { useState, useRef, useCallback } from 'react';

interface SwipeConfirmButtonProps {
  text: string;
  onConfirm: () => void;
  disabled?: boolean;
}

export function SwipeConfirmButton({ text, onConfirm, disabled = false }: SwipeConfirmButtonProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);

  const handleStart = useCallback((clientX: number) => {
    if (disabled || isConfirmed) return;
    setIsDragging(true);
    startX.current = clientX;
  }, [disabled, isConfirmed]);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || !buttonRef.current) return;
    
    const buttonWidth = buttonRef.current.offsetWidth;
    const maxDrag = buttonWidth * 0.75; // 75% of button width to confirm
    const newDragX = Math.max(0, Math.min(maxDrag, clientX - startX.current));
    
    setDragX(newDragX);
    
    // Check if dragged far enough to confirm
    if (newDragX >= maxDrag) {
      setIsConfirmed(true);
      setIsDragging(false);
      setTimeout(() => {
        onConfirm();
      }, 200);
    }
  }, [isDragging, onConfirm]);

  const handleEnd = useCallback(() => {
    if (!isConfirmed) {
      setDragX(0);
    }
    setIsDragging(false);
  }, [isConfirmed]);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
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
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Fallback click for accessibility
  const handleClick = () => {
    if (!disabled && !isConfirmed) {
      setIsConfirmed(true);
      setTimeout(() => {
        onConfirm();
      }, 200);
    }
  };

  return (
    <div 
      ref={buttonRef}
      className={`relative w-full h-16 bg-green-700 rounded-full overflow-hidden cursor-pointer select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${isConfirmed ? 'bg-green-800' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={isDragging ? handleMouseMove : undefined}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {/* Background track */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-lg retro-text">
          {isConfirmed ? "Confirmed!" : text}
        </span>
      </div>
      
      {/* Sliding handle */}
      <div 
        className={`absolute left-2 top-2 bottom-2 w-12 bg-background rounded-full flex items-center justify-center transition-transform duration-200 ${
          isConfirmed ? 'transform translate-x-full' : ''
        }`}
        style={{
          transform: isConfirmed ? 'translateX(calc(100vw - 100%))' : `translateX(${dragX}px)`
        }}
      >
        <div className="w-6 h-6 bg-green-600 rounded-full"></div>
      </div>
      
      {/* Arrow indicators */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-1">
        <div className="w-2 h-2 bg-background rounded-full opacity-60"></div>
        <div className="w-2 h-2 bg-background rounded-full opacity-40"></div>
        <div className="w-2 h-2 bg-background rounded-full opacity-20"></div>
      </div>
    </div>
  );
}