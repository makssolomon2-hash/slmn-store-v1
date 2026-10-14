
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Play, FileText, Video, Headphones, Link as LinkIcon, Clock } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';

const MOCK_DJ_SETS = [
  { id: 1, title: 'Summer Festival Mix 2025', artist: 'SLMN', duration: '1:45:00', tags: ['House', 'Techno'], img: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?auto=format&fit=crop&w=600&q=80' },
  { id: 2, title: 'Deep Underground Vol. 4', artist: 'SLMN', duration: '2:10:00', tags: ['Deep House', 'Minimal'], img: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=600&q=80' },
  { id: 3, title: 'Studio Session Live', artist: 'SLMN', duration: '0:55:00', tags: ['Live', 'Experimental'], img: 'https://images.unsplash.com/photo-1516280440502-86105342200d?auto=format&fit=crop&w=600&q=80' }
];

const MOCK_TUTORIALS = [
  { id: 1, title: 'Advanced Sound Design in Serum', level: 'Advanced', views: '12.4k', duration: '18:20', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80' },
  { id: 2, title: 'Mixing Low End for Club Systems', level: 'Intermediate', views: '8.2k', duration: '22:15', img: 'https://images.unsplash.com/photo-1558546193-d14fb400a0be?auto=format&fit=crop&w=600&q=80' },
  { id: 3, title: 'Arrangement Techniques', level: 'Beginner', views: '24.1k', duration: '15:40', img: 'https://images.unsplash.com/photo-1619983081563-430f63602796?auto=format&fit=crop&w=600&q=80' },
  { id: 4, title: 'Mastering Chain Breakdown', level: 'Advanced', views: '15.6k', duration: '31:00', img: 'https://images.unsplash.com/photo-1563330232-57114bb0823c?auto=format&fit=crop&w=600&q=80' }
];

const MOCK_RESOURCES = [
  { id: 1, title: 'Ultimate EQ Cheat Sheet', type: 'PDF Guide', icon: FileText },
  { id: 2, title: 'Sample Pack Directory', type: 'External Link', icon: LinkIcon },
  { id: 3, title: 'Compression Demystified', type: 'Article', icon: FileText },
  { id: 4, title: 'Studio Gear Recommendations', type: 'External Link', icon: LinkIcon }
];

const MediaPage = () => {
  const [activeTab, setActiveTab] = useState('sets');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate network loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const tabs = [
    { id: 'sets', label: 'DJ Sets', icon: Headphones },
    { id: 'tutorials', label: 'Tutorials', icon: Video },
    { id: 'resources', label: 'Resources', icon: FileText },
  ];

  return (
    <>
      <Helmet>
        <title>Media & Resources - SLMN Sound</title>
        <meta name="description" content="Explore DJ sets, music production tutorials, and studio resources." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <Header />

        <main className="flex-1 w-full">
          
          {/* Header Section */}
          <section className="pt-20 pb-12 px-4 border-b border-border bg-card/30">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-balance">
                Media Center
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Dive into our curated collection of live sets, masterclass tutorials, and essential production resources designed to elevate your workflow.
              </p>

              {/* Custom Tabs Navigation */}
              <div className="flex flex-wrap gap-2 mt-10">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'bg-primary text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.3)]' 
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Content Section */}
          <section className="py-12 px-4 min-h-[500px]">
            <div className="max-w-7xl mx-auto">
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex flex-col space-y-4">
                      <div className="w-full h-48 bg-muted animate-pulse rounded-2xl"></div>
                      <div className="w-3/4 h-6 bg-muted animate-pulse rounded"></div>
                      <div className="w-1/2 h-4 bg-muted animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  
                  {/* DJ SETS */}
                  {activeTab === 'sets' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {MOCK_DJ_SETS.map(set => (
                        <div key={set.id} className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300">
                          <div className="relative h-48 overflow-hidden bg-muted">
                            <img src={set.img} alt={set.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Button size="icon" className="rounded-full w-12 h-12 shadow-[0_0_20px_hsl(var(--primary)/0.5)]">
                                <Play className="w-5 h-5 ml-1" />
                              </Button>
                            </div>
                            <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded-md flex items-center">
                              <Clock className="w-3 h-3 mr-1" /> {set.duration}
                            </div>
                          </div>
                          <div className="p-5">
                            <div className="flex gap-2 mb-3">
                              {set.tags.map(tag => (
                                <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <h3 className="font-bold text-lg text-foreground line-clamp-1">{set.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">Mixed by {set.artist}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TUTORIALS */}
                  {activeTab === 'tutorials' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {MOCK_TUTORIALS.map(tut => (
                        <div key={tut.id} className="flex flex-col sm:flex-row bg-card rounded-2xl border border-border overflow-hidden group hover:border-primary/50 transition-all duration-300">
                          <div className="relative w-full sm:w-2/5 h-48 sm:h-auto bg-muted">
                            <img src={tut.img} alt={tut.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                              {tut.duration}
                            </div>
                          </div>
                          <div className="p-5 flex flex-col justify-center w-full sm:w-3/5">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                              {tut.level} Level
                            </span>
                            <h3 className="font-bold text-lg text-foreground mb-2 leading-snug">{tut.title}</h3>
                            <div className="flex items-center justify-between mt-auto pt-4">
                              <span className="text-sm text-muted-foreground">{tut.views} views</span>
                              <Button variant="ghost" size="sm" className="hover:text-primary hover:bg-primary/10">
                                Watch <Play className="w-3 h-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* RESOURCES */}
                  {activeTab === 'resources' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {MOCK_RESOURCES.map(resource => (
                        <a key={resource.id} href="#" className="flex flex-col items-center text-center p-8 bg-card border border-border rounded-2xl hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                            <resource.icon className="w-8 h-8 text-foreground" />
                          </div>
                          <h3 className="font-bold text-foreground mb-1">{resource.title}</h3>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{resource.type}</span>
                        </a>
                      ))}
                    </div>
                  )}

                </motion.div>
              )}
            </div>
          </section>

        </main>
        <Footer />
      </div>
    </>
  );
};

export default MediaPage;
