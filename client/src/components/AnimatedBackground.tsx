import React from 'react';

interface AnimatedBackgroundProps {
  className?: string;
  intensity?: 'subtle' | 'medium' | 'vibrant';
  speed?: 'slow' | 'medium' | 'fast';
  style?: React.CSSProperties;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  className = '',
  intensity = 'medium',
  speed = 'medium',
  style,
}) => {
  const getAnimationDuration = () => {
    switch (speed) {
      case 'slow': return { pulse: '15s', fall: '20s' };
      case 'medium': return { pulse: '10s', fall: '15s' };
      case 'fast': return { pulse: '7s', fall: '10s' };
      default: return { pulse: '10s', fall: '15s' };
    }
  };

  const getOpacity = () => {
    switch (intensity) {
      case 'subtle': return 0.4;
      case 'medium': return 0.6;
      case 'vibrant': return 0.8;
      default: return 0.6;
    }
  };

  const durations = getAnimationDuration();
  const opacity = getOpacity();

  const backgroundStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    overflow: 'hidden',
    pointerEvents: 'none',
    background: 'linear-gradient(135deg, #FF6B00 0%, #FFA500 100%)',
    animation: `gradient-pulse ${durations.pulse} ease-in-out infinite`,
    ...style,
  };

  return (
    <div className={`animated-background ${className}`} style={backgroundStyle}>
      {/* First diagonal streak */}
      <div
        className="absolute"
        style={{
          top: '-50%',
          right: '20%',
          width: '8px',
          height: '200px',
          background: 'linear-gradient(to bottom, #00FF7F 0%, #FFFF00 100%)',
          borderRadius: '50px',
          opacity: opacity * 0.7,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transform: 'rotate(-30deg)',
          animation: `fall-streak ${durations.fall} linear infinite`,
          animationDelay: '0s',
        }}
      />
      
      {/* Second diagonal streak */}
      <div
        className="absolute"
        style={{
          top: '-50%',
          right: '30%',
          width: '6px',
          height: '150px',
          background: 'linear-gradient(to bottom, #00FF7F 0%, #FFFF00 100%)',
          borderRadius: '50px',
          opacity: opacity * 0.7,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transform: 'rotate(-45deg)',
          animation: `fall-streak ${durations.fall} linear infinite`,
          animationDelay: '3s',
        }}
      />
      
      {/* Third diagonal streak */}
      <div
        className="absolute"
        style={{
          top: '-50%',
          right: '40%',
          width: '7px',
          height: '180px',
          background: 'linear-gradient(to bottom, #00FF7F 0%, #FFFF00 100%)',
          borderRadius: '50px',
          opacity: opacity * 0.6,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transform: 'rotate(-35deg)',
          animation: `fall-streak ${durations.fall} linear infinite`,
          animationDelay: '6s',
        }}
      />
      
      {/* Fourth diagonal streak */}
      <div
        className="absolute"
        style={{
          top: '-50%',
          right: '10%',
          width: '5px',
          height: '120px',
          background: 'linear-gradient(to bottom, #00FF7F 0%, #FFFF00 100%)',
          borderRadius: '50px',
          opacity: opacity * 0.5,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transform: 'rotate(-25deg)',
          animation: `fall-streak ${durations.fall} linear infinite`,
          animationDelay: '9s',
        }}
      />

      {/* Left side streaks */}
      <div
        className="absolute"
        style={{
          top: '-50%',
          left: '15%',
          width: '9px',
          height: '220px',
          background: 'linear-gradient(to bottom, #00FF7F 0%, #FFFF00 100%)',
          borderRadius: '50px',
          opacity: opacity * 0.6,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transform: 'rotate(30deg)',
          animation: `fall-streak ${durations.fall} linear infinite`,
          animationDelay: '4s',
        }}
      />
      
      <div
        className="absolute"
        style={{
          top: '-50%',
          left: '25%',
          width: '6px',
          height: '160px',
          background: 'linear-gradient(to bottom, #00FF7F 0%, #FFFF00 100%)',
          borderRadius: '50px',
          opacity: opacity * 0.5,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transform: 'rotate(25deg)',
          animation: `fall-streak ${durations.fall} linear infinite`,
          animationDelay: '7s',
        }}
      />

      {/* CSS Keyframes */}
      <style>{`
        @keyframes gradient-pulse {
          0%, 100% {
            background: linear-gradient(135deg, #FF6B00 0%, #FFA500 100%);
          }
          50% {
            background: linear-gradient(135deg, #FF4500 0%, #FFD700 100%);
          }
        }

        @keyframes fall-streak {
          0% {
            top: -50%;
            opacity: 0.3;
          }
          10% {
            opacity: ${opacity * 0.7};
          }
          90% {
            opacity: ${opacity * 0.7};
          }
          100% {
            top: 150%;
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animated-background, .animated-background > div {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;