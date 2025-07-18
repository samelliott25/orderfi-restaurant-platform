import React, { useEffect, useRef } from 'react';
import { useTheme } from './theme-provider';

const InteractiveStarryBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastScrollY = useRef(0);
  const velocity = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Generate stars/particles
    const numStars = 200; // Adjust for density
    const stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5, // Small dots
      opacity: Math.random() * 0.5 + 0.5, // Subtle glow
      speed: Math.random() * 2 + 0.5, // Scroll response speed
      baseSpeed: Math.random() * 0.1 + 0.05, // Gentle constant movement
      twinkleSpeed: Math.random() * 0.02 + 0.01, // Twinkling effect
      twinkleOffset: Math.random() * Math.PI * 2, // Random twinkling start
      driftX: Math.random() * 0.2 - 0.1, // Random horizontal drift
      driftY: Math.random() * 0.2 - 0.1, // Random vertical drift
    }));

    // Draw function
    const draw = () => {
      // Use theme-aware background gradient
      if (theme === 'dark') {
        // Dark mode: solid black background
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        // Light mode: orange-white-pink gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#F5A623');     // Orange start
        gradient.addColorStop(0.5, '#ffffff');   // White middle
        gradient.addColorStop(1, '#ec4899');     // Pink end
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw stars with theme-aware colors
      const starColor = theme === 'dark' ? 'rgba(255, 255, 255, ' : 'rgba(100, 100, 100, '; // White stars in dark mode, darker gray in light mode for better visibility
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${starColor}${star.opacity * 0.4})`; // Slightly more visible stars
        ctx.shadowBlur = 2; // Minimal glow
        ctx.shadowColor = `${starColor}0.3)`;
        ctx.fill();
      });
    };

    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.01; // Time counter for twinkling
      
      // Update star positions with multiple movement types
      stars.forEach(star => {
        // Random floating movement
        star.x += star.driftX;
        star.y += star.driftY;
        
        // Constant gentle movement
        star.y += star.baseSpeed;
        
        // Strong scroll-based parallax movement
        star.y += velocity.current * star.speed * 3; // Increased scroll response
        star.x += velocity.current * star.speed * 0.5; // Slight horizontal movement too
        
        // Twinkling effect
        star.opacity = 0.3 + 0.4 * Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        
        // Wrap around screen (all directions)
        if (star.y > canvas.height) star.y = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.x > canvas.width) star.x = 0;
        if (star.x < 0) star.x = canvas.width;
      });

      draw();
      requestAnimationFrame(animate);
    };
    animate();

    // Scroll listener for interactive response
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      
      // More responsive scroll velocity
      velocity.current = delta * 0.1; // Use actual scroll delta for smoother response
      lastScrollY.current = currentScrollY;

      // Gradual dampening for smooth stop
      setTimeout(() => {
        velocity.current *= 0.85; // Faster dampening
        if (Math.abs(velocity.current) < 0.05) velocity.current = 0;
      }, 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [theme]); // Re-render when theme changes

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <div className="relative z-10">{children}</div> {/* App content on top */}
    </div>
  );
};

export default InteractiveStarryBackground;