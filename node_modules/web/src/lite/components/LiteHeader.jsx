
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme.js';
import { Sun, Moon } from 'lucide-react';

const LiteHeader = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/lite', label: 'Home' },
    { path: '/lite/products', label: 'Products' },
    { path: '/lite/sounds', label: 'Sounds' },
    { path: '/lite/media', label: 'Media' },
    { path: '/lite/studio', label: 'Web Studio' },
    { path: '/lite/about', label: 'About' }
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* BRANDING / LOGO SECTION */}
        <Link to="/lite" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          <span className="font-bold text-xl text-foreground tracking-tight hidden sm:block">
            SLMN <span className="text-[hsl(var(--primary))]">Lite</span>
          </span>
        </Link>

        {/* MAIN NAVIGATION LINKS */}
        <nav className="hidden lg:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={`font-medium transition-colors ${isActive(link.path) ? 'text-[hsl(var(--primary))]' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ACTIONS SECTION (Right side) */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <a href="/vanilla-home/index.html" className="version-btn-lite text-sm">
              Vanilla HTML
            </a>
            <Link to="/">
              <button className="version-btn-lite text-sm">
                Full Version
              </button>
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
};

export default LiteHeader;
