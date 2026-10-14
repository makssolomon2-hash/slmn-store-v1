
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useCart } from '@/contexts/CartContext.jsx';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check, ArrowLeft, Music } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { id } = useParams();
  
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const record = await pb.collection('products').getOne(id, {
          $autoCancel: false
        });
        setProduct(record);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setAdded(true);
    toast.success('Added to cart');
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl font-bold mb-4">Oops!</h1>
          <p className="text-muted-foreground mb-8">{error || 'Product not found.'}</p>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const imageUrl = product.productImage 
    ? pb.files.getUrl(product, product.productImage)
    : null;

  return (
    <>
      <Helmet>
        <title>{`${product.name} - SLMN Sound`}</title>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-12 px-4 max-w-7xl mx-auto w-full">
          
          <Link to="/products" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Catalog
          </Link>

          <div className="product-detail-container">
            
            <div className="product-detail-image bg-muted aspect-square flex items-center justify-center">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Music className="w-24 h-24 opacity-20 text-primary" />
              )}
            </div>

            <div className="flex flex-col">
              {product.category && (
                <span className="text-primary font-bold uppercase tracking-wider text-sm mb-2">
                  {product.category}
                </span>
              )}
              
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-balance">
                {product.name}
              </h1>
              
              <p className="text-3xl font-black text-foreground mb-8">
                ${product.price.toFixed(2)}
              </p>

              <div className="bg-card border border-border rounded-xl p-6 mb-8">
                <h3 className="font-bold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {product.description || 'No description available.'}
                </p>
                
                {product.fileFormat && (
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <span className="text-sm text-muted-foreground">Format: </span>
                    <span className="font-bold">{product.fileFormat}</span>
                  </div>
                )}
              </div>

              <Button 
                size="lg"
                onClick={handleAddToCart}
                className="w-full h-14 text-lg font-bold shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                disabled={added}
                variant={added ? "secondary" : "default"}
              >
                {added ? (
                  <>
                    <Check className="w-6 h-6 mr-2" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6 mr-2" />
                    Add to Cart - ${product.price.toFixed(2)}
                  </>
                )}
              </Button>
            </div>
            
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetailPage;
