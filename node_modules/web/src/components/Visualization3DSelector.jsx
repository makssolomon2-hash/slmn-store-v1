
import React from 'react';

/**
 * Visualization3DSelector Component
 * 
 * Compact, neutral-colored selector for 3D visualizations.
 */
const Visualization3DSelector = ({ selectedModel, onSelect }) => {
  const models = [
    { id: 'classic', label: 'Classic Wave' },
    { id: 'variation1', label: 'Spiral Helix' },
    { id: 'variation2', label: 'Geometric EQ' },
    { id: 'variation3', label: 'Particle Burst' },
    { id: 'variation4', label: 'Gradient Mesh' }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
      {models.map((model) => (
        <button
          key={model.id}
          onClick={() => onSelect(model.id)}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
            selectedModel === model.id
              ? 'bg-primary text-primary-foreground shadow-[0_0_10px_hsl(var(--primary)/0.3)] border-transparent'
              : 'bg-card text-muted-foreground border border-border hover:border-primary/50 hover:text-foreground'
          }`}
        >
          {model.label}
        </button>
      ))}
    </div>
  );
};

export default Visualization3DSelector;
