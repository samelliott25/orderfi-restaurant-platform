import React, { useEffect, useRef } from 'react';

interface MarbleOrbProps {
  onTouchStart?: (e: React.TouchEvent | React.MouseEvent) => void;
  onTouchEnd?: (e: React.TouchEvent | React.MouseEvent) => void;
  className?: string;
}

export function MarbleOrb({ onTouchStart, onTouchEnd, className }: MarbleOrbProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10;
    
    const checkThreeJs = () => {
      if (typeof window !== 'undefined' && (window as any).THREE) {
        console.log('Three.js loaded successfully, creating marble orb...');
        initMarbleScene();
        return;
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        console.log(`Three.js not ready, attempt ${attempts}/${maxAttempts}`);
        setTimeout(checkThreeJs, 200);
      } else {
        console.error('Three.js failed to load after multiple attempts');
      }
    };
    
    const initMarbleScene = () => {
      const THREE = (window as any).THREE;
      
      if (!mountRef.current) return;

      const container = mountRef.current;
      const size = Math.min(container.clientWidth, container.clientHeight) || 320;
      
      // Create scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      
      // Create camera
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.z = 3;
      
      // Create renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(size, size);
      renderer.setClearColor(0x000000, 0);
      rendererRef.current = renderer;
      
      container.appendChild(renderer.domElement);
      
      // Simplex noise GLSL implementation
      const NOISE_FUNC = `
        //
        // GLSL textureless classic 3D noise "cnoise",
        // with an RSL-style periodic variant "pnoise".
        // Author:  Stefan Gustavson (stefan.gustavson@liu.se)
        // Version: 2011-10-11
        //
        vec3 mod289(vec3 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 mod289(vec4 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 permute(vec4 x) {
             return mod289(((x*34.0)+1.0)*x);
        }

        vec4 taylorInvSqrt(vec4 r) {
          return 1.79284291400159 - 0.85373472095314 * r;
        }

        float snoise(vec3 v) { 
          const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
          const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

          vec3 i  = floor(v + dot(v, C.yyy) );
          vec3 x0 =   v - i + dot(i, C.xxx) ;

          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min( g.xyz, l.zxy );
          vec3 i2 = max( g.xyz, l.zxy );

          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
          vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

          i = mod289(i); 
          vec4 p = permute( permute( permute( 
                     i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                   + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                   + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

          float n_ = 0.142857142857; // 1.0/7.0
          vec3  ns = n_ * D.wyz - D.xzx;

          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);

          vec4 b0 = vec4( x.xy, y.xy );
          vec4 b1 = vec4( x.zw, y.zw );

          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));

          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);

          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;

          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                        dot(p2,x2), dot(p3,x3) ) );
        }
      `;

      // Create sphere geometry with high resolution for smooth marble
      const geometry = new THREE.SphereGeometry(1, 256, 256);
      
      // Define uniforms for the cosmic orb shader
      const uniforms = {
        time: { value: 0 },
        color1: { value: new THREE.Color(0xFF6B00) }, // OrderFi Orange
        color2: { value: new THREE.Color(0xFF1493) }, // Hot Pink
        color3: { value: new THREE.Color(0x8A2BE2) }, // Purple
        opacity: { value: 0.85 },
      };

      // Advanced marble shader material
      const orbMaterial = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPos;
          varying vec3 vWorldPos;
          varying vec3 vViewDir;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPos = position;
            
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPos = worldPos.xyz;
            vViewDir = normalize(cameraPosition - worldPos.xyz);
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          varying vec3 vNormal;
          varying vec3 vPos;
          varying vec3 vWorldPos;
          varying vec3 vViewDir;
          uniform float time;
          uniform vec3 color1;
          uniform vec3 color2;
          uniform vec3 color3;
          uniform float opacity;
          
          ${NOISE_FUNC}
          
          void main() {
            vec3 pos = vPos;
            float t = time;
            
            // Ferrofluid ripple coordinates
            vec2 ripple_center1 = vec2(sin(t * 1.2) * 0.3, cos(t * 0.8) * 0.4);
            vec2 ripple_center2 = vec2(cos(t * 1.5) * 0.5, sin(t * 1.1) * 0.3);
            vec2 ripple_center3 = vec2(sin(t * 0.9) * 0.4, cos(t * 1.3) * 0.5);
            
            // Dynamic ripples emanating from moving centers
            float ripple1 = length(pos.xy - ripple_center1);
            float ripple2 = length(pos.xy - ripple_center2);
            float ripple3 = length(pos.xy - ripple_center3);
            
            // Ferrofluid wave patterns
            float wave1 = sin(ripple1 * 8.0 - t * 3.0) * exp(-ripple1 * 2.0);
            float wave2 = cos(ripple2 * 6.0 - t * 2.5) * exp(-ripple2 * 1.8);
            float wave3 = sin(ripple3 * 10.0 - t * 4.0) * exp(-ripple3 * 2.2);
            
            // Flowing ferrofluid streams
            vec3 flow_pos = pos + vec3(
              sin(pos.y * 4.0 + t * 2.0) * 0.2,
              cos(pos.x * 3.0 + t * 1.8) * 0.15,
              0.0
            );
            
            // Multiple flowing noise layers for organic movement
            float flow1 = snoise(flow_pos * 3.0 + vec3(t * 0.8, 0.0, 0.0));
            float flow2 = snoise(flow_pos * 6.0 + vec3(0.0, t * 1.2, 0.0));
            float flow3 = snoise(flow_pos * 9.0 + vec3(t * 0.6, t * 0.9, 0.0));
            
            // Combine waves and flows for ferrofluid effect
            float ferrofluid = (wave1 + wave2 + wave3) * 0.3 + (flow1 + flow2 + flow3) * 0.4;
            
            // Sharp marble boundaries - no smoothing
            float marble_mask = step(0.0, ferrofluid);
            float contrast_boost = step(0.4, abs(ferrofluid));
            
            // Sharp vein edges with high frequency detail
            float vein_flow = sin(pos.x * 15.0 + flow1 * 8.0 + t * 4.0) * cos(pos.y * 12.0 + flow2 * 6.0 + t * 3.5);
            vein_flow = step(0.6, abs(vein_flow));
            
            // High contrast OrderFi colors
            vec3 bright_orange = vec3(1.0, 0.4, 0.0);      // Vibrant orange
            vec3 electric_pink = vec3(1.0, 0.2, 0.6);      // Electric pink
            vec3 deep_magenta = vec3(0.8, 0.0, 0.5);       // Deep magenta
            vec3 hot_orange = vec3(1.0, 0.5, 0.1);         // Hot orange
            
            // Base ferrofluid color mixing
            vec3 base_color = mix(bright_orange, electric_pink, marble_mask);
            base_color = mix(base_color, deep_magenta, contrast_boost * 0.7);
            
            // Sharp flowing vein patterns
            base_color = mix(base_color, hot_orange, vein_flow);
            
            // High frequency marble streaks
            float streak1 = step(0.8, abs(sin(pos.x * 25.0 + flow1 * 10.0 + t * 5.0)));
            float streak2 = step(0.7, abs(cos(pos.y * 20.0 + flow2 * 8.0 + t * 4.5)));
            float streak3 = step(0.9, abs(sin((pos.x + pos.y) * 30.0 + flow3 * 12.0 + t * 6.0)));
            
            // Apply sharp streaks
            base_color = mix(base_color, electric_pink, streak1);
            base_color = mix(base_color, bright_orange, streak2);
            base_color = mix(base_color, deep_magenta, streak3);
            
            // Ripple highlights
            float ripple_highlight = abs(sin(ripple1 * 12.0 - t * 4.0)) * exp(-ripple1 * 1.5);
            ripple_highlight += abs(cos(ripple2 * 10.0 - t * 3.5)) * exp(-ripple2 * 1.8);
            base_color += hot_orange * ripple_highlight * 0.4;
            
            // Sharp surface texture detail
            float texture_detail1 = step(0.5, snoise(pos * 40.0 + vec3(t * 2.0, 0.0, 0.0)));
            float texture_detail2 = step(0.6, snoise(pos * 60.0 + vec3(0.0, t * 3.0, 0.0)));
            float texture_detail3 = step(0.7, snoise(pos * 80.0 + vec3(t * 1.5, t * 2.5, 0.0)));
            
            // Apply high frequency texture variations
            base_color = mix(base_color, hot_orange, texture_detail1 * 0.4);
            base_color = mix(base_color, electric_pink, texture_detail2 * 0.3);
            base_color = mix(base_color, bright_orange, texture_detail3 * 0.2);
            
            // Depth and spherical effects
            float radius = length(pos.xy);
            float depth = 1.0 - smoothstep(0.0, 0.8, radius);
            base_color *= (depth * 0.6 + 0.4);
            
            // Ferrofluid shine and reflection
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewDir);
            float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.0);
            
            // Liquid surface reflections
            base_color += fresnel * mix(bright_orange, electric_pink, marble_mask) * 0.5;
            
            // Edge glow for liquid effect
            float edge_glow = pow(1.0 - radius, 4.0);
            base_color += bright_orange * edge_glow * 0.6;
            
            gl_FragColor = vec4(base_color, opacity);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      const orb = new THREE.Mesh(geometry, orbMaterial);
      scene.add(orb);
      
      // Add subtle ambient lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(ambientLight);
      
      // Add directional light for more depth
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
      
      // Animation loop
      const animate = () => {
        animationRef.current = requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        uniforms.time.value = time;
        
        // Gentle rotation for mesmerizing cosmic effect
        orb.rotation.y = time * 0.15;
        orb.rotation.x = Math.sin(time * 0.1) * 0.05;
        
        rendererRef.current.render(sceneRef.current, camera);
      };
      
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
        cursor: 'pointer'
      }}
    />
  );
}