
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext.jsx';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check, Music } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

/**
 * ProductCard Component
 * 
 * This component displays a single product in a grid.
 * It shows the product image, name, price, and an "Add to Cart" button.
 * 
 * @param {Object} props.product - The product data from the database
 */
const ProductCard = ({ product }) => {
  // Get the addToCart function from our CartContext
  const { addToCart } = useCart();
  
  // State to track if the item was just added (shows a checkmark temporarily)
  const [added, setAdded] = useState(false);

  // Function that runs when the "Add to Cart" button is clicked
  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating to the product detail page when clicking the button
    addToCart(product); // Add item to cart
    setAdded(true);     // Show checkmark
    toast.success('Added to cart'); // Show popup notification
    
    // Change back to normal cart icon after 2 seconds
    setTimeout(() => setAdded(false), 2000);
  };

  // Generate the full URL for the product image using PocketBase
  const imageUrl = product.productImage 
    ? pb.files.getUrl(product, product.productImage)
    : null;

  return (
    /* 
      We wrap the entire card in a Link so clicking anywhere on the card 
      takes the user to the product detail page.
      We use the 'simple-product-card' class defined in products.css.
    */
    <Link to={`/product/${product.id}`} className="simple-product-card group">
      
      {/* --- IMAGE SECTION --- */}
      <div className="product-card-image-container">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={product.name}
            className="product-card-image"
          />
        ) : (
          // Fallback if there is no image
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
            <Music className="w-12 h-12 mb-2 opacity-30 text-primary" />
            <span className="text-xs uppercase tracking-widest opacity-50">No Cover</span>
          </div>
        )}
      </div>
      
      {/* --- CONTENT SECTION --- */}
      <div className="product-card-content">
        
        {/* Category Badge */}
        {product.category && (
          <span className="product-category-badge">
            {product.category}
          </span>
        )}
        
        {/* Product Title */}
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        {/* Product Description (limited to 2 lines) */}
        {product.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
            {product.description}
          </p>
        )}
        
        {/* Price and Format */}
        <div className="mt-auto pt-4 border-t border-border/50">
          {product.fileFormat && (
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
              {product.fileFormat}
            </p>
          )}
          <p className="text-2xl font-black text-foreground">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
      
      {/* --- FOOTER / BUTTON SECTION --- */}
      <div className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full font-bold"
          disabled={added}
          variant={added ? "secondary" : "default"}
        >
          {added ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Added
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </Link>
  );
};

export default ProductCard;
