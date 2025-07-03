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
            vec3 p = vPos;
            float t = time * 0.6;
            
            // Marble pattern using layered noise
            vec3 marbleUV = p * 2.0 + vec3(sin(t * 0.5) * 0.2, cos(t * 0.3) * 0.15, 0.0);
            
            // Primary marble veins
            float marble1 = snoise(marbleUV * 3.0 + vec3(t * 0.4, 0.0, 0.0));
            marble1 += snoise(marbleUV * 6.0 + vec3(t * 0.2, 0.0, 0.0)) * 0.5;
            marble1 += snoise(marbleUV * 12.0 + vec3(t * 0.1, 0.0, 0.0)) * 0.25;
            
            // Secondary marble veins for complexity
            float marble2 = snoise(marbleUV * 4.0 + vec3(0.0, t * 0.3, 0.0));
            marble2 += snoise(marbleUV * 8.0 + vec3(0.0, t * 0.15, 0.0)) * 0.5;
            
            // Turbulent marble flows
            vec3 turbulentUV = p + vec3(
              sin(p.y * 5.0 + t * 1.5) * 0.1,
              cos(p.x * 4.0 + t * 1.2) * 0.08,
              sin(length(p.xy) * 3.0 + t) * 0.06
            );
            
            float turbulence = snoise(turbulentUV * 5.0 + vec3(t * 0.8, 0.0, 0.0));
            turbulence += snoise(turbulentUV * 10.0 + vec3(t * 0.4, 0.0, 0.0)) * 0.5;
            
            // Marble color mapping - Orange and Magenta
            vec3 orangeMarble = vec3(1.0, 0.4, 0.1);    // Deep orange
            vec3 lightOrange = vec3(1.0, 0.7, 0.3);     // Light orange
            vec3 magentaMarble = vec3(0.9, 0.2, 0.6);   // Deep magenta
            vec3 lightMagenta = vec3(1.0, 0.5, 0.8);    // Light magenta
            vec3 whiteVeins = vec3(1.0, 0.9, 0.8);      // Creamy white veins
            
            // Create marble pattern
            float marblePattern = (marble1 + marble2) * 0.5;
            marblePattern = smoothstep(-0.5, 0.8, marblePattern);
            
            // Base marble colors
            vec3 baseMarble = mix(orangeMarble, magentaMarble, marblePattern);
            
            // Add lighter veins
            float veinPattern = abs(marble1 * 0.7 + turbulence * 0.3);
            veinPattern = smoothstep(0.6, 0.9, veinPattern);
            baseMarble = mix(baseMarble, mix(lightOrange, lightMagenta, marblePattern), veinPattern * 0.6);
            
            // Add white marble veins
            float whiteVeinPattern = abs(marble2 * 0.8 + turbulence * 0.2);
            whiteVeinPattern = smoothstep(0.7, 0.95, whiteVeinPattern);
            baseMarble = mix(baseMarble, whiteVeins, whiteVeinPattern * 0.4);
            
            // Add depth variation
            float radius = length(p.xy);
            float depth = 1.0 - smoothstep(0.0, 0.8, radius);
            baseMarble *= (depth * 0.4 + 0.6);
            
            // Marble surface lighting
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewDir);
            float fresnel = pow(1.0 - abs(dot(viewDir, normal)), 1.8);
            
            // Marble highlights
            vec3 marbleHighlight = mix(lightOrange, lightMagenta, marblePattern * 0.8) * fresnel * 0.5;
            baseMarble += marbleHighlight;
            
            // Add subtle color variation over time
            float colorShift = sin(t * 1.2) * 0.1 + 0.9;
            baseMarble *= colorShift;
            
            // Marble polish effect
            float polish = pow(fresnel, 3.0);
            baseMarble = mix(baseMarble, whiteVeins, polish * 0.2);
            
            // Final marble composition
            vec3 finalColor = baseMarble;
            
            // Add subtle glow around edges
            float edgeGlow = pow(1.0 - radius, 2.0);
            finalColor += mix(orangeMarble, magentaMarble, 0.5) * edgeGlow * 0.3;
            
            // Enhance saturation and brightness
            finalColor = pow(finalColor, vec3(0.9));
            finalColor *= 1.3;
            
            gl_FragColor = vec4(finalColor, opacity + fresnel * 0.1);
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