
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const ThreeDVisualization = () => {
  const mountRef = useRef(null);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      if (!canvas.getContext('webgl') && !canvas.getContext('experimental-webgl')) {
        setWebGLSupported(false);
        return;
      }
    } catch (e) {
      setWebGLSupported(false);
      return;
    }

    if (!mountRef.current) return;

    let width = mountRef.current.clientWidth;
    let height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize performance
    mountRef.current.appendChild(renderer.domElement);

    // Create complex shape - Icosahedron
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00d9ff,
      emissive: 0x004455,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });
    
    // Inner solid shape for depth
    const innerGeometry = new THREE.IcosahedronGeometry(1.5, 0);
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0x001122,
      roughness: 0.2,
      metalness: 0.8
    });

    const mesh = new THREE.Mesh(geometry, material);
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    
    const group = new THREE.Group();
    group.add(mesh);
    group.add(innerMesh);
    scene.add(group);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00d9ff, 1.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const accentLight = new THREE.DirectionalLight(0xffffff, 0.5);
    accentLight.position.set(-5, -5, -5);
    scene.add(accentLight);

    // Interaction variables
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0 };

    // Event Handlers
    const handleDown = (x, y) => {
      isDragging = true;
      previousMousePosition = { x, y };
    };

    const handleMove = (x, y) => {
      if (isDragging) {
        const deltaMove = {
          x: x - previousMousePosition.x,
          y: y - previousMousePosition.y
        };
        targetRotation.x += deltaMove.y * 0.01;
        targetRotation.y += deltaMove.x * 0.01;
        previousMousePosition = { x, y };
      }
    };

    const handleUp = () => {
      isDragging = false;
    };

    // Mouse events
    renderer.domElement.addEventListener('mousedown', (e) => handleDown(e.clientX, e.clientY));
    renderer.domElement.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', handleUp);

    // Touch events
    renderer.domElement.addEventListener('touchstart', (e) => handleDown(e.touches[0].clientX, e.touches[0].clientY), { passive: false });
    renderer.domElement.addEventListener('touchmove', (e) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    window.addEventListener('touchend', handleUp);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Auto-rotation when not interacting
      if (!isDragging) {
        targetRotation.y += 0.003;
        targetRotation.x += 0.002;
        
        // Inner mesh rotates opposite
        innerMesh.rotation.x -= 0.004;
        innerMesh.rotation.y -= 0.004;
      }
      
      // Smooth interpolation for dragging
      group.rotation.x += (targetRotation.x - group.rotation.x) * 0.1;
      group.rotation.y += (targetRotation.y - group.rotation.y) * 0.1;

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      width = mountRef.current.clientWidth;
      height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
      cancelAnimationFrame(animationFrameId);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      geometry.dispose();
      material.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  if (!webGLSupported) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-card rounded-2xl border border-primary/20 shadow-[0_0_30px_hsl(var(--primary)/0.1)]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-primary font-bold text-xl">3D</span>
          </div>
          <p className="text-muted-foreground text-sm uppercase tracking-widest">Interactive Visualizer</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full min-h-[400px] cursor-grab active:cursor-grabbing touch-none flex items-center justify-center"
      style={{ filter: 'drop-shadow(0 0 30px hsl(var(--primary)/0.3))' }}
    />
  );
};

export default ThreeDVisualization;
