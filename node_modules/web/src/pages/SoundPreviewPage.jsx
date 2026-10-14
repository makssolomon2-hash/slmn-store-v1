
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { RefreshCw, Music, Plus } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import AudioPlayerCard from '@/components/AudioPlayerCard.jsx';
import SoundUploadModal from '@/components/SoundUploadModal.jsx';
import { Button } from '@/components/ui/button';

const SoundPreviewPage = () => {
  const [sounds, setSounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch sounds list and update state
  const fetchSounds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Use getList to fetch uploaded sounds from PocketBase
      const records = await pb.collection('sounds').getList(1, 50, {
        sort: '-created',
        $autoCancel: false
      });
      setSounds(records.items);
    } catch (err) {
      console.error('Failed to fetch sounds:', err);
      setError('Failed to load sound library. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSounds();
  }, [fetchSounds]);

  // Handler invoked when SoundUploadModal successfully uploads a file
  const handleUploadSuccess = () => {
    fetchSounds();
  };

  return (
    <>
      <Helmet>
        <title>Sound Library - SLMN Sound</title>
        <meta name="description" content="Preview our premium collection of EDM sounds, loops, and presets." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 py-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center md:text-left"
              >
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-balance" style={{ letterSpacing: '-0.02em' }}>
                  SLMN Sound Library
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Audition our latest premium samples, loops, and one-shots before you buy.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex gap-3 justify-center"
              >
                {/* Refresh Button */}
                <Button 
                  onClick={fetchSounds}
                  variant="outline"
                  className="font-bold border-border"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                
                {/* Upload Button */}
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="shadow-[0_0_15px_hsl(var(--primary)/0.3)] font-bold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add a Sound
                </Button>
              </motion.div>
            </div>

            {loading ? (
              // Loading Skeleton
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-card border border-border/50 rounded-2xl p-6 animate-pulse">
                    <div className="flex justify-between mb-4">
                      <div className="w-1/3 h-6 bg-muted rounded"></div>
                      <div className="w-16 h-4 bg-muted rounded-full"></div>
                    </div>
                    <div className="w-full h-16 bg-muted/50 rounded mb-4"></div>
                    <div className="flex justify-between items-center pt-4 border-t border-border/50">
                      <div className="w-10 h-10 bg-muted rounded-full"></div>
                      <div className="w-32 h-4 bg-muted rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              // Error State
              <div className="text-center py-24 bg-card rounded-2xl border border-border">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={fetchSounds} variant="outline" className="border-border hover:bg-muted">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : sounds.length > 0 ? (
              // Sound Grid
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {sounds.map((sound, index) => (
                  <motion.div
                    key={sound.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <AudioPlayerCard sound={sound} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              // Empty State
              <div className="text-center py-32 bg-card rounded-2xl border border-border">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No sounds available</h3>
                <p className="text-muted-foreground mb-6">Be the first to add a sound to the library.</p>
                <Button onClick={() => setIsModalOpen(true)} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Now
                </Button>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>

      <SoundUploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleUploadSuccess} 
      />
    </>
  );
};

export default SoundPreviewPage;
