
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * WaveformVariation4 Component
 * Neutral grays and cyan dynamic gradient.
 */
const WaveformVariation4 = ({ audioContext }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    
    const geometry = new THREE.PlaneGeometry(12, 12, 64, 64);
    
    const colors = [];
    const count = geometry.attributes.position.count;
    for (let i = 0; i < count; i++) {
      colors.push(0, 0.8, 1); // Initial cyan
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.MeshBasicMaterial({ 
      vertexColors: true,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    group.add(plane);
    scene.add(group);

    camera.position.z = 6;
    camera.position.y = 4;
    camera.lookAt(0, 0, 0);

    const positionAttribute = geometry.attributes.position;
    const colorAttribute = geometry.attributes.color;
    const originalZ = [];
    for (let i = 0; i < count; i++) {
      originalZ.push(positionAttribute.getZ(i));
    }

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        const deltaMove = {
          x: e.clientX - previousMousePosition.x,
          y: e.clientY - previousMousePosition.y
        };
        targetRotation.x += deltaMove.y * 0.01;
        targetRotation.y += deltaMove.x * 0.01;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = Date.now() * 0.002;

      for (let i = 0; i < count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        
        const wave = Math.sin(x * 1.5 + time) * 0.5 + Math.cos(y * 1.5 + time * 1.2) * 0.5;
        positionAttribute.setZ(i, originalZ[i] + wave);

        const heightNorm = (wave + 1) / 2; 
        // Cyan to white gradient based on wave height
        colorAttribute.setXYZ(i, heightNorm * 0.3, 0.8 + heightNorm * 0.2, 1);
      }
      
      positionAttribute.needsUpdate = true;
      colorAttribute.needsUpdate = true;
      
      group.rotation.x += (targetRotation.x - group.rotation.x) * 0.1;
      group.rotation.y += (targetRotation.y - group.rotation.y) * 0.1;
      
      if (!isDragging) {
        targetRotation.y += 0.002;
      }

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
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [audioContext]);

  return <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
};

export default WaveformVariation4;
