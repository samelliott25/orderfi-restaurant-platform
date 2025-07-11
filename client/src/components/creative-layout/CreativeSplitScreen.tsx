import React from 'react';
import { Button } from '@/components/ui/button';

interface CreativeSplitScreenProps {
  leftContent: {
    title: string;
    subtitle: string;
    description: string;
    buttonText?: string;
    onButtonClick?: () => void;
  };
  rightContent: React.ReactNode;
  className?: string;
}

export function CreativeSplitScreen({ 
  leftContent, 
  rightContent, 
  className = '' 
}: CreativeSplitScreenProps) {
  return (
    <div className={`split-screen ${className}`}>
      <div className="split-screen-left">
        <div className="text-center space-y-6">
          <div className="floating">
            <div className="blob-1 w-32 h-32 bg-white/20 mx-auto mb-8"></div>
          </div>
          
          <h1 className="text-5xl font-bold mb-4">
            {leftContent.title}
          </h1>
          
          <p className="text-2xl font-light mb-6 opacity-90">
            {leftContent.subtitle}
          </p>
          
          <p className="text-lg mb-8 max-w-md mx-auto opacity-80">
            {leftContent.description}
          </p>
          
          {leftContent.buttonText && (
            <Button
              onClick={leftContent.onButtonClick}
              className="btn-creative text-lg px-8 py-4"
            >
              {leftContent.buttonText}
            </Button>
          )}
        </div>
      </div>
      
      <div className="split-screen-right">
        <div className="floating-delayed">
          {rightContent}
        </div>
      </div>
    </div>
  );
}