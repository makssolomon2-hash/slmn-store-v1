
import React from 'react';
import { Headphones, Video, FileText } from 'lucide-react';

const MOCK_DATA = [
  { id: 1, title: 'Summer Festival Mix', type: 'DJ Set', desc: 'High energy house mix' },
  { id: 2, title: 'Serum Basics', type: 'Tutorial', desc: 'Learn the fundamentals' },
  { id: 3, title: 'Studio Setup Guide', type: 'Resource', desc: 'PDF reference for beginners' },
];

const LiteMediaPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Area */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold mb-4">Lite Media Center</h1>
          <p className="text-lg text-muted-foreground">
            A simplified view of our media resources. This layout uses standard CSS Grid without complex tab state logic.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          
          {MOCK_DATA.map((item) => (
            <div key={item.id} className="lite-card p-6 flex flex-col h-full hover:border-[hsl(var(--primary))] transition-colors">
              
              {/* Top Icon Area */}
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                {item.type === 'DJ Set' && <Headphones className="w-6 h-6" />}
                {item.type === 'Tutorial' && <Video className="w-6 h-6" />}
                {item.type === 'Resource' && <FileText className="w-6 h-6" />}
              </div>

              {/* Text Area */}
              <div className="mb-6 flex-grow">
                <span className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary))] block mb-1">
                  {item.type}
                </span>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>

              {/* Button */}
              <button className="lite-button w-full mt-auto text-sm py-2">
                Open {item.type}
              </button>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default LiteMediaPage;
