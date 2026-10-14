
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import OrderHistoryCard from '@/components/OrderHistoryCard.jsx';
import SubscriptionManagement from '@/components/SubscriptionManagement.jsx';
import { User, Package, Settings, Download, CreditCard } from 'lucide-react';

const AccountDashboard = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('library');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const records = await pb.collection('orders').getFullList({
          filter: `userId = "${currentUser.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        setOrders(records);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  const tabs = [
    { id: 'library', label: 'Purchase Library', icon: Download },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
  ];

  return (
    <>
      <Helmet>
        <title>Account - SLMN Sound</title>
        <meta name="description" content="Manage your account, view purchase history, and handle subscriptions." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-extrabold mb-10" style={{ letterSpacing: '-0.02em' }}>
                Account Area
              </h1>

              {/* Top Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-colors duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <User className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">Profile Info</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Name</p>
                      <p className="font-semibold text-lg">{currentUser?.name || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                      <p className="font-medium">{currentUser?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-8 hover:border-accent/30 transition-colors duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                      <Package className="w-7 h-7 text-accent" />
                    </div>
                    <h2 className="text-xl font-bold">Total Orders</h2>
                  </div>
                  <p className="text-5xl font-black text-accent drop-shadow-[0_0_10px_hsl(var(--accent)/0.3)]">{orders.length}</p>
                  <p className="text-sm text-muted-foreground mt-2">Lifetime purchases</p>
                </div>
                
                <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-colors duration-300 flex flex-col justify-center items-center text-center">
                   <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-4">
                      <Settings className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Account settings coming soon</p>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="flex gap-4 mb-8 border-b border-border pb-px overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center pb-4 px-2 font-semibold transition-colors duration-200 relative whitespace-nowrap ${
                      activeTab === tab.id 
                        ? 'text-primary' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Library Tab */}
                  {activeTab === 'library' && (
                    <div>
                      {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {[1, 2].map(i => (
                            <div key={i} className="h-64 bg-card rounded-2xl animate-pulse border border-border"></div>
                          ))}
                        </div>
                      ) : orders.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {orders.map((order, index) => (
                            <motion.div
                              key={order.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <OrderHistoryCard order={order} />
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-24 bg-card rounded-2xl border border-border">
                          <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-muted-foreground" />
                          </div>
                          <h3 className="text-2xl font-bold mb-3">No files found</h3>
                          <p className="text-muted-foreground max-w-sm mx-auto">
                            Your library is empty. Your purchased sample packs and presets will appear here for download.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Subscription Tab */}
                  {activeTab === 'subscription' && (
                    <SubscriptionManagement />
                  )}
                </motion.div>
              </AnimatePresence>

            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AccountDashboard;
