
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ClassicWaveform Component
 */
const ClassicWaveform = ({ audioContext }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(10, 10, 32, 32);
    
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x00d9ff, // Cyan
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    camera.position.z = 5;
    camera.position.y = 2;
    camera.lookAt(0, 0, 0);

    const positionAttribute = geometry.attributes.position;
    const originalZ = [];
    for (let i = 0; i < positionAttribute.count; i++) {
      originalZ.push(positionAttribute.getZ(i));
    }

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        
        const wave1 = Math.sin(x * 2 + time * 3) * 0.5;
        const wave2 = Math.cos(y * 2 + time * 2) * 0.5;
        
        positionAttribute.setZ(i, originalZ[i] + wave1 + wave2);
      }
      
      positionAttribute.needsUpdate = true;
      plane.rotation.z += 0.002;

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

export default ClassicWaveform;
