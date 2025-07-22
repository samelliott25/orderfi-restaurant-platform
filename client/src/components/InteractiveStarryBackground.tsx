import React, { useEffect, useRef } from 'react';
import { useTheme } from './theme-provider';
import { useBackground } from './background-provider';
import gradient1 from '@assets/ef44eacd2cab3b49c13103dacec4858c_1753186432599.jpg';
import gradient2 from '@assets/676917154e67251c9a8226cf18dd7f66_1753186432590.jpg';
import gradient3 from '@assets/0c6e26854cfebc1c849c7a4e4feb772d_1753186432598.jpg';
import blurryBg from '@assets/20250722_1640_Blurry Light Background_simple_compose_01k0rdrpjaeyjshyjwnv27t7fw_1753186432597.png';
import darkBg from '@assets/20250718_2127_Neon Space Vibes_simple_compose_01k0emkcm6ez8v5n5bxrd1z1pb_1752838166332.png';

const InteractiveStarryBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const { background } = useBackground();
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

    // Load all background images
    const images = {
      gradient1: new Image(),
      gradient2: new Image(),
      gradient3: new Image(),
      gradient4: new Image(), // Will use CSS fallback
      blurry: new Image(),
      dark: new Image()
    };
    
    images.gradient1.src = gradient1;
    images.gradient2.src = gradient2;
    images.gradient3.src = gradient3;
    images.blurry.src = blurryBg;
    images.dark.src = darkBg;

    // Draw function
    const draw = () => {
      if (theme === 'dark') {
        // Always use dark background in dark mode
        if (images.dark.complete) {
          ctx.drawImage(images.dark, 0, 0, canvas.width, canvas.height);
        } else {
          ctx.fillStyle = '#0a0a0a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      } else {
        // Use selected background in light mode
        let backgroundImage: HTMLImageElement | null = null;
        let fallbackGradient: (ctx: CanvasRenderingContext2D) => void;
        
        switch (background) {
          case 'gradient1':
            backgroundImage = images.gradient1;
            fallbackGradient = (ctx) => {
              const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
              gradient.addColorStop(0, '#a5b4fc');
              gradient.addColorStop(0.5, '#f8bbf3');
              gradient.addColorStop(1, '#93c5fd');
              ctx.fillStyle = gradient;
            };
            break;
          case 'gradient2':
            backgroundImage = images.gradient2;
            fallbackGradient = (ctx) => {
              const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
              gradient.addColorStop(0, '#c084fc');
              gradient.addColorStop(0.5, '#fb7185');
              gradient.addColorStop(1, '#fbbf24');
              ctx.fillStyle = gradient;
            };
            break;
          case 'gradient3':
            backgroundImage = images.gradient3;
            fallbackGradient = (ctx) => {
              const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
              gradient.addColorStop(0, '#fbbf24');
              gradient.addColorStop(0.3, '#f97316');
              gradient.addColorStop(0.7, '#ec4899');
              gradient.addColorStop(1, '#8b5cf6');
              ctx.fillStyle = gradient;
            };
            break;
          case 'gradient4':
            // Pure CSS gradient for gradient4 (no image)
            fallbackGradient = (ctx) => {
              const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
              gradient.addColorStop(0, '#60a5fa');
              gradient.addColorStop(0.5, '#a78bfa');
              gradient.addColorStop(1, '#f472b6');
              ctx.fillStyle = gradient;
            };
            break;
          case 'blurry':
          default:
            backgroundImage = images.blurry;
            fallbackGradient = (ctx) => {
              const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
              gradient.addColorStop(0, '#f0f9ff');
              gradient.addColorStop(0.5, '#e0e7ff');
              gradient.addColorStop(1, '#fef3c7');
              ctx.fillStyle = gradient;
            };
            break;
        }
        
        if (backgroundImage && backgroundImage.complete) {
          ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        } else {
          fallbackGradient(ctx);
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }

      // Draw stars with theme-aware colors that complement the backgrounds
      const starColor = theme === 'dark' ? 'rgba(255, 255, 255, ' : 'rgba(255, 255, 255, '; // White stars for both modes to stand out against colorful backgrounds
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${starColor}${star.opacity * 0.6})`; // More visible stars against neon backgrounds
        ctx.shadowBlur = 3; // Slightly more glow to match neon aesthetic
        ctx.shadowColor = `${starColor}0.4)`;
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
  }, [theme, background]); // Re-render when theme changes

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <div className="relative z-10">{children}</div> {/* App content on top */}
    </div>
  );
};

export default InteractiveStarryBackground;