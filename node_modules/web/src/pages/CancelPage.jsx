
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { XCircle, AlertCircle } from 'lucide-react';

const CancelPage = () => {
  return (
    <>
      <Helmet>
        <title>Payment Aborted - EDM Store</title>
        <meta name="description" content="Your transaction was interrupted" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 py-16 relative">
           <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-destructive/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-card border-border overflow-hidden">
                 <div className="h-1 w-full bg-destructive"></div>
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <AlertCircle className="w-10 h-10 text-destructive drop-shadow-[0_0_8px_hsl(var(--destructive)/0.5)]" />
                  </div>

                  <h1 className="text-3xl font-black mb-4 text-foreground">Transaction Aborted</h1>
                  <p className="text-muted-foreground mb-10 text-lg">
                    Your payment sequence was interrupted. No charges were made to your account.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-5 justify-center">
                    <Link to="/cart">
                      <Button size="lg" className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_0_15px_hsl(var(--destructive)/0.3)]">
                        Review Cart
                      </Button>
                    </Link>
                    <Link to="/products">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto border-border hover:bg-muted">
                        Continue Exploring
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CancelPage;
