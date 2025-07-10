import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface GlassMorphismCardProps {
  children: React.ReactNode;
  className?: string;
  blurIntensity?: number;
  depth?: number;
  enableHover?: boolean;
  gradient?: string;
  'data-testid'?: string;
}

export const GlassMorphismCard: React.FC<GlassMorphismCardProps> = ({
  children,
  className = '',
  blurIntensity = 16,
  depth = 1,
  enableHover = true,
  gradient = 'from-white/20 via-white/10 to-white/5',
  'data-testid': testId = 'glassmorphism-card'
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  // Transform mouse position to rotation values
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  // Dynamic blur and opacity based on hover
  const dynamicBlur = useTransform(
    mouseX,
    [-300, 300],
    [blurIntensity, blurIntensity * 1.2]
  );

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!enableHover) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      className={`relative group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: enableHover ? rotateX : 0,
        rotateY: enableHover ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{
        scale: enableHover ? 1.02 : 1,
        z: depth * 10,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
      data-testid={testId}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.3) 0%, transparent 70%)`,
        }}
      />
      
      {/* Main glass card */}
      <Card
        className={`
          relative overflow-hidden border-0 shadow-2xl
          bg-gradient-to-br ${gradient}
          backdrop-blur-[${blurIntensity}px]
          before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-black/10
          before:rounded-xl before:pointer-events-none
          after:absolute after:inset-px after:bg-gradient-to-br after:from-white/20 after:via-transparent after:to-transparent
          after:rounded-xl after:pointer-events-none
        `}
        style={{
          backdropFilter: `blur(${blurIntensity}px)`,
          WebkitBackdropFilter: `blur(${blurIntensity}px)`,
          transform: `translateZ(${depth * 10}px)`,
        }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)`,
          }}
          animate={{
            x: isHovered ? ['-100%', '100%'] : '-100%',
          }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut',
          }}
        />
        
        {/* Content */}
        <CardContent className="relative z-10 p-6">
          {children}
        </CardContent>
      </Card>
      
      {/* Floating particles effect */}
      {enableHover && isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default GlassMorphismCard;