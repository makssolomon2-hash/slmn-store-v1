
import React from 'react';
import { Link } from 'react-router-dom';

const LiteHomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <section className="bg-card py-24 px-4 text-center border-b border-border">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
            Welcome to the Lite Version
          </span>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight mb-6">
            Make music production <br className="hidden md:block" />
            <span className="text-[hsl(var(--primary))]">simple and fun.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            This is the beginner-friendly version of the SLMN Sound application. 
            It's designed with clean code, simple components, and lots of comments to help you learn React!
          </p>
          
          <Link to="/lite/products">
            <button className="lite-button text-lg px-8 py-4 shadow-lg shadow-primary/20">
              Explore Products
            </button>
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">What you'll learn to build</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              In the "Products" page, we'll replace these static examples with real data fetched directly from our database!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="lite-card p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">React Components</h3>
              <p className="text-muted-foreground text-sm">
                Learn how to break down your user interface into reusable building blocks.
              </p>
            </div>

            <div className="lite-card p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Tailwind CSS</h3>
              <p className="text-muted-foreground text-sm">
                Discover how to style your application quickly using utility classes directly in your HTML.
              </p>
            </div>

            <div className="lite-card p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Database Fetching</h3>
              <p className="text-muted-foreground text-sm">
                Connect your frontend application to PocketBase to read real, dynamic data!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LiteHomePage;
