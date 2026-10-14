
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useCart } from '@/contexts/CartContext.jsx';
import apiServerClient from '@/lib/apiServerClient';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Download, Disc } from 'lucide-react';
import { toast } from 'sonner';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [payment, setPayment] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || !currentUser) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiServerClient.fetch(`/stripe/session/${sessionId}`);
        if (!response.ok) throw new Error('Failed to verify payment');
        
        const paymentData = await response.json();
        setPayment(paymentData);

        if (paymentData.status === 'paid') {
          const orderData = {
            userId: currentUser.id,
            stripeSessionId: sessionId,
            totalAmount: paymentData.amountTotal / 100,
            status: 'completed',
            items: paymentData.items.map(item => ({
              productName: item.name,
              price: item.amount / 100
            }))
          };

          const createdOrder = await pb.collection('orders').create(orderData, { $autoCancel: false });
          setOrder(createdOrder);
          clearCart();
          toast.success('Transaction secured successfully');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        toast.error('Failed to verify payment data');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, currentUser, clearCart]);

  if (!sessionId) {
    return (
      <>
        <Helmet>
          <title>Payment - EDM Store</title>
        </Helmet>
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-6 text-lg">Invalid session parameters detected.</p>
              <Link to="/products">
                <Button variant="outline">Return to Catalog</Button>
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment Successful - EDM Store</title>
        <meta name="description" content="Your transaction was successful" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 py-16 relative">
           <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {loading ? (
              <div className="text-center py-32 bg-card rounded-2xl border border-border">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">Verifying Transaction...</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="bg-card border-border overflow-hidden">
                  <div className="h-2 w-full bg-gradient-to-r from-primary to-accent"></div>
                  <CardContent className="p-10 text-center">
                    <div className="w-24 h-24 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                      <CheckCircle className="w-12 h-12 text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
                      <div className="absolute inset-0 rounded-full border border-primary/40 animate-ping"></div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black mb-3 text-foreground">Transaction Complete</h1>
                    <p className="text-muted-foreground mb-10 max-w-md mx-auto">
                      Your sounds are ready for download. Prepare to elevate your next track.
                    </p>

                    {payment && (
                      <div className="bg-background rounded-xl p-8 mb-8 text-left border border-border/50">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Order Ref</span>
                            <span className="font-mono text-sm text-foreground">{order?.id || sessionId.slice(0, 10) + '...'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email</span>
                            <span className="text-sm text-foreground font-medium">{payment.customerEmail || currentUser?.email}</span>
                          </div>
                          <div className="flex justify-between items-center pt-4 border-t border-border/50">
                            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Total Paid</span>
                            <span className="text-xl font-black text-primary drop-shadow-[0_0_5px_hsl(var(--primary)/0.3)]">
                              ${(payment.amountTotal / 100).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {payment.items && payment.items.length > 0 && (
                          <div className="mt-8 pt-8 border-t border-border/50">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">Acquired Assets</p>
                            <div className="space-y-3">
                              {payment.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-sm p-3 bg-card rounded-lg border border-border/30">
                                  <div className="flex items-center gap-3">
                                    <Disc className="w-4 h-4 text-accent" />
                                    <span className="text-foreground font-medium">{item.name}</span>
                                  </div>
                                  <span className="text-muted-foreground">
                                    ${(item.amount / 100).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                      <Link to="/account">
                        <Button size="lg" className="w-full sm:w-auto shadow-[0_0_15px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_25px_hsl(var(--primary)/0.5)]">
                          <Download className="w-5 h-5 mr-2" />
                          Access Library
                        </Button>
                      </Link>
                      <Link to="/products">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto border-border hover:bg-muted">
                          Return to Catalog
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SuccessPage;
