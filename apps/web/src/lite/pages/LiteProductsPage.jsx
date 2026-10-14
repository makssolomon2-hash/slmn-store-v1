
import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const LiteProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const result = await pb.collection('products').getList(1, 20, {
        sort: '-created',
        $autoCancel: false
      });
      setProducts(result.items);
    } catch (error) {
      console.error("Error fetching products:", error);
      setErrorMessage("Could not load products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="py-16 px-4 max-w-5xl mx-auto transition-colors duration-300">
      
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">Our Products</h1>
        <p className="text-muted-foreground">
          This data is being loaded directly from the PocketBase `products` collection!
        </p>
      </div>

      {isLoading && (
        <div className="text-center py-20 bg-card rounded-lg border border-border">
          <p className="text-xl font-medium text-muted-foreground">Loading products from database...</p>
          <p className="text-sm text-muted-foreground/70 mt-2">Please wait a moment.</p>
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-lg text-center">
          <h3 className="font-bold text-lg mb-2">Oops!</h3>
          <p>{errorMessage}</p>
        </div>
      )}

      {!isLoading && !errorMessage && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          
          {products.map((product) => (
            <div key={product.id} className="lite-card flex flex-col h-full">
              <div className="h-48 bg-muted flex items-center justify-center border-b border-border">
                <span className="text-muted-foreground font-medium">Image Area</span>
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                {product.category && (
                  <span className="text-xs font-bold text-[hsl(var(--primary))] uppercase tracking-wider mb-2 block">
                    {product.category}
                  </span>
                )}
                
                <h3 className="text-xl font-bold text-foreground mb-2">{product.name}</h3>
                
                <p className="text-2xl font-black text-foreground mb-4 mt-auto">
                  ${product.price.toFixed(2)}
                </p>
                
                <button className="w-full lite-button py-2 bg-foreground text-background hover:opacity-90">
                  View Details
                </button>
              </div>
            </div>
          ))}

        </div>
      )}

      {!isLoading && !errorMessage && products.length === 0 && (
        <div className="text-center py-20 bg-card rounded-lg border border-border">
          <p className="text-xl font-medium text-foreground">No products found.</p>
          <p className="text-muted-foreground mt-2">Add some products in the PocketBase dashboard!</p>
        </div>
      )}

    </div>
  );
};

export default LiteProductsPage;
