import React from 'react';
import { cn } from '@/lib/utils';

interface KleurvormProgressCircleProps {
  value: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function KleurvormProgressCircle({
  value,
  label,
  size = 'md',
  className,
}: KleurvormProgressCircleProps) {
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-30 h-30',
    lg: 'w-40 h-40',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={cn('kleurvorm-progress-circle', sizeClasses[size], className)}>
      <div className="kleurvorm-progress-inner">
        <div className={cn('kleurvorm-progress-value', textSizeClasses[size])}>
          {value}
        </div>
        <div className="kleurvorm-progress-label">
          {label}
        </div>
      </div>
    </div>
  );
}