
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ProductCard from '@/components/ProductCard.jsx';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const records = await pb.collection('products').getFullList({
          sort: '-created',
          $autoCancel: false
        });
        setProducts(records);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['all', 'Sample Packs', 'Serum Presets', 'Phase Plant Presets'];
  
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>Products - SLMN Sound</title>
        <meta name="description" content="Browse our collection of premium EDM sample packs and presets" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-16 px-4 max-w-7xl mx-auto w-full">
          
          <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-balance">
              SLMN Sound Catalog
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover premium tools engineered for modern electronic music production.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mb-12 justify-center md:justify-start">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold uppercase transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground border border-border hover:border-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="product-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[400px] bg-card border border-border rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-card rounded-2xl border border-border">
              <p className="text-muted-foreground text-lg">No products found in this category.</p>
              <button 
                onClick={() => setSelectedCategory('all')}
                className="mt-4 text-primary hover:underline font-bold"
              >
                Clear filters
              </button>
            </div>
          )}
          
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProductsPage;
