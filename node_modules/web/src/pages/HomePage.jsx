
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Download, Shield } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

import ClassicWaveform from '@/components/ClassicWaveform.jsx';
import WaveformVariation1 from '@/components/WaveformVariation1.jsx';
import WaveformVariation2 from '@/components/WaveformVariation2.jsx';
import WaveformVariation3 from '@/components/WaveformVariation3.jsx';
import WaveformVariation4 from '@/components/WaveformVariation4.jsx';
import Visualization3DSelector from '@/components/Visualization3DSelector.jsx';

const HomePage = () => {
  const [selectedModel, setSelectedModel] = useState(() => {
    return localStorage.getItem('selected3DModel') || 'variation3';
  });

  useEffect(() => {
    localStorage.setItem('selected3DModel', selectedModel);
  }, [selectedModel]);

  const render3DModel = () => {
    switch (selectedModel) {
      case 'variation1': return <WaveformVariation1 />;
      case 'variation2': return <WaveformVariation2 />;
      case 'variation3': return <WaveformVariation3 />;
      case 'variation4': return <WaveformVariation4 />;
      case 'classic':
      default: return <ClassicWaveform />;
    }
  };

  const features = [
    {
      icon: Zap,
      title: 'Premium quality',
      description: 'Professional-grade samples and presets crafted by industry experts'
    },
    {
      icon: Download,
      title: 'Instant access',
      description: 'Download your purchases immediately after checkout'
    },
    {
      icon: Shield,
      title: 'Secure payments',
      description: 'Safe and encrypted transactions powered by Stripe'
    }
  ];

  return (
    <>
      <Helmet>
        <title>SLMN Sound - Premium music production tools</title>
        <meta name="description" content="Discover premium EDM sample packs and presets by SLMN Sound." />
      </Helmet>

      <div className="min-h-screen flex flex-col relative bg-transparent transition-colors duration-300">
        
        <div className="fixed inset-0 z-background overflow-hidden">
          <div className="absolute inset-0 blur-background">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedModel}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                {render3DModel()}
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Overlay to ensure text readability in both modes over the 3D canvas */}
          <div className="absolute inset-0 bg-background/70 pointer-events-none transition-colors duration-300"></div>
        </div>

        <Header className="z-interactive" />

        <main className="flex-1 z-content">
          
          {/* --- HERO SECTION --- */}
          <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-interactive">
              
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                
                <div className="text-center lg:text-left lg:w-1/2">
                  <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm">
                    <span className="text-primary text-sm font-bold uppercase tracking-wider">
                      New Sample Packs Available
                    </span>
                  </div>
                  
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight text-balance text-foreground drop-shadow-lg">
                    Elevate your sound with<br />
                    <span className="text-primary drop-shadow-[0_0_15px_hsl(var(--primary)/0.5)]">
                      SLMN Sound tools
                    </span>
                  </h1>
                  
                  <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 font-medium">
                    Professional sample packs, Serum presets, and Phase Plant presets designed to inject pure energy into your productions.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link to="/products">
                      <Button size="lg" className="h-14 px-8 text-base font-bold shadow-[0_0_20px_hsl(var(--primary)/0.4)]">
                        Browse Products
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button size="lg" variant="outline" className="h-14 px-8 text-base font-bold bg-background/40 backdrop-blur-md border-border text-foreground hover:bg-muted">
                        Create Account
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="lg:w-1/2 flex flex-col items-center justify-center w-full">
                  <div className="bg-card/70 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-2xl w-full max-w-md text-center transition-colors duration-300">
                    <h3 className="text-xl font-bold text-foreground mb-6 drop-shadow-md">Customize Atmosphere</h3>
                    <Visualization3DSelector 
                      selectedModel={selectedModel} 
                      onSelect={setSelectedModel} 
                    />
                    <p className="text-sm text-muted-foreground mt-6">
                      Drag anywhere on the background to interact with the visualization.
                    </p>
                  </div>
                </div>
                
              </div>
            </div>
          </section>

          {/* --- FEATURES SECTION --- */}
          <section className="py-24 px-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/90 to-background pointer-events-none transition-colors duration-300"></div>
            
            <div className="max-w-7xl mx-auto relative z-interactive">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance text-foreground drop-shadow-md">
                  Industry-standard Arsenal
                </h2>
                <p className="text-muted-foreground text-lg font-medium">
                  Access top-tier production tools trusted by professional artists at SLMN Sound.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="bg-card/80 backdrop-blur-lg border border-border p-8 rounded-2xl shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 shadow-[0_0_15px_hsl(var(--primary)/0.1)]">
                      <feature.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* --- BOTTOM CALL TO ACTION --- */}
          <section className="py-32 text-center relative bg-background border-t border-border transition-colors duration-300">
            <div className="max-w-3xl mx-auto px-4 relative z-interactive">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance text-foreground">
                Ready to start creating?
              </h2>
              <p className="text-muted-foreground mb-10 text-lg">
                Join thousands of producers pushing the boundaries of electronic music with SLMN Sound.
              </p>
              <Link to="/products">
                <Button size="lg" className="h-14 px-10 text-lg font-bold shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                  Explore the Catalog
                  <Zap className="w-5 h-5 ml-2 fill-current" />
                </Button>
              </Link>
            </div>
          </section>

        </main>

        <Footer className="z-content relative bg-background" />
      </div>
    </>
  );
};

export default HomePage;
