
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * WaveformVariation2 Component
 * Neutral tones and cyan EQ bars.
 */
const WaveformVariation2 = ({ audioContext }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    const numBars = 64;
    const radius = 3;
    const bars = [];

    const geometry = new THREE.BoxGeometry(0.2, 1, 0.2);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x00d9ff, // Cyan
      emissive: 0x002222, // Dark neutral
      roughness: 0.3,
      metalness: 0.6
    });

    for (let i = 0; i < numBars; i++) {
      const bar = new THREE.Mesh(geometry, material);
      const angle = (i / numBars) * Math.PI * 2;
      
      bar.position.x = Math.cos(angle) * radius;
      bar.position.z = Math.sin(angle) * radius;
      
      bar.lookAt(0, 0, 0);
      bar.userData = { angle, index: i };
      
      bars.push(bar);
      group.add(bar);
    }
    
    scene.add(group);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x00d9ff, 2, 20); // Cyan highlight
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    camera.position.z = 8;
    camera.position.y = 3;
    camera.lookAt(0, 0, 0);

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
      const time = Date.now() * 0.005;

      bars.forEach((bar) => {
        const wave1 = Math.sin(bar.userData.angle * 4 + time);
        const wave2 = Math.cos(bar.userData.angle * 8 - time * 1.5);
        const eqValue = Math.abs(wave1 + wave2) * 1.5 + 0.1;
        
        bar.scale.z = eqValue; 
      });
      
      group.rotation.x += (targetRotation.x - group.rotation.x) * 0.1;
      group.rotation.y += (targetRotation.y - group.rotation.y) * 0.1;
      
      if (!isDragging) {
        targetRotation.y -= 0.002;
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

export default WaveformVariation2;
