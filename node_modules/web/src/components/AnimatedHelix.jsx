
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * AnimatedHelix Component
 * Cyan and neutral grays.
 */
const AnimatedHelix = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;

    const helixGroup = new THREE.Group();
    scene.add(helixGroup);

    const sphereGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const mat1 = new THREE.MeshBasicMaterial({ color: 0x00d9ff }); // Cyan
    const mat2 = new THREE.MeshBasicMaterial({ color: 0x666666 }); // Neutral gray

    const count = 20;
    for (let i = 0; i < count; i++) {
      const y = (i - count / 2) * 0.3;
      const angle = i * 0.5;

      const mesh1 = new THREE.Mesh(sphereGeo, mat1);
      mesh1.position.set(Math.cos(angle) * 1.5, y, Math.sin(angle) * 1.5);
      helixGroup.add(mesh1);

      const mesh2 = new THREE.Mesh(sphereGeo, mat2);
      mesh2.position.set(Math.cos(angle + Math.PI) * 1.5, y, Math.sin(angle + Math.PI) * 1.5);
      helixGroup.add(mesh2);
    }

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      helixGroup.rotation.y += 0.01;
      controls.update();
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
      cancelAnimationFrame(animationId);
      sphereGeo.dispose();
      mat1.dispose();
      mat2.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
};

export default AnimatedHelix;
