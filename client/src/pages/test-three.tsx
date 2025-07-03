import { useEffect, useRef } from 'react';

export default function TestThree() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Test Three.js page loading...');
    
    // Check if Three.js is available
    if (typeof window !== 'undefined' && (window as any).THREE) {
      console.log('THREE.js is available:', (window as any).THREE);
      
      const THREE = (window as any).THREE;
      if (!mountRef.current) return;
      
      // Simple test scene
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(200, 200);
      
      mountRef.current.appendChild(renderer.domElement);
      
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      
      camera.position.z = 5;
      
      const animate = () => {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();
    } else {
      console.log('THREE.js is not available');
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Three.js Test</h1>
      <div ref={mountRef} className="border-2 border-gray-300" />
      <p className="mt-4">Check console for Three.js availability</p>
    </div>
  );
}