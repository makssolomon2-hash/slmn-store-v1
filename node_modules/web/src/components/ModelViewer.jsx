
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * ModelViewer Component
 * Neutral colors and cyan lines.
 */
const ModelViewer = ({ type }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    let mesh;
    let geometry;
    let material = new THREE.MeshStandardMaterial({ 
      color: 0x00d9ff, // Cyan
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });

    switch (type) {
      case 'sphere':
        geometry = new THREE.SphereGeometry(1.5, 32, 32);
        break;
      case 'icosahedron':
        geometry = new THREE.IcosahedronGeometry(1.5, 0);
        material.wireframe = false;
        material.flatShading = true;
        material.color.setHex(0xaaaaaa); // Neutral gray
        break;
      case 'pyramids':
        geometry = new THREE.TetrahedronGeometry(1.5, 0);
        break;
      case 'grid':
        geometry = new THREE.PlaneGeometry(4, 4, 10, 10);
        material.wireframe = true;
        material.color.setHex(0x666666); // Dark gray grid
        break;
      case 'rings':
        geometry = new THREE.TorusGeometry(1.5, 0.05, 16, 100);
        break;
      case 'polyhedron':
        const verticesOfCube = [
            -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
            -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
        ];
        const indicesOfFaces = [
            2,1,0,    0,3,2,
            0,4,7,    7,3,0,
            0,1,5,    5,4,0,
            1,2,6,    6,5,1,
            2,3,7,    7,6,2,
            4,5,6,    6,7,4
        ];
        geometry = new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, 1.5, 2);
        material.color.setHex(0x888888);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
        break;
      case 'octahedron':
        geometry = new THREE.OctahedronGeometry(1.5, 0);
        break;
      case 'dodecahedron':
        geometry = new THREE.DodecahedronGeometry(1.5, 0);
        material.color.setHex(0xaaaaaa);
        break;
      case 'knot':
        geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
        material.wireframe = false;
        break;
      default:
        geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    }

    mesh = new THREE.Mesh(geometry, material);
    
    if (type === 'grid') {
      mesh.rotation.x = -Math.PI / 2;
    }
    
    scene.add(mesh);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      if (type !== 'grid') {
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.01;
      } else {
        mesh.rotation.z += 0.005;
      }

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
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [type]);

  return <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
};

export default ModelViewer;
