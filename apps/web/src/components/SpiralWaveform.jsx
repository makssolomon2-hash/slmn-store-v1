
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * SpiralWaveform Component
 */
const SpiralWaveform = ({ audioContext }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const pointsCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointsCount * 3);
    const originalPositions = [];

    for (let i = 0; i < pointsCount; i++) {
      const t = i / pointsCount * Math.PI * 20;
      const radius = 0.1 + (i / pointsCount) * 3;
      
      const x = Math.cos(t) * radius;
      const y = (i / pointsCount) * 6 - 3;
      const z = Math.sin(t) * radius;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      originalPositions.push({ x, y, z, radius, t });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({ 
      color: 0x00d9ff, // Cyan
      size: 0.05,
      transparent: true,
      opacity: 0.8
    });
    
    const spiral = new THREE.Points(geometry, material);
    scene.add(spiral);

    camera.position.z = 6;
    camera.position.y = 2;
    camera.lookAt(0, 0, 0);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = Date.now() * 0.002;

      const positionAttribute = geometry.attributes.position;

      for (let i = 0; i < pointsCount; i++) {
        const orig = originalPositions[i];
        
        const wave = Math.sin(orig.t * 2 - time * 5) * 0.2;
        const currentRadius = orig.radius + wave;
        
        positionAttribute.setXYZ(
          i,
          Math.cos(orig.t) * currentRadius,
          orig.y,
          Math.sin(orig.t) * currentRadius
        );
      }
      
      positionAttribute.needsUpdate = true;
      spiral.rotation.y += 0.005;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [audioContext]);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default SpiralWaveform;
