
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useCart } from '@/contexts/CartContext.jsx';
import { useTheme } from '@/hooks/useTheme.js';
import { Menu, X, ShoppingCart, User, LogOut, Code, FileCode, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { getItemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/sounds', label: 'Sounds' },
    { path: '/media', label: 'Media' },
    { path: '/studio', label: 'Web Studio' },
    { path: '/cart', label: 'Cart' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_hsl(var(--primary)/0.4)] transition-all duration-300">
              <span className="text-xl font-bold text-primary-foreground">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground transition-colors duration-300">
              SLMN Sound
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Controls & Toggles */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Dark/Light Mode Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              className="hover:text-primary hover:bg-primary/10 transition-colors text-muted-foreground"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Version Switchers */}
            <div className="hidden lg:flex items-center gap-2">
              <Link to="/lite" aria-label="Switch to Lite Version" className="version-btn-react">
                <Code className="w-3.5 h-3.5 mr-1.5" />
                Lite Mode
              </Link>
              <a href="/vanilla-home/index.html" aria-label="Switch to Vanilla Version" className="version-btn-react">
                <FileCode className="w-3.5 h-3.5 mr-1.5" />
                Vanilla
              </a>
            </div>

            <div className="w-px h-6 bg-border mx-1 hidden lg:block"></div>

            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10 transition-colors text-muted-foreground">
                <ShoppingCart className="w-5 h-5" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center shadow-[0_0_10px_hsl(var(--primary)/0.6)]">
                    {getItemCount()}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/account">
                  <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10 transition-colors text-muted-foreground">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout} className="hover:text-destructive hover:bg-destructive/10 transition-colors text-muted-foreground">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hover:text-foreground text-muted-foreground transition-colors">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="shadow-[0_0_15px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_20px_hsl(var(--primary)/0.6)] hover:bg-primary/90 transition-all text-primary-foreground">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <button
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background">
            <nav className="flex flex-col space-y-4">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-bold transition-colors duration-200 px-2 ${
                    isActive(link.path)
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <Link
                  to="/lite"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center text-sm font-bold text-muted-foreground hover:text-primary px-2 transition-colors"
                >
                  <Code className="w-4 h-4 mr-2" />
                  Lite Mode
                </Link>
                <a
                  href="/vanilla-home/index.html"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center text-sm font-bold text-muted-foreground hover:text-primary px-2 transition-colors"
                >
                  <FileCode className="w-4 h-4 mr-2" />
                  Vanilla HTML
                </a>
              </div>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-bold text-muted-foreground hover:text-foreground px-2"
                  >
                    Account
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-bold text-muted-foreground text-left hover:text-destructive px-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2 px-2 border-t border-border">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start border-border hover:text-foreground">Login</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-start shadow-[0_0_15px_hsl(var(--primary)/0.2)] text-primary-foreground">Sign Up</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
