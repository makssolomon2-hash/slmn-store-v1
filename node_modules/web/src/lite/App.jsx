
import React from 'react';
import { Routes, Route } from 'react-router-dom';

/* Import our Custom Styles */
import './index.css';

/* Import our Lite Components */
import LiteHeader from './components/LiteHeader.jsx';
import LiteFooter from './components/LiteFooter.jsx';

/* Import our Lite Pages */
import LiteHomePage from './pages/LiteHomePage.jsx';
import LiteProductsPage from './pages/LiteProductsPage.jsx';
import LiteAboutPage from './pages/LiteAboutPage.jsx';
import LiteMediaPage from './pages/LiteMediaPage.jsx';
import LiteStudioPage from './pages/LiteStudioPage.jsx';

const LiteApp = () => {
  return (
    <div className="lite-theme min-h-screen flex flex-col bg-background font-sans transition-colors duration-300">
      
      {/* 2. PERSISTENT HEADER */}
      <LiteHeader />

      {/* 3. MAIN CONTENT AREA */}
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<LiteHomePage />} />
          <Route path="/products" element={<LiteProductsPage />} />
          <Route path="/media" element={<LiteMediaPage />} />
          <Route path="/studio" element={<LiteStudioPage />} />
          <Route path="/about" element={<LiteAboutPage />} />

          {/* Catch-all for 404s inside the lite app */}
          <Route path="*" element={
            <div className="text-center py-32 text-foreground">
              <h1 className="text-4xl font-bold">404 - Not Found</h1>
              <p className="text-muted-foreground mt-4">This lite page doesn't exist.</p>
            </div>
          } />
        </Routes>
      </main>

      {/* 4. PERSISTENT FOOTER */}
      <LiteFooter />

    </div>
  );
};

export default LiteApp;
