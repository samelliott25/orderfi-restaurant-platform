import React from 'react';
import { cn } from '@/lib/utils';

interface KleurvormCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'gradient';
  className?: string;
  onClick?: () => void;
}

export function KleurvormCard({
  children,
  variant = 'default',
  className,
  onClick,
}: KleurvormCardProps) {
  const baseClasses = variant === 'gradient' ? 'kleurvorm-card-gradient' : 'kleurvorm-card';
  
  return (
    <div
      className={cn(baseClasses, onClick && 'cursor-pointer', className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}