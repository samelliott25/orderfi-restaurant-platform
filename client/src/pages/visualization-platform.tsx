import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Settings, Zap, Activity, Sparkles } from 'lucide-react';

// Declare THREE as global
declare global {
  interface Window {
    THREE: any;
  }
}

export default function VisualizationPlatform() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);
  const meshesRef = useRef<any[]>([]);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [complexity, setComplexity] = useState([50]);
  const [animationSpeed, setAnimationSpeed] = useState([1]);
  const [currentVisualization, setCurrentVisualization] = useState('fractal');
  const [stats, setStats] = useState({
    fps: 0,
    meshCount: 0,
    vertices: 0
  });

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current || !window.THREE) return;

    const THREE = window.THREE;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create initial visualization
    createFractalVisualization();

    // Handle window resize
    const handleResize = () => {
      if (mountRef.current && cameraRef.current && rendererRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

    // Start animation
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Create fractal visualization
  const createFractalVisualization = () => {
    if (!sceneRef.current) return;

    // Clear existing meshes
    meshesRef.current.forEach(mesh => {
      sceneRef.current?.remove(mesh);
    });
    meshesRef.current = [];

    const meshes: THREE.Mesh[] = [];
    const count = Math.floor(complexity[0] / 10) + 5;

    for (let i = 0; i < count; i++) {
      const geometry = new THREE.OctahedronGeometry(0.5 + Math.random() * 0.5);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(i / count, 1, 0.5),
        transparent: true,
        opacity: 0.8
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      
      sceneRef.current.add(mesh);
      meshes.push(mesh);
    }

    meshesRef.current = meshes;
    updateStats();
  };

  // Create particle system
  const createParticleSystem = () => {
    if (!sceneRef.current) return;

    // Clear existing meshes
    meshesRef.current.forEach(mesh => {
      sceneRef.current?.remove(mesh);
    });
    meshesRef.current = [];

    const particleCount = complexity[0] * 10;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;

      const color = new THREE.Color().setHSL(Math.random(), 1, 0.5);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    const particles = new THREE.Points(geometry, material);
    sceneRef.current.add(particles);
    meshesRef.current = [particles as any];
    updateStats();
  };

  // Create wave visualization
  const createWaveVisualization = () => {
    if (!sceneRef.current) return;

    // Clear existing meshes
    meshesRef.current.forEach(mesh => {
      sceneRef.current?.remove(mesh);
    });
    meshesRef.current = [];

    const size = Math.floor(complexity[0] / 5) + 10;
    const geometry = new THREE.PlaneGeometry(10, 10, size, size);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.7,
      wireframe: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    sceneRef.current.add(mesh);
    meshesRef.current = [mesh];
    updateStats();
  };

  // Animation loop
  const animate = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    if (isPlaying) {
      const time = Date.now() * 0.001 * animationSpeed[0];

      // Animate based on current visualization type
      if (currentVisualization === 'fractal') {
        meshesRef.current.forEach((mesh, index) => {
          mesh.rotation.x += 0.01 * animationSpeed[0];
          mesh.rotation.y += 0.01 * animationSpeed[0];
          mesh.position.y = Math.sin(time + index) * 2;
        });
      } else if (currentVisualization === 'particles') {
        meshesRef.current.forEach((points) => {
          points.rotation.x += 0.005 * animationSpeed[0];
          points.rotation.y += 0.005 * animationSpeed[0];
        });
      } else if (currentVisualization === 'wave') {
        meshesRef.current.forEach((mesh) => {
          const positions = mesh.geometry.attributes.position.array as Float32Array;
          const size = Math.sqrt(positions.length / 3);
          
          for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const z = positions[i + 2];
            positions[i + 1] = Math.sin(time + x * 0.5) * Math.cos(time + z * 0.5) * 2;
          }
          
          mesh.geometry.attributes.position.needsUpdate = true;
        });
      }

      // Camera orbit
      cameraRef.current.position.x = Math.cos(time * 0.1) * 15;
      cameraRef.current.position.z = Math.sin(time * 0.1) * 15;
      cameraRef.current.lookAt(0, 0, 0);
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationRef.current = requestAnimationFrame(animate);
  };

  // Update stats
  const updateStats = () => {
    setStats({
      fps: 60, // Approximate
      meshCount: meshesRef.current.length,
      vertices: meshesRef.current.reduce((total, mesh) => {
        return total + (mesh.geometry.attributes.position?.count || 0);
      }, 0)
    });
  };

  // Handle visualization change
  const handleVisualizationChange = (type: string) => {
    setCurrentVisualization(type);
    switch (type) {
      case 'fractal':
        createFractalVisualization();
        break;
      case 'particles':
        createParticleSystem();
        break;
      case 'wave':
        createWaveVisualization();
        break;
    }
  };

  // Handle complexity change
  useEffect(() => {
    if (currentVisualization === 'fractal') {
      createFractalVisualization();
    } else if (currentVisualization === 'particles') {
      createParticleSystem();
    } else if (currentVisualization === 'wave') {
      createWaveVisualization();
    }
  }, [complexity, currentVisualization]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">AI Visualization Platform</h1>
                <p className="text-purple-200">Interactive 3D Graphics & Procedural Rendering</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-100">
                <Activity className="w-3 h-3 mr-1" />
                {stats.fps} FPS
              </Badge>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-100">
                <Zap className="w-3 h-3 mr-1" />
                {stats.meshCount} Objects
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Visualization */}
          <div className="lg:col-span-3">
            <Card className="bg-black/20 border-purple-500/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">3D Visualization Engine</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isPlaying ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVisualizationChange(currentVisualization)}
                      className="border-purple-500/30 text-purple-200 hover:bg-purple-500/10"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div
                  ref={mountRef}
                  className="w-full h-[600px] bg-black/10 rounded-lg overflow-hidden"
                />
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Visualization Type */}
            <Card className="bg-black/20 border-purple-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Visualization Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['fractal', 'particles', 'wave'].map((type) => (
                  <Button
                    key={type}
                    variant={currentVisualization === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleVisualizationChange(type)}
                    className={`w-full justify-start ${
                      currentVisualization === type
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'border-purple-500/30 text-purple-200 hover:bg-purple-500/10'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Parameters */}
            <Card className="bg-black/20 border-purple-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-purple-200 text-xs mb-2 block">
                    Complexity: {complexity[0]}
                  </label>
                  <Slider
                    value={complexity}
                    onValueChange={setComplexity}
                    min={10}
                    max={100}
                    step={10}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-purple-200 text-xs mb-2 block">
                    Animation Speed: {animationSpeed[0]}x
                  </label>
                  <Slider
                    value={animationSpeed}
                    onValueChange={setAnimationSpeed}
                    min={0.1}
                    max={3}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-black/20 border-purple-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">Objects:</span>
                  <span className="text-white">{stats.meshCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">Vertices:</span>
                  <span className="text-white">{stats.vertices.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">FPS:</span>
                  <span className="text-white">{stats.fps}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}