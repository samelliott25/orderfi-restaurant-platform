import React, { useRef, useEffect, useCallback } from 'react';

interface WebGLOrbProps {
  size: number;
  onClick?: () => void;
  className?: string;
}

const WebGLOrb: React.FC<WebGLOrbProps> = ({ size, onClick, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    varying vec3 v_position;
    
    void main() {
      gl_Position = a_position;
      v_texCoord = a_texCoord;
      v_position = a_position.xyz;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    
    varying vec2 v_texCoord;
    varying vec3 v_position;
    uniform float u_time;
    uniform vec2 u_resolution;
    
    // Simple but effective noise function (from Three.js reference)
    float noise(vec3 p) {
      return fract(sin(dot(p, vec3(12.989, 78.233, 54.53))) * 43758.5453);
    }
    
    void main() {
      vec2 uv = (v_texCoord - 0.5) * 2.0;
      float dist = length(uv);
      
      // Create sphere mask
      if (dist > 1.0) {
        discard;
      }
      
      // Calculate 3D position on sphere
      float z = sqrt(1.0 - dist * dist);
      vec3 spherePos = vec3(uv, z);
      
      // Iridescent glass sphere effect
      float time = u_time * 0.4;
      
      // Create flowing gradients like in the reference images
      vec3 flowPos = spherePos + vec3(time * 0.1, time * 0.15, time * 0.08);
      float flow1 = noise(flowPos * 1.5);
      float flow2 = noise(flowPos * 2.5 + time * 0.2);
      
      // Smooth flowing patterns
      float pattern = (flow1 + flow2 * 0.5) * 0.5;
      pattern = smoothstep(0.2, 0.8, pattern);
      
      // Fresnel for glass-like rim lighting
      float fresnel = pow(1.0 - abs(dot(normalize(spherePos), vec3(0,0,1))), 2.0);
      
      // Iridescent color palette like soap bubbles
      vec3 color1 = vec3(0.8, 0.3, 1.0);    // Purple
      vec3 color2 = vec3(0.2, 0.6, 1.0);    // Blue
      vec3 color3 = vec3(1.0, 0.4, 0.8);    // Pink
      vec3 color4 = vec3(1.0, 0.6, 0.2);    // Orange
      
      // Create rainbow-like color transitions
      float colorPhase = (spherePos.x + spherePos.y + pattern + time * 0.3) * 2.0;
      vec3 baseColor;
      
      if (colorPhase < 1.0) {
        baseColor = mix(color1, color2, colorPhase);
      } else if (colorPhase < 2.0) {
        baseColor = mix(color2, color3, colorPhase - 1.0);
      } else if (colorPhase < 3.0) {
        baseColor = mix(color3, color4, colorPhase - 2.0);
      } else {
        baseColor = mix(color4, color1, colorPhase - 3.0);
      }
      
      // Add depth and volume
      float depth = z * 0.7 + 0.3;
      vec3 volumeColor = baseColor * depth;
      
      // Strong rim lighting for glass effect
      vec3 rimColor = vec3(1.0, 0.9, 0.8);
      
      // Combine volume and rim lighting
      vec3 finalColor = volumeColor + fresnel * rimColor * 1.2;
      
      // Add subtle shimmer
      float shimmer = sin(time * 3.0 + spherePos.x * 10.0) * 0.05 + 0.95;
      finalColor *= shimmer;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  const createShader = useCallback((gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }, []);

  const createProgram = useCallback((gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null => {
    const program = gl.createProgram();
    if (!program) return null;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    
    return program;
  }, []);

  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    glRef.current = gl;

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    programRef.current = program;

    // Set up geometry (full screen quad)
    const positions = [
      -1, -1,  0, 0,
       1, -1,  1, 0,
      -1,  1,  0, 1,
       1,  1,  1, 1,
    ];

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Set up attributes
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const texCoordAttributeLocation = gl.getAttribLocation(program, 'a_texCoord');

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 16, 0);

    gl.enableVertexAttribArray(texCoordAttributeLocation);
    gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 16, 8);

    // Set up uniforms
    gl.useProgram(program);
    const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');

    // Set resolution
    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

    // Animation loop
    const animate = () => {
      const currentTime = (Date.now() - startTimeRef.current) / 1000;
      
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.uniform1f(timeUniformLocation, currentTime);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  }, [createShader, createProgram]);

  useEffect(() => {
    initWebGL();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initWebGL]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={`cursor-pointer ${className}`}
      onClick={onClick}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        filter: 'drop-shadow(0 0 20px rgba(255, 100, 0, 0.5))',
      }}
    />
  );
};

export default WebGLOrb;