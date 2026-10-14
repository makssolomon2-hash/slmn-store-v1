
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/*
======================================================================
  LITE 3D VIEWER PAGE
======================================================================
  LEARNING NOTE: 
  This page demonstrates how to integrate Three.js with React to create
  interactive 3D graphics. We have built 5 different visualizers.
  
  Key Concepts:
  1. Scene: The 3D world where everything lives.
  2. Camera: Our viewport into the 3D world.
  3. Renderer: The engine that draws the scene to the HTML <canvas>.
  4. Geometry & Materials: The shape and appearance of our 3D objects.
  5. Animation Loop: A function that runs every frame (60 times a second)
     to update positions and re-render the scene.
  6. OrbitControls: A helper that lets us drag, pan, and zoom with the mouse.
*/

// ============================================================================
// 1. WAVEFORM VISUALIZATION (CLASSIC)
// ============================================================================
const WaveformVisualizer = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // 1. Basic Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // 2. Add OrbitControls (Mouse Interaction)
    // LEARNING NOTE: This single line gives us drag-to-rotate, scroll-to-zoom, and right-click-to-pan!
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Makes movement smooth

    // 3. Create Geometry (A simple line with many points)
    const pointsCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointsCount * 3); // x, y, z for each point
    
    // Initial flat line
    for (let i = 0; i < pointsCount; i++) {
      positions[i * 3] = (i / pointsCount) * 10 - 5; // X: from -5 to 5
      positions[i * 3 + 1] = 0;                      // Y: 0
      positions[i * 3 + 2] = 0;                      // Z: 0
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Cyan Material
    const material = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2 });
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    // 4. Animation Loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.005;

      // Simulate a moving waveform
      const posAttribute = geometry.attributes.position;
      for (let i = 0; i < pointsCount; i++) {
        const x = posAttribute.getX(i);
        // Math.sin creates a wave. We combine a few to make it look organic!
        const y = Math.sin(x * 2 + time) * 0.5 + Math.sin(x * 5 + time * 1.5) * 0.2;
        posAttribute.setY(i, y);
      }
      posAttribute.needsUpdate = true; // Tell Three.js we changed the data

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 5. Handle Resize
    const resizeObserver = new ResizeObserver(() => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    });
    resizeObserver.observe(mountRef.current);

    // 6. Cleanup
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationId);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-[400px] bg-slate-950 rounded-xl overflow-hidden border border-cyan-900/30" />;
};

// ============================================================================
// 2. SPECTRUM ANALYZER (FREQUENCY BARS)
// ============================================================================
const SpectrumVisualizer = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 3, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Create Bars
    // LEARNING NOTE: We use a Group to hold all the bars together so we can center them easily.
    const group = new THREE.Group();
    const numBars = 32;
    const bars = [];
    const geometry = new THREE.BoxGeometry(0.2, 1, 0.2);
    
    // We use MeshStandardMaterial so it reacts to light
    const material = new THREE.MeshStandardMaterial({ color: 0x00ffff, roughness: 0.2, metalness: 0.8 });

    for (let i = 0; i < numBars; i++) {
      const bar = new THREE.Mesh(geometry, material);
      bar.position.x = (i - numBars / 2) * 0.3; // Spread them out horizontally
      // Move pivot point to the bottom of the box so it scales UP, not from the center
      bar.geometry.translate(0, 0.5, 0); 
      group.add(bar);
      bars.push(bar);
    }
    scene.add(group);

    // Add Lights for the StandardMaterial
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x00ffff, 2, 20);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.002;

      // Simulate FFT (Fast Fourier Transform) frequency data
      bars.forEach((bar, i) => {
        // Create a bouncy effect simulating bass and treble
        const noise = Math.abs(Math.sin(time * 2 + i * 0.2) * Math.cos(time * 1.5 + i * 0.1));
        const height = 0.1 + noise * 4; // Minimum height 0.1, max 4.1
        
        // Smoothly interpolate the scale so it doesn't instantly snap (looks more realistic)
        bar.scale.y += (height - bar.scale.y) * 0.2; 
      });

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
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-[400px] bg-slate-950 rounded-xl overflow-hidden border border-cyan-900/30" />;
};

