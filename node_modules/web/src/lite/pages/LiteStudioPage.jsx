
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import LiteHeader from '@/lite/components/LiteHeader.jsx';
import ModelSelector from '@/components/ModelSelector.jsx';
import Model3DViewer from '@/components/Model3DViewer.jsx';
import { STUDIO_MODELS } from '@/pages/StudioPage.jsx';

const LiteStudioPage = () => {
  const [selectedModelId, setSelectedModelId] = useState(STUDIO_MODELS[0].id);
  const selectedModel = STUDIO_MODELS.find(m => m.id === selectedModelId) || STUDIO_MODELS[0];

  return (
    <>
      <Helmet>
        <title>Lite Studio - SLMN Lite</title>
      </Helmet>

      {/* h-[100dvh] forces the page to take exactly viewport height */}
      <div className="h-[100dvh] flex flex-col bg-background text-foreground transition-colors duration-300 overflow-hidden">
        <LiteHeader />

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

export default LiteStudioPage;
