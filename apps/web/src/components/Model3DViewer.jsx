
import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

const Model3DViewer = ({ selectedModel }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset error state when model changes
    setHasError(false);
    if (selectedModel) {
      console.log(`[3D Viewer] Initializing model: ${selectedModel.name} (${selectedModel.id})`);
    }
  }, [selectedModel]);

  if (!selectedModel) {
    return (
      <section className="flex-1 flex items-center justify-center bg-black w-full h-full min-h-[300px]">
        <p className="text-muted-foreground">No model selected</p>
      </section>
    );
  }
  
  const ActiveComponent = selectedModel.component;

  return (
    <section className="flex-1 relative bg-black overflow-hidden flex flex-col w-full h-full min-h-0">
      {/* Top Left Overlay UI */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="bg-background/60 backdrop-blur-md border border-border/50 rounded-xl p-4 shadow-lg transition-all duration-300">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(var(--primary))]"></span>
            {selectedModel.name}
          </h2>
          <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-semibold uppercase tracking-wider">
              {selectedModel.category}
            </span>
            Interactive WebGL
          </p>
        </div>
      </div>

      {/* Bottom Right Overlay UI */}
      <div className="absolute bottom-6 right-6 z-10 pointer-events-none hidden sm:block">
        <div className="bg-background/60 backdrop-blur-md border border-border/50 rounded-lg px-4 py-2 text-xs font-bold text-muted-foreground tracking-wider uppercase shadow-lg">
          Drag to rotate • Scroll to zoom
        </div>
      </div>

      {/* The 3D Canvas Container - Using absolute inset-0 to guarantee dimensions for Three.js */}
      <div className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing">
        {hasError ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-destructive bg-black/90">
            <AlertCircle className="w-12 h-12 mb-4 opacity-80" />
            <p className="font-medium">Failed to load 3D model.</p>
            <button 
              onClick={() => setHasError(false)}
              className="mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/80 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          // Using key={selectedModel.id} forces a complete unmount/remount of the component,
          // ensuring Three.js contexts are properly destroyed and recreated without memory leaks.
          <ActiveComponent key={selectedModel.id} />
        )}
      </div>
    </section>
  );
};

export default Model3DViewer;