// ============================================================================
// 3. EQ VISUALIZATION (EQUALIZER BANDS IN AN ARC)
// ============================================================================
const EQVisualizer = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 4, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const group = new THREE.Group();
    const numBands = 24;
    const radius = 4;
    const bands = [];

    // LEARNING NOTE: We arrange these in a semi-circle using Trigonometry (Math.cos and Math.sin)
    for (let i = 0; i < numBands; i++) {
      const geometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
      geometry.translate(0, 0.5, 0); // Pivot at bottom
      
      // Calculate color gradient from Cyan to Blue
      const color = new THREE.Color().setHSL(0.5 + (i / numBands) * 0.15, 1, 0.5);
      const material = new THREE.MeshBasicMaterial({ color, wireframe: true });
      
      const band = new THREE.Mesh(geometry, material);
      
      // Calculate position on an arc
      const angle = (i / (numBands - 1)) * Math.PI - Math.PI / 2; // -90 to +90 degrees
      band.position.x = Math.sin(angle) * radius;
      band.position.z = Math.cos(angle) * radius - radius; // Pull forward so it curves around center
      
      band.lookAt(0, 0, -radius); // Make cylinders point towards center
      
      group.add(band);
      bands.push({ mesh: band, angle: angle });
    }
    scene.add(group);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.003;

      bands.forEach((band, i) => {
        // Simulate EQ band jumping
        const beat = Math.pow(Math.sin(time + band.angle * 2), 4) * 3;
        band.mesh.scale.y += (0.2 + beat - band.mesh.scale.y) * 0.15;
      });

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
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-[400px] bg-slate-950 rounded-xl overflow-hidden border border-cyan-900/30" />;
};

