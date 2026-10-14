
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import ModelSelector from '@/components/ModelSelector.jsx';
import Model3DViewer from '@/components/Model3DViewer.jsx';

// Import all 3D Models
import ParticleSystem from '@/components/ParticleSystem.jsx';
import RotatingCube from '@/components/RotatingCube.jsx';
import SpinningTorus from '@/components/SpinningTorus.jsx';
import AnimatedHelix from '@/components/AnimatedHelix.jsx';
import ModelViewer from '@/components/ModelViewer.jsx';
import ClassicWaveform from '@/components/ClassicWaveform.jsx';
import CubeWaveform from '@/components/CubeWaveform.jsx';
import SphereWaveform from '@/components/SphereWaveform.jsx';
import SpiralWaveform from '@/components/SpiralWaveform.jsx';
import WaveformVariation1 from '@/components/WaveformVariation1.jsx';
import WaveformVariation2 from '@/components/WaveformVariation2.jsx';
import WaveformVariation3 from '@/components/WaveformVariation3.jsx';
import WaveformVariation4 from '@/components/WaveformVariation4.jsx';

export const STUDIO_MODELS = [
  // Complex / Particle
  { id: 'particle', name: 'Particle System', category: 'Complex', component: ParticleSystem },
  { id: 'helix', name: 'Animated Helix', category: 'Complex', component: AnimatedHelix },
  
  // Basic Geometry
  { id: 'cube', name: 'Rotating Cube', category: 'Basic', component: RotatingCube },
  { id: 'torus', name: 'Spinning Torus', category: 'Basic', component: SpinningTorus },
  
  // Audio / Waveforms
  { id: 'classic', name: 'Classic Waveform', category: 'Audio', component: ClassicWaveform },
  { id: 'cube-wave', name: 'Cube Waveform', category: 'Audio', component: CubeWaveform },
  { id: 'sphere-wave', name: 'Sphere Waveform', category: 'Audio', component: SphereWaveform },
  { id: 'spiral-wave', name: 'Spiral Waveform', category: 'Audio', component: SpiralWaveform },
  
  // Variations
  { id: 'var1', name: 'Spiral Helix', category: 'Variations', component: WaveformVariation1 },
  { id: 'var2', name: 'Geometric EQ', category: 'Variations', component: WaveformVariation2 },
  { id: 'var3', name: 'Particle Burst', category: 'Variations', component: WaveformVariation3 },
  { id: 'var4', name: 'Gradient Mesh', category: 'Variations', component: WaveformVariation4 },
  
  // ModelViewer Geometries
  { id: 'mv-sphere', name: 'Animated Sphere', category: 'Geometry', component: () => <ModelViewer type="sphere" /> },
  { id: 'mv-icosahedron', name: 'Icosahedron', category: 'Geometry', component: () => <ModelViewer type="icosahedron" /> },
  { id: 'mv-pyramids', name: 'Floating Pyramids', category: 'Geometry', component: () => <ModelViewer type="pyramids" /> },
  { id: 'mv-grid', name: 'Grid Plane', category: 'Geometry', component: () => <ModelViewer type="grid" /> },
  { id: 'mv-rings', name: 'Animated Rings', category: 'Geometry', component: () => <ModelViewer type="rings" /> },
  { id: 'mv-polyhedron', name: 'Polyhedron', category: 'Geometry', component: () => <ModelViewer type="polyhedron" /> },
  { id: 'mv-cylinder', name: 'Cylinder EQ', category: 'Geometry', component: () => <ModelViewer type="cylinder" /> },
  { id: 'mv-octahedron', name: 'Octahedron', category: 'Geometry', component: () => <ModelViewer type="octahedron" /> },
  { id: 'mv-dodecahedron', name: 'Dodecahedron', category: 'Geometry', component: () => <ModelViewer type="dodecahedron" /> },
  { id: 'mv-knot', name: 'Torus Knot', category: 'Geometry', component: () => <ModelViewer type="knot" /> },
  { id: 'mv-box', name: 'Waveform Lines', category: 'Geometry', component: () => <ModelViewer type="box" /> },
];

const StudioPage = () => {
  const [selectedModelId, setSelectedModelId] = useState(STUDIO_MODELS[0].id);
  const selectedModel = STUDIO_MODELS.find(m => m.id === selectedModelId) || STUDIO_MODELS[0];

  return (
    <>
      <Helmet>
        <title>Web Studio - SLMN Sound</title>
        <meta name="description" content="Explore 20+ interactive 3D models and audio visualizations in our Web Studio." />
      </Helmet>

      {/* h-[100dvh] forces the page to take exactly viewport height */}
      <div className="h-[100dvh] flex flex-col bg-background text-foreground transition-colors duration-300 overflow-hidden">
        <Header />

        {/* min-h-0 prevents flex children from pushing bounds */}
        <main className="flex-1 flex flex-col md:flex-row min-h-0 relative overflow-hidden">
          {/* Left Sidebar: Model Selector */}
          <ModelSelector 
            models={STUDIO_MODELS} 
            selectedModelId={selectedModelId} 
            onSelect={setSelectedModelId} 
          />

          {/* Right Area: 3D Viewer */}
          <Model3DViewer selectedModel={selectedModel} />
        </main>
      </div>
    </>
  );
};

export default StudioPage;
