
import React from 'react';
import { ChevronRight, Box, Activity, Sparkles, Layers } from 'lucide-react';

const categoryIcons = {
  'Complex': Sparkles,
  'Basic': Box,
  'Audio': Activity,
  'Variations': Layers,
  'Geometry': Box
};

const ModelSelector = ({ models, selectedModelId, onSelect }) => {
  // Group models by category
  const categories = models.reduce((acc, model) => {
    if (!acc[model.category]) acc[model.category] = [];
    acc[model.category].push(model);
    return acc;
  }, {});

  return (
    <aside className="w-full md:w-72 lg:w-80 bg-card border-r border-border flex flex-col h-64 md:h-full shrink-0 z-20 transition-colors duration-300">
      <div className="p-5 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-lg font-bold tracking-tight text-foreground">3D Models</h2>
        <p className="text-xs text-muted-foreground mt-1">Select a visualization</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
        {Object.entries(categories).map(([category, categoryModels]) => {
          const CategoryIcon = categoryIcons[category] || Box;
          
          return (
            <div key={category} className="space-y-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 flex items-center gap-2">
                <CategoryIcon className="w-3.5 h-3.5" />
                {category}
              </h3>
              <div className="space-y-1">
                {categoryModels.map((model) => {
                  const isActive = selectedModelId === model.id;
                  return (
                    <button
                      key={model.id}
                      onClick={() => onSelect(model.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                        isActive 
                          ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_hsl(var(--primary)/0.1)]' 
                          : 'text-foreground hover:bg-muted hover:text-primary border border-transparent'
                      }`}
                    >
                      <span className="truncate">{model.name}</span>
                      <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                        isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default ModelSelector;
