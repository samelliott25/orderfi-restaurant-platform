import React from 'react';
import { cn } from '@/lib/utils';

interface UrbanistCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'green' | 'yellow' | 'dark';
  className?: string;
  hover?: boolean;
}

export function UrbanistCard({ 
  children, 
  variant = 'default', 
  className,
  hover = true 
}: UrbanistCardProps) {
  const baseStyles = "urbanist-card";
  
  const variantStyles = {
    default: "",
    green: "urbanist-card-green",
    yellow: "urbanist-card-yellow", 
    dark: "urbanist-card-dark"
  };

  return (
    <div 
      className={cn(
        baseStyles,
        variantStyles[variant],
        hover && "hover:urbanist-shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </div>
  );
}

interface UrbanistCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function UrbanistCardHeader({ children, className }: UrbanistCardHeaderProps) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

interface UrbanistCardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function UrbanistCardTitle({ children, className }: UrbanistCardTitleProps) {
  return (
    <h3 className={cn("urbanist-heading text-lg mb-1", className)}>
      {children}
    </h3>
  );
}

interface UrbanistCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function UrbanistCardContent({ children, className }: UrbanistCardContentProps) {
  return (
    <div className={cn("urbanist-body", className)}>
      {children}
    </div>
  );
}

interface UrbanistCardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function UrbanistCardDescription({ children, className }: UrbanistCardDescriptionProps) {
  return (
    <p className={cn("urbanist-small text-muted-foreground", className)}>
      {children}
    </p>
  );
}