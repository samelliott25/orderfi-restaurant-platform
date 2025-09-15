import React from 'react';
import { useTheme } from './theme-provider';

const InteractiveStarryBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div 
        className={`absolute top-0 left-0 w-full h-full ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default InteractiveStarryBackground;