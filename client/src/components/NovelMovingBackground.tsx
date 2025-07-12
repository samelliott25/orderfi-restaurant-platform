import React, { useEffect, useRef } from 'react';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    opacity: number;
    hue: number;
    life: number;
    maxLife: number;
  }

  const getIntensitySettings = () => {
    switch (intensity) {
      case 'subtle': return { opacity: 0.2, particleCount: 30, glowIntensity: 0.3 };
      case 'medium': return { opacity: 0.4, particleCount: 60, glowIntensity: 0.5 };
      case 'vibrant': return { opacity: 0.6, particleCount: 100, glowIntensity: 0.8 };
      default: return { opacity: 0.4, particleCount: 60, glowIntensity: 0.5 };
    }
  };

  const getSpeedSettings = () => {
    switch (speed) {
      case 'slow': return { baseSpeed: 0.3, pulseSpeed: 0.02 };
      case 'medium': return { baseSpeed: 0.5, pulseSpeed: 0.03 };
      case 'fast': return { baseSpeed: 0.8, pulseSpeed: 0.05 };
      default: return { baseSpeed: 0.5, pulseSpeed: 0.03 };
    }
  };

  const getColorScheme = () => {
    switch (colorScheme) {
      case 'warm': return { 
        primary: [25, 85, 60], // Orange
        secondary: [340, 82, 52], // Pink
        accent: [45, 100, 50] // Yellow
      };
      case 'cool': return { 
        primary: [200, 70, 50], // Blue
        secondary: [180, 60, 45], // Teal
        accent: [220, 80, 60] // Purple
      };
      case 'neutral': return { 
        primary: [0, 0, 40], // Gray
        secondary: [0, 0, 60], // Light Gray
        accent: [0, 0, 80] // Very Light Gray
      };
      default: return { 
        primary: [25, 85, 60],
        secondary: [340, 82, 52],
        accent: [45, 100, 50]
      };
    }
  };

  const createParticle = (width: number, height: number): Particle => {
    const colors = getColorScheme();
    const colorKeys = Object.keys(colors);
    const selectedColor = colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]];
    
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      hue: selectedColor[0],
      life: 0,
      maxLife: Math.random() * 300 + 200,
    };
  };

  const initializeParticles = (width: number, height: number) => {
    const settings = getIntensitySettings();
    particlesRef.current = [];
    
    for (let i = 0; i < settings.particleCount; i++) {
      particlesRef.current.push(createParticle(width, height));
    }
  };

  const drawGradientBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const colors = getColorScheme();
    const settings = getIntensitySettings();
    
    // Create multiple gradient layers
    const gradient1 = ctx.createRadialGradient(width * 0.3, height * 0.3, 0, width * 0.3, height * 0.3, width * 0.6);
    const gradient2 = ctx.createRadialGradient(width * 0.7, height * 0.7, 0, width * 0.7, height * 0.7, width * 0.4);
    
    // Animate gradient positions
    const offset1 = Math.sin(time * 0.001) * 0.1;
    const offset2 = Math.cos(time * 0.0015) * 0.1;
    
    gradient1.addColorStop(0, `hsla(${colors.primary[0]}, ${colors.primary[1]}%, ${colors.primary[2]}%, ${settings.opacity * 0.8})`);
    gradient1.addColorStop(0.5, `hsla(${colors.secondary[0]}, ${colors.secondary[1]}%, ${colors.secondary[2]}%, ${settings.opacity * 0.4})`);
    gradient1.addColorStop(1, 'transparent');
    
    gradient2.addColorStop(0, `hsla(${colors.accent[0]}, ${colors.accent[1]}%, ${colors.accent[2]}%, ${settings.opacity * 0.6})`);
    gradient2.addColorStop(0.5, `hsla(${colors.primary[0]}, ${colors.primary[1]}%, ${colors.primary[2]}%, ${settings.opacity * 0.3})`);
    gradient2.addColorStop(1, 'transparent');
    
    // Draw animated gradients
    ctx.fillStyle = gradient1;
    ctx.fillRect(0, 0, width, height);
    
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
  };

  const drawGeometricPatterns = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const colors = getColorScheme();
    const settings = getIntensitySettings();
    
    // Draw floating hexagons
    for (let i = 0; i < 8; i++) {
      const x = (width / 4) * (i % 4) + Math.sin(time * 0.001 + i) * 50;
      const y = (height / 2) * Math.floor(i / 4) + Math.cos(time * 0.0008 + i) * 30;
      const size = 20 + Math.sin(time * 0.002 + i) * 5;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(time * 0.0005 + i);
      
      ctx.strokeStyle = `hsla(${colors.primary[0]}, ${colors.primary[1]}%, ${colors.primary[2]}%, ${settings.opacity * 0.3})`;
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      for (let j = 0; j < 6; j++) {
        const angle = (j * Math.PI) / 3;
        const px = Math.cos(angle) * size;
        const py = Math.sin(angle) * size;
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      
      ctx.restore();
    }
  };

  const updateAndDrawParticles = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const settings = getIntensitySettings();
    const speedSettings = getSpeedSettings();
    
    particlesRef.current.forEach((particle, index) => {
      // Update particle position
      particle.x += particle.vx * speedSettings.baseSpeed;
      particle.y += particle.vy * speedSettings.baseSpeed;
      particle.life++;
      
      // Apply gentle gravitational pull toward center
      const centerX = width / 2;
      const centerY = height / 2;
      const dx = centerX - particle.x;
      const dy = centerY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        particle.vx += (dx / distance) * 0.01;
        particle.vy += (dy / distance) * 0.01;
      }
      
      // Apply velocity damping
      particle.vx *= 0.998;
      particle.vy *= 0.998;
      
      // Wrap around screen edges
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;
      
      // Calculate life-based opacity
      const lifeRatio = particle.life / particle.maxLife;
      const fadeOpacity = lifeRatio < 0.5 ? lifeRatio * 2 : (1 - lifeRatio) * 2;
      
      // Draw particle with glow effect
      const glowRadius = particle.radius * 3;
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, glowRadius
      );
      
      gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 60%, ${fadeOpacity * particle.opacity * settings.glowIntensity})`);
      gradient.addColorStop(0.5, `hsla(${particle.hue}, 70%, 60%, ${fadeOpacity * particle.opacity * 0.3})`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.save();
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      
      // Regenerate particle if it's dead
      if (particle.life >= particle.maxLife) {
        particlesRef.current[index] = createParticle(width, height);
      }
    });
  };

  const animate = (time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background gradients
    drawGradientBackground(ctx, width, height, time);
    
    // Draw geometric patterns
    drawGeometricPatterns(ctx, width, height, time);
    
    // Update and draw particles
    updateAndDrawParticles(ctx, width, height, time);
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    
    initializeParticles(canvas.width, canvas.height);
  };

  useEffect(() => {
    handleResize();
    animationRef.current = requestAnimationFrame(animate);
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity, speed, colorScheme]);

  const backgroundStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    overflow: 'hidden',
    pointerEvents: 'none',
    ...style,
  };

  return (
    <div className={`novel-moving-background ${className}`} style={backgroundStyle}>
      {/* Canvas for WebGL-like effects */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.7,
        }}
      />
      
      {/* CSS-based overlay effects */}
      <div
        className="css-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, hsla(25, 85%, 60%, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, hsla(340, 82%, 52%, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, hsla(45, 100%, 50%, 0.05) 0%, transparent 50%)
          `,
          animation: 'pulse 8s ease-in-out infinite',
        }}
      />
      
      {/* Floating geometric elements */}
      <div
        className="floating-elements"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
        }}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="floating-element"
            style={{
              position: 'absolute',
              left: `${(i * 16) % 100}%`,
              top: `${(i * 23) % 100}%`,
              width: '2px',
              height: '2px',
              borderRadius: '50%',
              background: `hsla(${25 + i * 60}, 70%, 60%, 0.4)`,
              animation: `float ${8 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
      
      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(120deg);
          }
          66% {
            transform: translateY(10px) rotate(240deg);
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .novel-moving-background * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default NovelMovingBackground;