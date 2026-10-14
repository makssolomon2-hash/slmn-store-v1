
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-card text-card-foreground border-t border-border mt-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-border to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_hsl(var(--primary)/0.2)]">
                <span className="text-xl font-bold text-primary-foreground">S</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                SLMN Sound
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Premium EDM production tools for music producers worldwide. Elevate your sound with industry-standard samples and presets.
            </p>
          </div>

          {/* Links */}
          <div>
            <span className="block font-semibold mb-6 text-foreground tracking-wide uppercase text-sm">Quick Links</span>
            <div className="flex flex-col space-y-3">
              <Link to="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                Products
              </Link>
              <Link to="/cart" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                Cart
              </Link>
              <Link to="/account" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                Account
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <span className="block font-semibold mb-6 text-foreground tracking-wide uppercase text-sm">Legal</span>
            <div className="flex flex-col space-y-3">
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors duration-200">Privacy Policy</span>
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors duration-200">Terms of Service</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-12 pt-8 text-center md:flex md:justify-between md:text-left">
          <p className="text-sm text-muted-foreground">
            © 2026 SLMN Sound. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0 flex items-center justify-center md:justify-end gap-1">
            Powered by <span className="text-primary font-medium">SLMN Technology</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
