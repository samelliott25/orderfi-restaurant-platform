import React, { createContext, useContext, useState, useEffect } from 'react';

// Background options
export type BackgroundType = 'gradient1' | 'gradient2' | 'gradient3' | 'gradient4' | 'blurry';

interface BackgroundContextType {
  background: BackgroundType;
  setBackground: (background: BackgroundType) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};

export const BackgroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [background, setBackground] = useState<BackgroundType>(() => {
    const saved = localStorage.getItem('orderfi-background');
    return (saved as BackgroundType) || 'gradient1';
  });

  useEffect(() => {
    localStorage.setItem('orderfi-background', background);
  }, [background]);

  return (
    <BackgroundContext.Provider value={{ background, setBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
};