// ============================================================================
// 4. SPECTROGRAM (FREQUENCY OVER TIME)
// ============================================================================
const SpectrogramVisualizer = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // LEARNING NOTE: A Spectrogram is a history of frequencies. 
    // We use a Plane Geometry, and every frame we push the vertices backwards 
    // to create a "waterfall" or scrolling effect.
    const width = 32;  // Number of frequency bands
    const depth = 32;  // History length (time)
    const geometry = new THREE.PlaneGeometry(10, 10, width, depth);
    geometry.rotateX(-Math.PI / 2); // Lay it flat

    // Create vertex colors for the heatmap effect
    const colors = new Float32Array((width + 1) * (depth + 1) * 3);
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.MeshBasicMaterial({ 
      vertexColors: true, 
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.005;

      const positions = geometry.attributes.position.array;
      const colorAttr = geometry.attributes.color.array;
      const rowLength = width + 1;

      // 1. Shift all rows backwards by 1 (copying the row in front of it)
      for (let z = depth; z > 0; z--) {
        for (let x = 0; x <= width; x++) {
          const currentIdx = (z * rowLength + x) * 3;
          const prevIdx = ((z - 1) * rowLength + x) * 3;
          
          positions[currentIdx + 1] = positions[prevIdx + 1]; // Copy Y (height)
          
          // Copy Colors
          colorAttr[currentIdx] = colorAttr[prevIdx];
          colorAttr[currentIdx + 1] = colorAttr[prevIdx + 1];
          colorAttr[currentIdx + 2] = colorAttr[prevIdx + 2];
        }
      }

      // 2. Generate new data for the front row (z = 0)
      for (let x = 0; x <= width; x++) {
        const idx = x * 3;
        // Simulate frequency peaks
        const signal = Math.pow(Math.sin(x * 0.5 + time) * Math.cos(x * 0.2 - time), 2);
        const height = signal * 2;
        
        positions[idx + 1] = height; // Set new height
        
        // Heatmap color: Low = Blue/Cyan, High = White
        const color = new THREE.Color();
        color.setHSL(0.5 - (height * 0.1), 1, 0.5 + (height * 0.2));
        
        colorAttr[idx] = color.r;
        colorAttr[idx + 1] = color.g;
        colorAttr[idx + 2] = color.b;
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;

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
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-[400px] bg-slate-950 rounded-xl overflow-hidden border border-cyan-900/30" />;
};

// ============================================================================
// 5. PARTICLE BURST (INTERACTIVE PARTICLES)
// ============================================================================
const ParticleBurstVisualizer = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    // Add additive blending for a glowing effect
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // LEARNING NOTE: A Particle System is much more efficient than creating 1000 separate Mesh objects.
    // We use ONE geometry and ONE material, and just pass an array of positions.
    const particleCount = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = []; // Custom array to store how fast each particle moves

    for (let i = 0; i < particleCount; i++) {
      // Start all particles near the center
      positions[i * 3] = (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      // Assign a random outward velocity direction
      const vx = (Math.random() - 0.5) * 0.05;
      const vy = (Math.random() - 0.5) * 0.05;
      const vz = (Math.random() - 0.5) * 0.05;
      velocities.push({ vx, vy, vz });
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({ 
      color: 0x00ffff, 
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.005;

      // Simulate a rhythmic "Beat" (spike in energy)
      const beatIntensity = Math.pow(Math.abs(Math.sin(time)), 8) * 3;
      
      const posAttr = geometry.attributes.position;
      
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        let x = posAttr.array[idx];
        let y = posAttr.array[idx + 1];
        let z = posAttr.array[idx + 2];

        // Move particles outward based on their velocity + current beat intensity
        x += velocities[i].vx * (1 + beatIntensity);
        y += velocities[i].vy * (1 + beatIntensity);
        z += velocities[i].vz * (1 + beatIntensity);

        // If a particle flies too far away, reset it back to the center
        const distance = Math.sqrt(x*x + y*y + z*z);
        if (distance > 5) {
          x = (Math.random() - 0.5) * 0.1;
          y = (Math.random() - 0.5) * 0.1;
          z = (Math.random() - 0.5) * 0.1;
        }

        posAttr.array[idx] = x;
        posAttr.array[idx + 1] = y;
        posAttr.array[idx + 2] = z;
      }
      
      posAttr.needsUpdate = true;
      
      // Slowly rotate the entire particle system
      particles.rotation.y += 0.002;
      particles.rotation.x += 0.001;

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
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-[400px] bg-slate-950 rounded-xl overflow-hidden border border-cyan-900/30" />;
};


// ============================================================================
// MAIN PAGE LAYOUT COMPONENT
// ============================================================================
const Lite3DViewerPage = () => {
  return (
    <div className="bg-slate-900 min-h-screen text-slate-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Introduction */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Interactive <span className="text-cyan-400">3D Audio Visualizers</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Welcome to the 3D showcase! Here we use <strong className="text-slate-200">Three.js</strong> to render stunning, audio-reactive graphics. 
            Try interacting with the models below: <strong className="text-cyan-400">Left-click to rotate</strong>, <strong className="text-cyan-400">Scroll to zoom</strong>, and <strong className="text-cyan-400">Right-click to pan</strong>.
          </p>
        </div>

        {/* Visualizer Stack */}
        <div className="space-y-24">
          
          {/* Section 1 */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <WaveformVisualizer />
            </div>
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-3xl font-bold text-white">1. Classic Waveform</h2>
              <p className="text-slate-400 leading-relaxed">
                This classic visualization draws a continuous line across a 3D plane. The Y-axis (height) of each point on the line is modified every frame to simulate an audio wave, creating an organic, rippling ribbon effect.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 space-y-4 order-2 lg:order-1">
              <h2 className="text-3xl font-bold text-white">2. Spectrum Analyzer</h2>
              <p className="text-slate-400 leading-relaxed">
                Here, individual 3D boxes represent different frequency bands (bass, mids, treble). By scaling the boxes on the Y-axis based on simulated FFT (Fast Fourier Transform) data, we create bouncing bars that react to the rhythm.
              </p>
            </div>
            <div className="lg:col-span-8 order-1 lg:order-2">
              <SpectrumVisualizer />
            </div>
          </section>

          {/* Section 3 */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <EQVisualizer />
            </div>
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-3xl font-bold text-white">3. EQ Bands</h2>
              <p className="text-slate-400 leading-relaxed">
                Taking the spectrum analyzer a step further, we arrange the bands in a semi-circle using Trigonometry. This layout provides a unique, immersive perspective, and we apply a color gradient across the bands to make the visual pop.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 space-y-4 order-2 lg:order-1">
              <h2 className="text-3xl font-bold text-white">4. 3D Spectrogram</h2>
              <p className="text-slate-400 leading-relaxed">
                A spectrogram visualizes frequency data <em>over time</em>. We create a 3D surface (PlaneGeometry) and continuously shift the vertex heights and colors backward every frame. This creates a mesmerizing "waterfall" history of the audio.
              </p>
            </div>
            <div className="lg:col-span-8 order-1 lg:order-2">
              <SpectrogramVisualizer />
            </div>
          </section>

          {/* Section 5 */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <ParticleBurstVisualizer />
            </div>
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-3xl font-bold text-white">5. Particle Burst</h2>
              <p className="text-slate-400 leading-relaxed">
                Instead of solid shapes, this visualizer controls 1,500 individual glowing particles. We track the position and velocity of each particle, and apply a multiplier simulating "beats" to make them burst outward dramatically.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Lite3DViewerPage;
