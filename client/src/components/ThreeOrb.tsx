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
      
      // Advanced noise functions
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
      
      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      
      // Fractal Brownian Motion for complex patterns
      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 0.0;
        for (int i = 0; i < 6; i++) {
          value += amplitude * noise(st);
          st *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }
      
      // Voronoi-like cellular pattern
      float voronoi(vec2 st) {
        vec2 i_st = floor(st);
        vec2 f_st = fract(st);
        float m_dist = 1.0;
        for (int y= -1; y <= 1; y++) {
          for (int x= -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x),float(y));
            vec2 point = random(i_st + neighbor) * vec2(1.0);
            point = 0.5 + 0.5*sin(time + 6.2831*point);
            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);
            m_dist = min(m_dist, dist);
          }
        }
        return m_dist;
      }
      
      void main() {
        vec2 st = vUv;
        vec3 pos = vPosition;
        float t = time * 0.8;
        
        // Create multiple pattern layers
        float angle = atan(st.y - 0.5, st.x - 0.5);
        float radius = length(st - 0.5);
        
        // Layer 1: Flowing energy streams
        vec2 flowUV = st + vec2(sin(t * 2.0 + st.y * 10.0) * 0.1, cos(t * 1.5 + st.x * 8.0) * 0.08);
        float flow = fbm(flowUV * 4.0 + t * 0.5);
        
        // Layer 2: Cellular/crystalline structure
        float cells = voronoi(st * 8.0 + vec2(sin(t * 0.7), cos(t * 0.9)));
        cells = smoothstep(0.1, 0.3, cells);
        
        // Layer 3: Plasma-like electric fields
        float plasma = sin(st.x * 15.0 + t * 3.0) * cos(st.y * 12.0 + t * 2.5);
        plasma += sin(length(st - 0.5) * 20.0 - t * 4.0) * 0.5;
        plasma = (plasma + 1.0) * 0.5; // Normalize to 0-1
        
        // Layer 4: Spiral galaxy arms
        float spiral = sin(angle * 3.0 + radius * 15.0 - t * 2.0) * exp(-radius * 2.0);
        spiral = (spiral + 1.0) * 0.5;
        
        // Layer 5: Neural network synapses
        float neural = noise(st * 20.0 + vec2(t * 0.6, -t * 0.4));
        neural *= smoothstep(0.7, 0.9, neural); // Create sparse connections
        
        // Dynamic color palette that shifts over time
        vec3 color1 = vec3(1.0, 0.4 + sin(t * 0.8) * 0.2, 0.1 + cos(t * 1.2) * 0.1); // Dynamic orange
        vec3 color2 = vec3(1.0, 0.2 + sin(t * 1.1) * 0.3, 0.6 + cos(t * 0.9) * 0.2); // Dynamic pink  
        vec3 color3 = vec3(0.6 + sin(t * 0.7) * 0.2, 0.2, 1.0); // Dynamic purple
        vec3 color4 = vec3(0.1, 0.8 + sin(t * 1.3) * 0.2, 1.0); // Dynamic cyan
        
        // Combine all layers with different mixing modes
        float mixer1 = flow * 0.4 + cells * 0.3 + spiral * 0.3;
        float mixer2 = plasma * 0.5 + neural * 0.5;
        
        vec3 baseColor = mix(mix(color1, color2, mixer1), mix(color3, color4, mixer2), radius);
        
        // Add dynamic energy pulses
        float pulse = sin(t * 4.0) * 0.5 + 0.5;
        float energyRing = smoothstep(0.3, 0.35, radius) * smoothstep(0.45, 0.4, radius);
        baseColor += energyRing * color2 * pulse * 0.8;
        
        // Volumetric depth effect
        float depth = 1.0 - smoothstep(0.0, 0.8, radius);
        baseColor *= depth;
        
        // Advanced fresnel with iridescence
        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 1.5);
        vec3 iridescent = vec3(
          sin(fresnel * 6.28 + t) * 0.5 + 0.5,
          sin(fresnel * 6.28 + t + 2.09) * 0.5 + 0.5,
          sin(fresnel * 6.28 + t + 4.18) * 0.5 + 0.5
        );
        baseColor += fresnel * iridescent * 0.3;
        
        // Subsurface scattering simulation
        float scatter = exp(-radius * 3.0) * (neural + flow) * 0.5;
        baseColor += scatter * color1 * 0.4;
        
        gl_FragColor = vec4(baseColor, 0.85 + fresnel * 0.15);
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