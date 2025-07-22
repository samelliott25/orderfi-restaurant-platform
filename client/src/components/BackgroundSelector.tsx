import React from 'react';
import { useBackground, BackgroundType } from './background-provider';
import { Palette } from 'lucide-react';

const backgroundOptions = [
  {
    id: 'gradient1' as BackgroundType,
    name: 'Blue Pink',
    preview: 'linear-gradient(135deg, #a5b4fc 0%, #f8bbf3 50%, #93c5fd 100%)'
  },
  {
    id: 'gradient2' as BackgroundType,
    name: 'Purple Orange',
    preview: 'linear-gradient(135deg, #c084fc 0%, #fb7185 50%, #fbbf24 100%)'
  },
  {
    id: 'gradient3' as BackgroundType,
    name: 'Sunset',
    preview: 'linear-gradient(135deg, #fbbf24 0%, #f97316 30%, #ec4899 70%, #8b5cf6 100%)'
  },
  {
    id: 'gradient4' as BackgroundType,
    name: 'Ocean',
    preview: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)'
  },
  {
    id: 'blurry' as BackgroundType,
    name: 'Soft Blur',
    preview: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #fef3c7 100%)'
  }
];

export const BackgroundSelector: React.FC = () => {
  const { background, setBackground } = useBackground();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="liquid-glass-card p-3 rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-white/70" />
          <span className="text-white/70 text-sm font-medium">Background</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {backgroundOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setBackground(option.id)}
              className={`
                w-12 h-12 rounded-xl border-2 transition-all duration-200 relative overflow-hidden
                ${background === option.id 
                  ? 'border-white/50 scale-110 shadow-lg' 
                  : 'border-white/20 hover:border-white/30 hover:scale-105'
                }
              `}
              style={{ background: option.preview }}
              title={option.name}
            >
              {background === option.id && (
                <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};