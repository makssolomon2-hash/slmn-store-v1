
import React from 'react';
import { Link } from 'react-router-dom';

/*
======================================================================
  LITE FOOTER COMPONENT
======================================================================
  LEARNING NOTE:
  The footer sits at the very bottom of the page. 
  It's useful for copyright info, secondary links, and social media.
  
  Notice how we use `className="mt-auto"` in the App.jsx file (later on) 
  to push this footer to the bottom of the screen!
*/

const LiteFooter = () => {
  // We get the current year dynamically using JavaScript's Date object
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-12">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Branding on the left */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">SLMN Sound</span>
          <span className="text-gray-400 text-sm">| Beginner Edition</span>
        </div>

        {/* Links in the middle */}
        <div className="flex gap-4 text-sm text-gray-500">
          <Link to="/lite" className="hover:text-[hsl(var(--primary))] transition-colors">Home</Link>
          <Link to="/lite/products" className="hover:text-[hsl(var(--primary))] transition-colors">Products</Link>
          <Link to="/lite/about" className="hover:text-[hsl(var(--primary))] transition-colors">About</Link>
        </div>

        {/* Copyright on the right */}
        <div className="text-sm text-gray-400">
          &copy; {currentYear} SLMN Sound. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default LiteFooter;
