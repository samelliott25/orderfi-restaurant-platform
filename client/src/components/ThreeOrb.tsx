import React, { useEffect, useRef } from 'react';

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
    // Wait for Three.js to load with multiple attempts
    let attempts = 0;
    const maxAttempts = 10;
    
    const checkThreeJs = () => {
      if (typeof window !== 'undefined' && (window as any).THREE) {
        initThreeScene();
        return;
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(checkThreeJs, 100);
      } else {
        console.log('Three.js not loaded after multiple attempts, falling back to CSS orb');
      }
    };
    
    const initThreeScene = () => {
      const THREE = (window as any).THREE;
      
      if (!mountRef.current) return;

      const container = mountRef.current;
      const size = Math.min(container.clientWidth, container.clientHeight) || 320;
      
      // Create scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      
      // Create camera
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.position.z = 5;
      
      // Create renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(size, size);
      renderer.setClearColor(0x000000, 0);
      rendererRef.current = renderer;
      
      container.appendChild(renderer.domElement);
      
      // Create orb geometry
      const geometry = new THREE.SphereGeometry(2, 64, 64);
      
      // Advanced shader material for photorealistic glass orb
      const vertexShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normalMatrix * normal;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          
          gl_Position = projectionMatrix * mvPosition;
        }
      `;
      
      const fragmentShader = `
        uniform float time;
        uniform vec2 resolution;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        
        #define MAX_STEPS 100
        #define MAX_DIST 100.0
        #define SURF_DIST 0.01
        
        // Advanced noise functions for volumetric effects
        float hash(float n) { return fract(sin(n) * 1e4); }
        
        float noise3D(vec3 x) {
          const vec3 step = vec3(110, 241, 171);
          vec3 i = floor(x);
          vec3 f = fract(x);
          float n = dot(i, step);
          vec3 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                         mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
                     mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                         mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
        }
        
        // Fractal Brownian Motion for complex volumetric patterns
        float fbm3D(vec3 x) {
          float v = 0.0;
          float a = 0.5;
          vec3 shift = vec3(100);
          for (int i = 0; i < 6; ++i) {
            v += a * noise3D(x);
            x = x * 2.0 + shift;
            a *= 0.5;
          }
          return v;
        }
        
        // Sphere distance function for ray marching
        float sdSphere(vec3 p, float s) {
          return length(p) - s;
        }
        
        // Scene distance function
        float GetDist(vec3 p) {
          // Main sphere
          float sphere = sdSphere(p, 1.0);
          
          // Add volumetric noise for interior complexity
          float noise = fbm3D(p * 2.0 + time * 0.3) * 0.1;
          return sphere - noise;
        }
        
        // Ray marching function
        float RayMarch(vec3 ro, vec3 rd) {
          float dO = 0.0;
          for (int i = 0; i < MAX_STEPS; i++) {
            vec3 p = ro + rd * dO;
            float dS = GetDist(p);
            dO += dS;
            if (dO > MAX_DIST || dS < SURF_DIST) break;
          }
          return dO;
        }
        
        // Normal calculation for lighting
        vec3 GetNormal(vec3 p) {
          float d = GetDist(p);
          vec2 e = vec2(0.01, 0);
          vec3 n = d - vec3(
            GetDist(p - e.xyy),
            GetDist(p - e.yxy),
            GetDist(p - e.yyx)
          );
          return normalize(n);
        }
        
        // Advanced lighting model
        vec3 GetLight(vec3 p, vec3 normal, vec3 viewDir) {
          // Multiple light sources
          vec3 lightPos1 = vec3(2.0, 4.0, 6.0);
          vec3 lightPos2 = vec3(-3.0, -2.0, 4.0);
          vec3 lightPos3 = vec3(0.0, -4.0, -2.0);
          
          vec3 lightDir1 = normalize(lightPos1 - p);
          vec3 lightDir2 = normalize(lightPos2 - p);
          vec3 lightDir3 = normalize(lightPos3 - p);
          
          // Diffuse lighting
          float diff1 = max(dot(normal, lightDir1), 0.0);
          float diff2 = max(dot(normal, lightDir2), 0.0);
          float diff3 = max(dot(normal, lightDir3), 0.0);
          
          // Specular lighting
          vec3 reflectDir1 = reflect(-lightDir1, normal);
          vec3 reflectDir2 = reflect(-lightDir2, normal);
          vec3 reflectDir3 = reflect(-lightDir3, normal);
          
          float spec1 = pow(max(dot(viewDir, reflectDir1), 0.0), 64.0);
          float spec2 = pow(max(dot(viewDir, reflectDir2), 0.0), 32.0);
          float spec3 = pow(max(dot(viewDir, reflectDir3), 0.0), 16.0);
          
          // Light colors
          vec3 lightColor1 = vec3(1.0, 0.8, 0.6); // Warm orange
          vec3 lightColor2 = vec3(0.8, 0.4, 1.0); // Purple
          vec3 lightColor3 = vec3(0.2, 0.8, 1.0); // Cyan
          
          vec3 lighting = lightColor1 * (diff1 + spec1) +
                         lightColor2 * (diff2 + spec2) +
                         lightColor3 * (diff3 + spec3);
          
          return lighting;
        }
        
        // Volumetric interior effects
        vec3 GetVolumetricColor(vec3 rayPos, vec3 rayDir, float dist) {
          vec3 color = vec3(0.0);
          float stepSize = dist / 50.0;
          
          for (int i = 0; i < 50; i++) {
            vec3 pos = rayPos + rayDir * float(i) * stepSize;
            if (length(pos) > 1.0) break;
            
            // Create flowing volumetric patterns
            float density = fbm3D(pos * 3.0 + time * 0.5);
            density *= smoothstep(1.0, 0.3, length(pos));
            
            // Color based on position and time
            vec3 volColor = vec3(
              0.8 + 0.4 * sin(pos.x * 4.0 + time),
              0.4 + 0.6 * sin(pos.y * 3.0 + time * 1.3),
              0.9 + 0.3 * sin(pos.z * 5.0 + time * 0.8)
            );
            
            color += volColor * density * 0.02;
          }
          
          return color;
        }
        
        void main() {
          vec2 uv = (vUv - 0.5) * 2.0;
          
          // Camera setup
          vec3 ro = vec3(0.0, 0.0, 3.0); // Ray origin
          vec3 rd = normalize(vec3(uv, -1.0)); // Ray direction
          
          // Ray marching
          float d = RayMarch(ro, rd);
          
          vec3 finalColor = vec3(0.0);
          
          if (d < MAX_DIST) {
            vec3 p = ro + rd * d;
            vec3 normal = GetNormal(p);
            vec3 viewDir = normalize(ro - p);
            
            // Surface lighting
            vec3 lighting = GetLight(p, normal, viewDir);
            
            // Fresnel effect for glass-like appearance
            float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
            
            // Refraction effect
            vec3 refractDir = refract(-viewDir, normal, 0.9);
            vec3 refractColor = GetVolumetricColor(p, refractDir, 2.0);
            
            // Reflection effect
            vec3 reflectDir = reflect(-viewDir, normal);
            vec3 reflectColor = vec3(0.2, 0.6, 1.0) * 0.3; // Sky reflection
            
            // Chromatic dispersion for rainbow effect
            float dispersion = 0.02;
            vec3 dispersionR = refract(-viewDir, normal, 0.95);
            vec3 dispersionG = refract(-viewDir, normal, 0.92);
            vec3 dispersionB = refract(-viewDir, normal, 0.89);
            
            vec3 chromaticColor = vec3(
              GetVolumetricColor(p, dispersionR, 2.0).r,
              GetVolumetricColor(p, dispersionG, 2.0).g,
              GetVolumetricColor(p, dispersionB, 2.0).b
            );
            
            // Combine all effects
            finalColor = mix(refractColor + chromaticColor, reflectColor, fresnel);
            finalColor += lighting * 0.3;
            
            // Add rim lighting
            float rim = 1.0 - max(dot(viewDir, normal), 0.0);
            finalColor += pow(rim, 2.0) * vec3(1.0, 0.5, 0.8) * 0.5;
            
          } else {
            // Background gradient
            float gradient = length(uv) * 0.5;
            finalColor = mix(vec3(0.1, 0.05, 0.2), vec3(0.02, 0.02, 0.1), gradient);
          }
          
          // Add atmospheric glow around the sphere
          float sphereDist = length(uv);
          float glow = exp(-sphereDist * 2.0) * 0.3;
          finalColor += vec3(1.0, 0.6, 0.8) * glow;
          
          // Tone mapping and gamma correction
          finalColor = finalColor / (finalColor + vec3(1.0));
          finalColor = pow(finalColor, vec3(1.0/2.2));
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `;
      
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          time: { value: 0 },
          resolution: { value: new THREE.Vector2(size, size) }
        },
        transparent: true,
        side: THREE.DoubleSide
      });
      
      const orb = new THREE.Mesh(geometry, material);
      scene.add(orb);
      
      // Create floating particles around the orb
      const particleGeometry = new THREE.BufferGeometry();
      const particleCount = 50;
      const positions = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 3 + Math.random() * 2;
        const height = (Math.random() - 0.5) * 4;
        
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = height;
        positions[i * 3 + 2] = Math.sin(angle) * radius;
      }
      
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const particleMaterial = new THREE.PointsMaterial({
        color: 0xff6b9d,
        size: 0.05,
        transparent: true,
        opacity: 0.8
      });
      
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);
      
      // Animation loop
      function animate() {
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
    };
    
    checkThreeJs();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
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
      style={{
        background: 'radial-gradient(circle, rgba(255,107,157,0.1) 0%, rgba(255,165,0,0.1) 50%, rgba(138,43,226,0.1) 100%)',
        borderRadius: '50%',
        cursor: 'pointer'
      }}
    >
      {/* Fallback CSS orb for when Three.js isn't available */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 opacity-80 animate-pulse" />
      <div className="absolute inset-4 rounded-full bg-gradient-to-tl from-orange-300 via-pink-400 to-purple-500 opacity-60 animate-pulse" />
      <div className="absolute inset-8 rounded-full bg-gradient-to-br from-orange-200 via-pink-300 to-purple-400 opacity-40 animate-pulse" />
    </div>
  );
}