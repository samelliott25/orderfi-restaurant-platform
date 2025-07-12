import React from 'react';

interface NovelMovingBackgroundProps {
  className?: string;
  intensity?: 'subtle' | 'medium' | 'vibrant';
  speed?: 'slow' | 'medium' | 'fast';
  colorScheme?: 'warm' | 'cool' | 'neutral';
  style?: React.CSSProperties;
}

export const NovelMovingBackground: React.FC<NovelMovingBackgroundProps> = ({
  className = '',
  intensity = 'medium',
  speed = 'medium',
  colorScheme = 'warm',
  style,
}) => {
  const getIntensityValue = () => {
    switch (intensity) {
      case 'subtle': return 0.3;
      case 'medium': return 0.5;
      case 'vibrant': return 0.8;
      default: return 0.5;
    }
  };

  const getSpeedValue = () => {
    switch (speed) {
      case 'slow': return '20s';
      case 'medium': return '15s';
      case 'fast': return '10s';
      default: return '15s';
    }
  };

  const getColorScheme = () => {
    switch (colorScheme) {
      case 'warm': return {
        primary: 'hsl(25, 85%, 60%)',
        secondary: 'hsl(340, 82%, 52%)',
        accent: 'hsl(45, 100%, 50%)'
      };
      case 'cool': return {
        primary: 'hsl(200, 70%, 50%)',
        secondary: 'hsl(180, 60%, 45%)',
        accent: 'hsl(220, 80%, 60%)'
      };
      case 'neutral': return {
        primary: 'hsl(0, 0%, 40%)',
        secondary: 'hsl(0, 0%, 60%)',
        accent: 'hsl(0, 0%, 80%)'
      };
      default: return {
        primary: 'hsl(25, 85%, 60%)',
        secondary: 'hsl(340, 82%, 52%)',
        accent: 'hsl(45, 100%, 50%)'
      };
    }
  };

  const colors = getColorScheme();
  const intensityValue = getIntensityValue();
  const speedValue = getSpeedValue();

  const backgroundStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    overflow: 'hidden',
    pointerEvents: 'none',
    background: `
      radial-gradient(circle at 20% 20%, ${colors.primary.replace(')', `, ${intensityValue})`)} 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, ${colors.secondary.replace(')', `, ${intensityValue * 0.8})`)} 0%, transparent 50%),
      radial-gradient(circle at 40% 60%, ${colors.accent.replace(')', `, ${intensityValue * 0.6})`)} 0%, transparent 50%),
      linear-gradient(45deg, ${colors.primary.replace(')', `, ${intensityValue * 0.1})`)} 0%, transparent 100%)
    `,
    ...style,
  };

  return (
    <div className={`novel-moving-background ${className}`} style={backgroundStyle}>
      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute rounded-full opacity-60"
          style={{
            left: `${(i * 7 + 10) % 90}%`,
            top: `${(i * 11 + 15) % 85}%`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            background: i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent,
            animation: `float-${i % 3} ${speedValue} ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
            filter: `blur(${0.5 + (i % 2) * 0.5}px)`,
          }}
        />
      ))}

      {/* Geometric Patterns */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`geo-${i}`}
          className="absolute opacity-30"
          style={{
            left: `${(i * 12 + 5) % 85}%`,
            top: `${(i * 15 + 10) % 80}%`,
            width: `${15 + (i % 4) * 5}px`,
            height: `${15 + (i % 4) * 5}px`,
            border: `1px solid ${i % 2 === 0 ? colors.primary : colors.secondary}`,
            borderRadius: i % 3 === 0 ? '50%' : i % 3 === 1 ? '0%' : '10px',
            animation: `rotate-${i % 2} ${speedValue} linear infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}

      {/* Gradient Waves */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(ellipse at center, ${colors.primary}40 0%, transparent 70%),
            radial-gradient(ellipse at 30% 70%, ${colors.secondary}30 0%, transparent 70%)
          `,
          animation: `wave ${speedValue} ease-in-out infinite`,
        }}
      />

      {/* CSS Keyframes */}
      <style>{`
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-15px) translateX(5px); }
          50% { transform: translateY(-5px) translateX(-8px); }
          75% { transform: translateY(-12px) translateX(3px); }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-20px) translateX(-5px); }
          66% { transform: translateY(8px) translateX(10px); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-25px) translateX(-3px); }
        }
        
        @keyframes rotate-0 {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        
        @keyframes rotate-1 {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(-180deg) scale(0.9); }
          100% { transform: rotate(-360deg) scale(1); }
        }
        
        @keyframes wave {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.05) rotate(2deg); }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .novel-moving-background * {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default NovelMovingBackground;