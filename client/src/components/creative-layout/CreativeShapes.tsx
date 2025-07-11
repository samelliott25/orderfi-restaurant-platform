import React from 'react';

interface CreativeShapesProps {
  variant: 'blob' | 'star' | 'card-angle';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'accent' | 'neutral';
  className?: string;
  children?: React.ReactNode;
}

export function CreativeShapes({ 
  variant, 
  size = 'md', 
  color = 'primary',
  className = '',
  children 
}: CreativeShapesProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  const colorClasses = {
    primary: 'bg-gradient-to-br from-orange-500 to-orange-600',
    secondary: 'bg-gradient-to-br from-pink-500 to-pink-600',
    accent: 'bg-gradient-to-br from-purple-500 to-purple-600',
    neutral: 'bg-gray-200 dark:bg-gray-700'
  };

  const variantClasses = {
    blob: 'blob-1',
    star: 'star-shape',
    'card-angle': 'card-angle-left'
  };

  const baseClasses = `${sizeClasses[size]} ${colorClasses[color]} ${variantClasses[variant]}`;

  return (
    <div className={`${baseClasses} ${className} flex items-center justify-center`}>
      {children}
    </div>
  );
}

// Floating Background Shapes Component
export function FloatingShapes({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <CreativeShapes 
        variant="blob" 
        size="lg" 
        color="primary"
        className="absolute top-10 left-10 floating opacity-20"
      />
      <CreativeShapes 
        variant="star" 
        size="md" 
        color="secondary"
        className="absolute top-1/4 right-20 floating-delayed opacity-30"
      />
      <CreativeShapes 
        variant="blob" 
        size="xl" 
        color="accent"
        className="absolute bottom-20 left-1/4 floating opacity-10"
      />
      <CreativeShapes 
        variant="star" 
        size="sm" 
        color="primary"
        className="absolute bottom-10 right-10 floating opacity-25"
      />
    </div>
  );
}