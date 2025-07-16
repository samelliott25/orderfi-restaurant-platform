import React from 'react';
import { cn } from '@/lib/utils';

interface UrbanistGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UrbanistGrid({ 
  children, 
  cols = 3, 
  gap = 'md',
  className 
}: UrbanistGridProps) {
  const colsStyles = {
    1: "urbanist-grid-cols-1",
    2: "urbanist-grid-cols-2", 
    3: "urbanist-grid-cols-3",
    4: "urbanist-grid-cols-4"
  };

  const gapStyles = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6"
  };

  return (
    <div className={cn(
      "urbanist-grid",
      colsStyles[cols],
      gapStyles[gap],
      className
    )}>
      {children}
    </div>
  );
}