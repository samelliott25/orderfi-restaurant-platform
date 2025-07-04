import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Zap, Activity, Sparkles, Settings } from 'lucide-react';

export default function SimpleVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [complexity, setComplexity] = useState([50]);
  const [animationSpeed, setAnimationSpeed] = useState([1]);
  const [currentVisualization, setCurrentVisualization] = useState('fractal');
  const [stats, setStats] = useState({
    fps: 60,
    objects: 0,
    particles: 0
  });

  // Animation variables
  const [time, setTime] = useState(0);

  // Initialize canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      if (isPlaying) {
        setTime(prevTime => prevTime + 0.01 * animationSpeed[0]);
        
        // Clear canvas
        ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw visualization based on type
        switch (currentVisualization) {
          case 'fractal':
            drawFractal(ctx, canvas);
            break;
          case 'particles':
            drawParticles(ctx, canvas);
            break;
          case 'wave':
            drawWave(ctx, canvas);
            break;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animationSpeed, currentVisualization, complexity, time]);

  // Draw fractal visualization
  const drawFractal = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const count = Math.floor(complexity[0] / 2) + 10;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + time;
      const radius = 50 + Math.sin(time + i * 0.1) * 100;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      const hue = (i / count * 360 + time * 50) % 360;
      ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
      ctx.shadowBlur = 20;
      ctx.shadowColor = ctx.fillStyle;
      
      ctx.beginPath();
      ctx.arc(x, y, 5 + Math.sin(time * 2 + i) * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw connecting lines
      if (i > 0) {
        const prevAngle = ((i - 1) / count) * Math.PI * 2 + time;
        const prevRadius = 50 + Math.sin(time + (i - 1) * 0.1) * 100;
        const prevX = centerX + Math.cos(prevAngle) * prevRadius;
        const prevY = centerY + Math.sin(prevAngle) * prevRadius;
        
        ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.3)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
    
    setStats(prev => ({ ...prev, objects: count }));
  };

  // Draw particle system
  const drawParticles = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const particleCount = complexity[0] * 5;
    
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.sin(time + i * 0.1) * 0.5 + 0.5) * canvas.width;
      const y = (Math.cos(time * 0.7 + i * 0.05) * 0.5 + 0.5) * canvas.height;
      const z = Math.sin(time * 0.5 + i * 0.02) * 0.5 + 0.5;
      
      const size = z * 4 + 1;
      const hue = (i / particleCount * 360 + time * 30) % 360;
      const alpha = z * 0.8 + 0.2;
      
      ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
      ctx.shadowBlur = size * 2;
      ctx.shadowColor = ctx.fillStyle;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    setStats(prev => ({ ...prev, particles: particleCount }));
  };

  // Draw wave visualization
  const drawWave = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const resolution = Math.floor(complexity[0] / 2) + 20;
    const amplitude = 100;
    
    for (let layer = 0; layer < 3; layer++) {
      ctx.strokeStyle = `hsla(${180 + layer * 60}, 70%, 60%, ${0.7 - layer * 0.2})`;
      ctx.lineWidth = 3 - layer;
      ctx.shadowBlur = 10;
      ctx.shadowColor = ctx.strokeStyle;
      
      ctx.beginPath();
      
      for (let i = 0; i <= resolution; i++) {
        const x = (i / resolution) * canvas.width;
        const frequency = 0.02 + layer * 0.01;
        const phase = time + layer * Math.PI / 3;
        const y = canvas.height / 2 + 
                  Math.sin(x * frequency + phase) * amplitude * (1 - layer * 0.3) +
                  Math.sin(x * frequency * 2 + phase * 1.5) * amplitude * 0.3;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
    }
    
    setStats(prev => ({ ...prev, objects: 3 }));
  };

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
                <p className="text-purple-200">Interactive Graphics & Procedural Rendering</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-100">
                <Activity className="w-3 h-3 mr-1" />
                {stats.fps} FPS
              </Badge>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-100">
                <Zap className="w-3 h-3 mr-1" />
                {stats.objects || stats.particles} Objects
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
                  <CardTitle className="text-white">Visualization Engine</CardTitle>
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
                      onClick={() => setTime(0)}
                      className="border-purple-500/30 text-purple-200 hover:bg-purple-500/10"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <canvas
                  ref={canvasRef}
                  className="w-full h-[600px] bg-black/10 rounded-lg"
                  style={{ display: 'block' }}
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
                    onClick={() => setCurrentVisualization(type)}
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
                  <span className="text-white">{stats.objects}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">Particles:</span>
                  <span className="text-white">{stats.particles}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">FPS:</span>
                  <span className="text-white">{stats.fps}</span>
                </div>
              </CardContent>
            </Card>

            {/* AI Controls */}
            <Card className="bg-black/20 border-purple-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">AI Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-purple-500/30 text-purple-200 hover:bg-purple-500/10"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Auto-Optimize
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-purple-500/30 text-purple-200 hover:bg-purple-500/10"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Variation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}