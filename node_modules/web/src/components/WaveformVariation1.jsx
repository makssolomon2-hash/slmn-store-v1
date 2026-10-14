
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * WaveformVariation1 Component
 * Neutral colors and cyan accents.
 */
const WaveformVariation1 = ({ audioContext }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    const particleCount = 400;
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x888888, // Gray base
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });

    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      
      const t = i * 0.1;
      const radius = 2 + Math.sin(t * 0.5) * 0.5;
      
      mesh.position.x = Math.cos(t) * radius;
      mesh.position.y = (i - particleCount / 2) * 0.02;
      mesh.position.z = Math.sin(t) * radius;
      
      mesh.userData.originalPosition = mesh.position.clone();
      mesh.userData.phase = i * 0.1;
      
      if (i % 3 === 0) {
        mesh.material = new THREE.MeshBasicMaterial({ color: 0x00d9ff, wireframe: true }); // Cyan accents
      }

      particles.push(mesh);
      group.add(mesh);
    }
    
    scene.add(group);

    camera.position.z = 6;
    camera.position.y = 1;

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

      particles.forEach((mesh) => {
        const orig = mesh.userData.originalPosition;
        const wave = Math.sin(time + mesh.userData.phase) * 0.5;
        
        mesh.position.x = orig.x * (1 + wave * 0.2);
        mesh.position.z = orig.z * (1 + wave * 0.2);
        
        mesh.rotation.x += 0.02;
        mesh.rotation.y += 0.02;
      });
      
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

export default WaveformVariation1;
