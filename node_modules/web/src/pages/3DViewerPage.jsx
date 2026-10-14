
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Activity, Layers, Play, Settings } from 'lucide-react';

/* 3D Model Renderers */
const createWaveform = (scene, renderer, camera) => {
  const pointsCount = 300;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(pointsCount * 3);
  
  for (let i = 0; i < pointsCount; i++) {
    positions[i * 3] = (i / pointsCount) * 10 - 5;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = 0;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2, transparent: true, opacity: 0.9 });
  const line = new THREE.Line(geometry, material);
  scene.add(line);

  return {
    animate: (time) => {
      const posAttribute = geometry.attributes.position;
      for (let i = 0; i < pointsCount; i++) {
        const x = posAttribute.getX(i);
        const y = Math.sin(x * 2 + time * 2) * 0.8 + Math.sin(x * 5 + time * 3) * 0.3;
        posAttribute.setY(i, y);
      }
      posAttribute.needsUpdate = true;
    },
    cleanup: () => {
      geometry.dispose();
      material.dispose();
      scene.remove(line);
    }
  };
};

const createSpectrum = (scene) => {
  const group = new THREE.Group();
  const numBars = 48;
  const bars = [];
  const geometry = new THREE.BoxGeometry(0.15, 1, 0.15);
  geometry.translate(0, 0.5, 0); 
  const material = new THREE.MeshStandardMaterial({ color: 0x00ffff, roughness: 0.1, metalness: 0.8 });

  for (let i = 0; i < numBars; i++) {
    const bar = new THREE.Mesh(geometry, material);
    bar.position.x = (i - numBars / 2) * 0.2;
    group.add(bar);
    bars.push(bar);
  }
  scene.add(group);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  const pointLight = new THREE.PointLight(0x00ffff, 2, 20);
  pointLight.position.set(0, 5, 5);
  scene.add(ambientLight);
  scene.add(pointLight);

  return {
    animate: (time) => {
      bars.forEach((bar, i) => {
        const noise = Math.abs(Math.sin(time * 3 + i * 0.1) * Math.cos(time * 2 + i * 0.05));
        const height = 0.1 + noise * 5;
        bar.scale.y += (height - bar.scale.y) * 0.2;
      });
    },
    cleanup: () => {
      geometry.dispose();
      material.dispose();
      scene.remove(group);
      scene.remove(ambientLight);
      scene.remove(pointLight);
    }
  };
};

const createEQ = (scene) => {
  const group = new THREE.Group();
  const numBands = 32;
  const radius = 5;
  const bands = [];

  for (let i = 0; i < numBands; i++) {
    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
    geometry.translate(0, 0.5, 0);
    const color = new THREE.Color().setHSL(0.5 + (i / numBands) * 0.15, 1, 0.5);
    const material = new THREE.MeshBasicMaterial({ color, wireframe: true });
    
    const band = new THREE.Mesh(geometry, material);
    const angle = (i / (numBands - 1)) * Math.PI - Math.PI / 2;
    band.position.x = Math.sin(angle) * radius;
    band.position.z = Math.cos(angle) * radius - radius;
    band.lookAt(0, 0, -radius);
    
    group.add(band);
    bands.push({ mesh: band, angle });
  }
  scene.add(group);

  return {
    animate: (time) => {
      bands.forEach((band) => {
        const beat = Math.pow(Math.sin(time * 2 + band.angle * 3), 4) * 4;
        band.mesh.scale.y += (0.2 + beat - band.mesh.scale.y) * 0.15;
      });
    },
    cleanup: () => {
      bands.forEach(b => { b.mesh.geometry.dispose(); b.mesh.material.dispose(); });
      scene.remove(group);
    }
  };
};

