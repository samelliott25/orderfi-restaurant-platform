import React from 'react';

interface MovingTexturedBackgroundProps {
  className?: string;
  intensity?: 'subtle' | 'medium' | 'vibrant';
  speed?: 'slow' | 'medium' | 'fast';
  style?: React.CSSProperties;
}

export const MovingTexturedBackground: React.FC<MovingTexturedBackgroundProps> = ({
  className = '',
  intensity = 'medium',
  speed = 'medium',
  style,
}) => {
  const getIntensityOpacity = () => {
    switch (intensity) {
      case 'subtle': return 0.3;
      case 'medium': return 0.5;
      case 'vibrant': return 0.7;
      default: return 0.5;
    }
  };

  const getSpeedDuration = () => {
    switch (speed) {
      case 'slow': return '20s';
      case 'medium': return '15s';
      case 'fast': return '10s';
      default: return '15s';
    }
  };

  const backgroundStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    overflow: 'hidden',
    opacity: getIntensityOpacity(),
    '--speed-duration': getSpeedDuration(),
    ...style,
  } as React.CSSProperties;

  return (
    <div className={`moving-textured-background ${className}`} style={backgroundStyle}>
      {/* Primary gradient layer */}
      <div className="gradient-layer-1" />
      
      {/* Secondary gradient layer */}
      <div className="gradient-layer-2" />
      
      {/* Geometric pattern layer */}
      <div className="geometric-layer" />
      
      {/* Texture overlay */}
      <div className="texture-overlay" />
      
      {/* Floating particles */}
      <div className="particles-container">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={`particle particle-${i + 1}`} />
        ))}
      </div>

      <style jsx>{`
        .moving-textured-background {
          background: linear-gradient(135deg, #f97316 0%, #ec4899 100%);
          will-change: transform;
        }

        .gradient-layer-1 {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle at 30% 70%,
            rgba(249, 115, 22, 0.4) 0%,
            transparent 50%
          );
          animation: floatGradient1 var(--speed-duration) ease-in-out infinite;
          transform: translate3d(0, 0, 0);
        }

        .gradient-layer-2 {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle at 70% 30%,
            rgba(236, 72, 153, 0.4) 0%,
            transparent 50%
          );
          animation: floatGradient2 calc(var(--speed-duration) * 0.8) ease-in-out infinite reverse;
          transform: translate3d(0, 0, 0);
        }

        .geometric-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 60px 60px, 40px 40px;
          animation: geometricMove var(--speed-duration) linear infinite;
          transform: translate3d(0, 0, 0);
        }

        .texture-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.02) 2px,
              rgba(255, 255, 255, 0.02) 4px
            );
          animation: textureShift calc(var(--speed-duration) * 2) linear infinite;
          transform: translate3d(0, 0, 0);
        }

        .particles-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: floatParticle var(--speed-duration) ease-in-out infinite;
          transform: translate3d(0, 0, 0);
        }

        .particle-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
          animation-duration: calc(var(--speed-duration) * 1.2);
        }

        .particle-2 {
          top: 60%;
          left: 20%;
          animation-delay: -2s;
          animation-duration: calc(var(--speed-duration) * 0.8);
        }

        .particle-3 {
          top: 30%;
          left: 80%;
          animation-delay: -4s;
          animation-duration: calc(var(--speed-duration) * 1.5);
        }

        .particle-4 {
          top: 80%;
          left: 70%;
          animation-delay: -6s;
          animation-duration: calc(var(--speed-duration) * 0.9);
        }

        .particle-5 {
          top: 50%;
          left: 50%;
          animation-delay: -8s;
          animation-duration: calc(var(--speed-duration) * 1.1);
        }

        .particle-6 {
          top: 90%;
          left: 30%;
          animation-delay: -10s;
          animation-duration: calc(var(--speed-duration) * 1.3);
        }

        /* Keyframe animations */
        @keyframes floatGradient1 {
          0%, 100% {
            transform: translate3d(-10%, -10%, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(10%, 10%, 0) rotate(180deg);
          }
        }

        @keyframes floatGradient2 {
          0%, 100% {
            transform: translate3d(10%, 10%, 0) rotate(360deg);
          }
          50% {
            transform: translate3d(-10%, -10%, 0) rotate(180deg);
          }
        }

        @keyframes geometricMove {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(60px, 60px, 0);
          }
        }

        @keyframes textureShift {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(50px, 50px, 0);
          }
        }

        @keyframes floatParticle {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translate3d(20px, -15px, 0) scale(1.2);
            opacity: 0.8;
          }
          50% {
            transform: translate3d(-15px, -25px, 0) scale(0.8);
            opacity: 0.4;
          }
          75% {
            transform: translate3d(-25px, 15px, 0) scale(1.1);
            opacity: 0.7;
          }
        }

        /* Responsive optimizations */
        @media (max-width: 768px) {
          .gradient-layer-1,
          .gradient-layer-2 {
            width: 150%;
            height: 150%;
            top: -25%;
            left: -25%;
          }
          
          .particle {
            width: 2px;
            height: 2px;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .gradient-layer-1,
          .gradient-layer-2,
          .geometric-layer,
          .texture-overlay,
          .particle {
            animation-duration: calc(var(--speed-duration) * 3);
            animation-timing-function: ease-in-out;
          }
        }

        /* Dark mode adjustments */
        @media (prefers-color-scheme: dark) {
          .moving-textured-background {
            background: linear-gradient(135deg, #dc2626 0%, #7c3aed 100%);
          }
          
          .gradient-layer-1 {
            background: radial-gradient(
              circle at 30% 70%,
              rgba(220, 38, 38, 0.3) 0%,
              transparent 50%
            );
          }
          
          .gradient-layer-2 {
            background: radial-gradient(
              circle at 70% 30%,
              rgba(124, 58, 237, 0.3) 0%,
              transparent 50%
            );
          }
        }
      `}</style>
    </div>
  );
};

export default MovingTexturedBackground;