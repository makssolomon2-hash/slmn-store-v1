
import React from 'react';

const LiteAboutPage = () => {
  return (
    <div className="py-16 px-4 max-w-3xl mx-auto bg-card min-h-[60vh] mt-8 rounded-2xl shadow-sm border border-border transition-colors duration-300">
      
      <h1 className="text-4xl font-extrabold text-foreground mb-6 text-balance">
        About SLMN Sound Lite
      </h1>
      
      <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
        
        <p>
          Welcome to the <strong>Lite Version</strong> of the SLMN Sound application. 
          This special section of the website was built exclusively for beginners to learn 
          how modern React applications are put together.
        </p>

        <p>
          While the main application features complex 3D animations, sophisticated state management, 
          and advanced UI components (shadcn/ui), this Lite version goes back to the basics:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-foreground bg-muted p-6 rounded-xl border border-border">
          <li><strong>Clean React Components:</strong> Standard, easy-to-read JSX.</li>
          <li><strong>Basic Tailwind CSS:</strong> No overly complex utility chains.</li>
          <li><strong>Simple Data Fetching:</strong> Straightforward integration with PocketBase.</li>
          <li><strong>Heavily Commented Code:</strong> Explanations written directly in the source files.</li>
        </ul>

        <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">
          How to use this section
        </h2>

        <p>
          We encourage you to open the <code className="bg-muted px-1 py-0.5 rounded text-foreground">apps/web/src/lite/</code> directory in your code editor. 
          Read the <code className="bg-muted px-1 py-0.5 rounded text-foreground">LITE_LEARNING_GUIDE.md</code> file, break things, change colors, and see how the application reacts!
        </p>

      </div>
    </div>
  );
};

export default LiteAboutPage;
