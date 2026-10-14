
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import CheckoutButton from '@/components/CheckoutButton.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, getTotal } = useCart();
  const { isAuthenticated } = useAuth();

  const imageUrl = (product) => {
    return product.productImage 
      ? pb.files.getUrl(product, product.productImage)
      : null;
  };

  return (
    <>
      <Helmet>
        <title>Cart - EDM Store</title>
        <meta name="description" content="Review your cart and proceed to checkout" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-extrabold mb-10" style={{ letterSpacing: '-0.02em' }}>
                Shopping Cart
              </h1>

              {cart.length === 0 ? (
                <div className="text-center py-24 bg-card border border-border rounded-2xl">
                  <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Looks like you haven't added any sounds to your arsenal yet.
                  </p>
                  <Link to="/products">
                    <Button size="lg" className="shadow-[0_0_15px_hsl(var(--primary)/0.3)]">Browse Products</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 space-y-6">
                    {cart.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="bg-card border-border hover:border-primary/30 transition-colors duration-300">
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row gap-6">
                              {imageUrl(item) ? (
                                <div className="w-full sm:w-32 aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border/50">
                                  <img 
                                    src={imageUrl(item)} 
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-full sm:w-32 aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border/50 flex items-center justify-center">
                                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">No Image</span>
                                </div>
                              )}
                              
                              <div className="flex-1 flex flex-col justify-between">
                                <div>
                                  <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg mb-1 text-foreground pr-4">{item.name}</h3>
                                    <button
                                      onClick={() => removeFromCart(item.id)}
                                      className="text-muted-foreground hover:text-destructive transition-colors duration-200"
                                      aria-label="Remove item"
                                    >
                                      <Trash2 className="w-5 h-5" />
                                    </button>
                                  </div>
                                  {item.category && (
                                    <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 rounded mb-3">
                                      {item.category}
                                    </span>
                                  )}
                                </div>
                                
                                <div className="flex items-end justify-between mt-4">
                                  <p className="text-xl font-black text-foreground">
                                    ${item.price.toFixed(2)}
                                  </p>

                                  <div className="flex items-center gap-3 bg-background border border-border rounded-lg p-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 hover:text-primary"
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                      <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="w-6 text-center font-bold font-mono">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 hover:text-primary"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  <div className="lg:col-span-1">
                    <Card className="bg-card border-border sticky top-24 shadow-[0_0_30px_-10px_rgba(0,0,0,0.5)]">
                      <CardContent className="p-8">
                        <h2 className="text-xl font-bold mb-6 border-b border-border/50 pb-4">Order Summary</h2>
                        
                        <div className="space-y-4 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-semibold text-foreground">${getTotal().toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax</span>
                            <span className="font-semibold text-foreground">$0.00</span>
                          </div>
                        </div>

                        <div className="border-t border-border/50 pt-6 mb-8">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-lg">Total</span>
                            <span className="text-3xl font-black text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.2)]">
                              ${getTotal().toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {isAuthenticated ? (
                          <div className="shadow-[0_0_15px_hsl(var(--primary)/0.3)] rounded-md">
                             <CheckoutButton cart={cart} />
                          </div>
                        ) : (
                          <div className="space-y-4 bg-background p-4 rounded-xl border border-border">
                            <p className="text-sm text-muted-foreground text-center">
                              Please log in to complete your purchase
                            </p>
                            <Link to="/login" className="block">
                              <Button className="w-full">Login to Checkout</Button>
                            </Link>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CartPage;
