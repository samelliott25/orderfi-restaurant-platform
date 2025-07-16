import React from 'react';
import { cn } from '@/lib/utils';

interface UrbanistButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function UrbanistButton({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className,
  onClick,
  disabled,
  type = 'button',
  ...props 
}: UrbanistButtonProps) {
  const baseStyles = "urbanist-btn";
  
  const variantStyles = {
    primary: "urbanist-btn-primary",
    secondary: "urbanist-btn-secondary",
    outline: "urbanist-btn-outline"
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}