import React, { useEffect, useRef } from 'react';

const InteractiveStarryBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
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
      speed: Math.random() * 0.5 + 0.1, // Base speed
      baseSpeed: Math.random() * 0.2 + 0.1, // Constant gentle movement
      twinkleSpeed: Math.random() * 0.02 + 0.01, // Twinkling effect
      twinkleOffset: Math.random() * Math.PI * 2, // Random twinkling start
    }));

    // Draw function
    const draw = () => {
      // Clear canvas with orange gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#FF4500'); // Top orange
      gradient.addColorStop(1, '#FFA500'); // Bottom yellow-orange
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars with glow
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`; // White dots for stars
        ctx.shadowBlur = 5; // Soft glow
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
      });
    };

    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.01; // Time counter for twinkling
      
      // Update star positions based on velocity (scroll direction) + constant movement
      stars.forEach(star => {
        // Constant gentle downward movement
        star.y += star.baseSpeed;
        
        // Add scroll-based parallax movement
        star.y += velocity.current * star.speed; 
        
        // Twinkling effect
        star.opacity = 0.3 + 0.4 * Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        
        // Wrap around screen
        if (star.y > canvas.height) star.y = 0;
        if (star.y < 0) star.y = canvas.height;
      });

      draw();
      requestAnimationFrame(animate);
    };
    animate();

    // Scroll listener for interactive response
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      velocity.current = delta > 0 ? 1 : -1; // Positive for down scroll (stars move up), negative for up
      lastScrollY.current = currentScrollY;

      // Dampen velocity over time for smooth stop
      setTimeout(() => {
        velocity.current *= 0.95; // Friction
        if (Math.abs(velocity.current) < 0.1) velocity.current = 0;
      }, 100);
    };
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <div className="relative z-10">{children}</div> {/* App content on top */}
    </div>
  );
};

export default InteractiveStarryBackground;