const createSpectrogram = (scene) => {
  const width = 48;
  const depth = 48;
  const geometry = new THREE.PlaneGeometry(12, 12, width, depth);
  geometry.rotateX(-Math.PI / 2);

  const colors = new Float32Array((width + 1) * (depth + 1) * 3);
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.MeshBasicMaterial({ 
    vertexColors: true, 
    wireframe: true,
    transparent: true,
    opacity: 0.8
  });
  
  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  return {
    animate: (time) => {
      const positions = geometry.attributes.position.array;
      const colorAttr = geometry.attributes.color.array;
      const rowLength = width + 1;

      for (let z = depth; z > 0; z--) {
        for (let x = 0; x <= width; x++) {
          const currentIdx = (z * rowLength + x) * 3;
          const prevIdx = ((z - 1) * rowLength + x) * 3;
          positions[currentIdx + 1] = positions[prevIdx + 1];
          colorAttr[currentIdx] = colorAttr[prevIdx];
          colorAttr[currentIdx + 1] = colorAttr[prevIdx + 1];
          colorAttr[currentIdx + 2] = colorAttr[prevIdx + 2];
        }
      }

      for (let x = 0; x <= width; x++) {
        const idx = x * 3;
        const signal = Math.pow(Math.sin(x * 0.3 + time * 3) * Math.cos(x * 0.15 - time * 2), 2);
        const height = signal * 3;
        
        positions[idx + 1] = height;
        const color = new THREE.Color();
        color.setHSL(0.5 - (height * 0.05), 1, 0.5 + (height * 0.1));
        
        colorAttr[idx] = color.r;
        colorAttr[idx + 1] = color.g;
        colorAttr[idx + 2] = color.b;
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
    },
    cleanup: () => {
      geometry.dispose();
      material.dispose();
      scene.remove(plane);
    }
  };
};

const createParticleBurst = (scene) => {
  const particleCount = 2000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 0.5;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

    velocities.push({
      vx: (Math.random() - 0.5) * 0.06,
      vy: (Math.random() - 0.5) * 0.06,
      vz: (Math.random() - 0.5) * 0.06
    });
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({ 
    color: 0x00ffff, 
    size: 0.06,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  return {
    animate: (time) => {
      const beatIntensity = Math.pow(Math.abs(Math.sin(time * 2)), 8) * 4;
      const posAttr = geometry.attributes.position;
      
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        let x = posAttr.array[idx];
        let y = posAttr.array[idx + 1];
        let z = posAttr.array[idx + 2];

        x += velocities[i].vx * (1 + beatIntensity);
        y += velocities[i].vy * (1 + beatIntensity);
        z += velocities[i].vz * (1 + beatIntensity);

        const distance = Math.sqrt(x*x + y*y + z*z);
        if (distance > 6) {
          x = (Math.random() - 0.5) * 0.2;
          y = (Math.random() - 0.5) * 0.2;
          z = (Math.random() - 0.5) * 0.2;
        }

        posAttr.array[idx] = x;
        posAttr.array[idx + 1] = y;
        posAttr.array[idx + 2] = z;
      }
      
      posAttr.needsUpdate = true;
      particles.rotation.y += 0.003;
      particles.rotation.x += 0.001;
    },
    cleanup: () => {
      geometry.dispose();
      material.dispose();
      scene.remove(particles);
    }
  };
};

const models = [
  { id: 'waveform', name: 'Waveform Visualization', creator: createWaveform, desc: 'Classic real-time continuous waveform manipulation.' },
  { id: 'spectrum', name: 'Spectrum Analyzer', creator: createSpectrum, desc: '3D frequency band analysis using scale transformations.' },
  { id: 'eq', name: 'Equalizer Arc', creator: createEQ, desc: 'Curved trigonometric arrangement of interactive EQ bands.' },
  { id: 'spectrogram', name: 'Spectrogram Heatmap', creator: createSpectrogram, desc: 'Time-frequency visualization over an animated 3D surface plane.' },
  { id: 'particles', name: 'Particle Burst', creator: createParticleBurst, desc: 'Volumetric particle system driven by velocity and beat intensity.' }
];

const Viewer3DPage = () => {
  const mountRef = useRef(null);
  const [activeModel, setActiveModel] = useState(models[0].id);
  const [stats, setStats] = useState({ fps: 60, vertices: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    // Setup Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Load active model
    const currentModelData = models.find(m => m.id === activeModel);
    const instance = currentModelData.creator(scene, renderer, camera);

    // Update stats based on model
    const totalVertices = scene.children.reduce((acc, child) => {
      if (child.geometry && child.geometry.attributes.position) {
        return acc + child.geometry.attributes.position.count;
      }
      if (child.children) {
        return acc + child.children.length * 24; // Approximation for grouped boxes
      }
      return acc;
    }, 0);
    setStats({ fps: 60, vertices: totalVertices });

    // Animation Loop
    let animationId;
    let lastTime = performance.now();
    let frames = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const now = performance.now();
      frames++;

      if (now >= lastTime + 1000) {
        setStats(s => ({ ...s, fps: Math.round((frames * 1000) / (now - lastTime)) }));
        frames = 0;
        lastTime = now;
      }

      const time = Date.now() * 0.001;
      instance.animate(time);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const resizeObserver = new ResizeObserver(() => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    });
    resizeObserver.observe(mountRef.current);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationId);
      instance.cleanup();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeModel]);

  const activeModelData = models.find(m => m.id === activeModel);

  return (
    <>
      <Helmet>
        <title>3D Visualizer Studio - SLMN Sound</title>
        <meta name="description" content="Experience professional interactive 3D audio visualizations." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <Header />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-balance">
              Visualizer Studio
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Immerse yourself in real-time audio-reactive 3D graphics powered by WebGL.
              Select a model below and interact using your mouse.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
            {/* Left Panel: Controls */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center">
                  <Layers className="w-4 h-4 mr-2" /> Select Engine
                </h3>
                <div className="space-y-2">
                  {models.map(model => (
                    <button
                      key={model.id}
                      onClick={() => setActiveModel(model.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${
                        activeModel === model.id
                          ? 'bg-primary text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.3)]'
                          : 'bg-background hover:bg-muted text-foreground border border-border'
                      }`}
                    >
                      {model.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center">
                  <Activity className="w-4 h-4 mr-2" /> Performance
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Target FPS</span>
                    <span className="font-mono font-bold text-primary">{stats.fps}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Vertices</span>
                    <span className="font-mono font-bold text-foreground">{stats.vertices.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Engine</span>
                    <span className="font-mono text-xs text-foreground bg-muted px-2 py-1 rounded">Three.js</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Canvas */}
            <div className="lg:col-span-3 flex flex-col">
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl flex-1 min-h-[500px] flex flex-col relative group">
                
                {/* Overlay UI */}
                <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur border border-border/50 rounded-lg p-3 max-w-sm">
                  <h2 className="font-bold text-lg mb-1">{activeModelData.name}</h2>
                  <p className="text-xs text-muted-foreground">{activeModelData.desc}</p>
                </div>
                
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <div className="bg-background/80 backdrop-blur border border-border/50 rounded-full px-3 py-1.5 flex items-center text-xs font-medium text-muted-foreground">
                    <Play className="w-3 h-3 mr-1.5" /> Auto-playing
                  </div>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-background/80 backdrop-blur border-border/50">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>

                <div className="absolute bottom-4 right-4 z-10 bg-background/80 backdrop-blur border border-border/50 rounded-lg px-3 py-2 text-xs text-muted-foreground">
                  Left Click: <strong>Rotate</strong> &bull; Scroll: <strong>Zoom</strong> &bull; Right Click: <strong>Pan</strong>
                </div>

                {/* Canvas Container */}
                <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing bg-slate-950" />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Viewer3DPage;
