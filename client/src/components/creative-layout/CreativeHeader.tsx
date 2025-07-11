import React from 'react';
import { Button } from '@/components/ui/button';
import { FloatingShapes } from './CreativeShapes';

interface CreativeHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  }>;
  className?: string;
}

export function CreativeHeader({ 
  title, 
  subtitle, 
  description, 
  actions = [],
  className = '' 
}: CreativeHeaderProps) {
  return (
    <div className={`creative-header relative ${className}`}>
      <FloatingShapes />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1 className="fluid-text font-bold mb-4 leading-tight">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-2xl font-light mb-6 opacity-90">
            {subtitle}
          </p>
        )}
        
        {description && (
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-80">
            {description}
          </p>
        )}
        
        {actions.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                variant={action.variant === 'outline' ? 'outline' : 'default'}
                className={`btn-creative ${action.variant === 'secondary' ? 'bg-white/20' : ''}`}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}