
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { CartProvider } from '@/contexts/CartContext.jsx';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';

/* Main App Pages */
import HomePage from '@/pages/HomePage.jsx';
import ProductsPage from '@/pages/ProductsPage.jsx';
import ProductDetailPage from '@/pages/ProductDetailPage.jsx';
import SoundPreviewPage from '@/pages/SoundPreviewPage.jsx';
import MediaPage from '@/pages/MediaPage.jsx';
import StudioPage from '@/pages/StudioPage.jsx';
import CartPage from '@/pages/CartPage.jsx';
import AccountDashboard from '@/pages/AccountDashboard.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import SignupPage from '@/pages/SignupPage.jsx';
import SuccessPage from '@/pages/SuccessPage.jsx';
import CancelPage from '@/pages/CancelPage.jsx';

/* Lite Version Sub-Application */
import LiteApp from '@/lite/App.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/lite/*" element={<LiteApp />} />

            {/* Standard Main App Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/sounds" element={<SoundPreviewPage />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/studio" element={<StudioPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/cancel" element={<CancelPage />} />
            <Route 
              path="/account" 
              element={
                <ProtectedRoute>
                  <AccountDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 Catch-all */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                  <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist</p>
                  <a href="/" className="text-primary hover:underline">Back to Home</a>
                </div>
              </div>
            } />
          </Routes>
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
