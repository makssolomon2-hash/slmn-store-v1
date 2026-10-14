
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * SphereWaveform Component
 */
const SphereWaveform = ({ audioContext }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x888888, // Gray base
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera.position.z = 5;

    const positionAttribute = geometry.attributes.position;
    const originalPositions = [];
    for (let i = 0; i < positionAttribute.count; i++) {
      originalPositions.push(new THREE.Vector3(
        positionAttribute.getX(i),
        positionAttribute.getY(i),
        positionAttribute.getZ(i)
      ));
    }

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = Date.now() * 0.002;

      for (let i = 0; i < positionAttribute.count; i++) {
        const vertex = originalPositions[i];
        
        const pulse = Math.sin(vertex.x * 2 + time) * Math.cos(vertex.y * 2 + time) * 0.3;
        const scalar = 1 + pulse;
        
        positionAttribute.setXYZ(
          i,
          vertex.x * scalar,
          vertex.y * scalar,
          vertex.z * scalar
        );
      }
      
      positionAttribute.needsUpdate = true;
      
      sphere.rotation.x += 0.005;
      sphere.rotation.y += 0.005;

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

export default SphereWaveform;
