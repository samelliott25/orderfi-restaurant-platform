import { useEffect, useRef } from 'react';

interface ThreeOrbProps {
  onTouchStart?: (e: React.TouchEvent | React.MouseEvent) => void;
  onTouchEnd?: (e: React.TouchEvent | React.MouseEvent) => void;
  className?: string;
}

export function ThreeOrb({ onTouchStart, onTouchEnd, className }: ThreeOrbProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    // Check if Three.js is available
    if (typeof window === 'undefined' || !(window as any).THREE) {
      console.log('Three.js not loaded, falling back to CSS orb');
      return;
    }

    const THREE = (window as any).THREE;
    
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    const container = mountRef.current;
    const size = Math.min(container.clientWidth, container.clientHeight);
    
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create orb geometry
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    
    // Advanced shader material for cosmic orb
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      void main() {
        vUv = uv;
        vPosition = position;
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    
    const fragmentShader = `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      // Noise function
      float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
      
      void main() {
        vec2 st = vUv;
        
        // Create swirling pattern
        float angle = atan(st.y - 0.5, st.x - 0.5);
        float radius = length(st - 0.5);
        
        // Animated rotation
        angle += time * 0.5;
        
        // Gas giant bands
        float bands = sin(st.y * 20.0 + time * 2.0) * 0.1;
        float swirl = sin(angle * 4.0 + radius * 10.0 + time) * 0.2;
        
        // Color mixing
        vec3 color1 = vec3(1.0, 0.4, 0.1); // Orange
        vec3 color2 = vec3(1.0, 0.2, 0.6); // Pink
        vec3 color3 = vec3(0.6, 0.2, 1.0); // Purple
        
        float mixer = (bands + swirl + radius) * 0.5 + 0.5;
        vec3 finalColor = mix(mix(color1, color2, mixer), color3, radius);
        
        // Add energy glow
        float glow = 1.0 - radius * 2.0;
        glow = max(0.0, glow);
        finalColor += glow * 0.3;
        
        // Fresnel effect for glassy look
        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
        finalColor += fresnel * 0.5;
        
        gl_FragColor = vec4(finalColor, 0.9);
      }
    `;
    
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 }
      },
      transparent: true,
      side: THREE.DoubleSide
    });
    
    const orb = new THREE.Mesh(geometry, material);
    scene.add(orb);
    
    // Add particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 3 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.8
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    camera.position.z = 6;
    
    sceneRef.current = scene;
    rendererRef.current = renderer;
    
    // Animation loop
    function animate() {
      if (!sceneRef.current || !rendererRef.current) return;
      
      animationRef.current = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;
      material.uniforms.time.value = time;
      
      // Rotate orb slowly
      orb.rotation.y = time * 0.2;
      orb.rotation.x = Math.sin(time * 0.1) * 0.1;
      
      // Rotate particles
      particles.rotation.y = time * 0.1;
      particles.rotation.x = time * 0.05;
      
      rendererRef.current.render(sceneRef.current, camera);
    }
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const newSize = Math.min(container.clientWidth, container.clientHeight);
      rendererRef.current.setSize(newSize, newSize);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className={`w-80 h-80 relative ${className}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onTouchStart}
      onMouseUp={onTouchEnd}
      style={{ cursor: 'pointer' }}
    >
      {/* Fallback CSS orb */}
      <div className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 animate-pulse opacity-50" />
    </div>
  );
}